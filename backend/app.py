import asyncio
import os
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator

from legacy_model import predict_simple

from train_model import load_model

app = FastAPI(title="Temple Crowd Backend", version="1.0.0")

# Global state for realtime metrics (simple in-memory store)
class RealtimeMetrics(BaseModel):
    active_pilgrims: int
    queue_wait_time_min: int
    todays_offerings_inr: int
    events_today: int


metrics_state = RealtimeMetrics(
    active_pilgrims=2500, queue_wait_time_min=20, todays_offerings_inr=100_000, events_today=6
)

MODEL = None


def now_utc():
    return datetime.now(timezone.utc)


async def metrics_updater():
    rng = np.random.default_rng()
    while True:
        base = 2400 + rng.integers(-150, 150)
        hour = now_utc().hour
        if 8 <= hour <= 10:
            base += 400
        if 17 <= hour <= 19:
            base += 500

        wait = max(5, int(15 + (base - 2400) / 200 + rng.normal(0, 2)))
        offerings = max(10_000, int(metrics_state.todays_offerings_inr + rng.integers(500, 5000)))
        events = max(1, min(12, metrics_state.events_today + rng.integers(-1, 2)))

        metrics_state.active_pilgrims = int(max(50, base))
        metrics_state.queue_wait_time_min = wait
        metrics_state.todays_offerings_inr = offerings
        metrics_state.events_today = events
        await asyncio.sleep(10)


class PredictRequest(BaseModel):
    timestamp: Optional[datetime] = None
    is_holiday: Optional[int] = 0
    is_festival_day: Optional[int] = 0
    weather: Optional[str] = None  # sunny/cloudy/rainy/stormy

    @field_validator("is_holiday", "is_festival_day")
    @classmethod
    def _01(cls, v: Optional[int]):
        if v is None:
            return 0
        if v not in (0, 1):
            raise ValueError("must be 0 or 1")
        return v


class ForecastPoint(BaseModel):
    timestamp: datetime
    predicted_pilgrims: int


class SimplePredictRequest(BaseModel):
    day: str
    festival: str | None = "No"
    weather: str


@app.on_event("startup")
async def _startup():
    global MODEL
    MODEL, score = load_model()
    print(f"Model loaded. r2 on train: {score}")
    asyncio.create_task(metrics_updater())


@app.get("/api/realtime_metrics", response_model=RealtimeMetrics)
async def get_realtime():
    return metrics_state


@app.post("/api/predict_crowd")
async def predict(req: PredictRequest):
    if MODEL is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    ts = req.timestamp or now_utc()
    features = {
        "day_of_week": ts.weekday(),
        "month": ts.month,
        "hour": ts.hour,
        "weather": req.weather or "sunny",
        "is_weekend": 1 if ts.weekday() in (5, 6) else 0,
        "is_holiday": req.is_holiday or 0,
        "is_festival_day": req.is_festival_day or 0,
    }

    import pandas as pd

    X = pd.DataFrame([features])
    y_pred = MODEL.predict(X)[0]
    return {"predicted_pilgrims": int(max(0, round(y_pred)))}


@app.get("/api/crowd_forecast", response_model=List[ForecastPoint])
async def forecast(hours: int = 48):
    if MODEL is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    hours = max(1, min(240, int(hours)))

    import pandas as pd

    start = now_utc().replace(minute=0, second=0, microsecond=0)
    times = [start + timedelta(hours=i) for i in range(1, hours + 1)]

    rows = []
    for ts in times:
        rows.append(
            {
                "day_of_week": ts.weekday(),
                "month": ts.month,
                "hour": ts.hour,
                "weather": "sunny",
                "is_weekend": 1 if ts.weekday() in (5, 6) else 0,
                "is_holiday": 0,
                "is_festival_day": 0,
                "timestamp": ts,
            }
        )

    df = pd.DataFrame(rows)
    y = MODEL.predict(df[["day_of_week", "month", "hour", "weather", "is_weekend", "is_holiday", "is_festival_day"]])

    out = [ForecastPoint(timestamp=row["timestamp"], predicted_pilgrims=int(max(0, round(pred)))) for row, pred in zip(rows, y)]
    return out


@app.post("/api/predict_simple")
async def predict_simple_api(req: SimplePredictRequest):
    try:
        val = predict_simple(req.day, req.festival, req.weather)
        return {"predicted_crowd": int(val)}
    except Exception:
        # Heuristic fallback aligned with training signal
        day = (req.day or "").strip()
        festival = (req.festival or "No").strip()
        weather = (req.weather or "sunny").strip().lower()
        weekend = 1 if day in ("Saturday", "Sunday") else 0
        base = 2000
        weekend_boost = 1200 * weekend
        festival_boost = 3500 if festival and festival != "No" else 0
        # Approximate typical hour effect around peak
        hour_effect = 800
        weather_penalty = -600 if weather == "rainy" else (-1200 if weather == "stormy" else (-100 if weather == "cloudy" else 0))
        y = base + weekend_boost + festival_boost + hour_effect + weather_penalty
        return {"predicted_crowd": int(max(50, round(y)))}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
