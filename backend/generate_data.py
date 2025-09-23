import os
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from dateutil.relativedelta import relativedelta

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CSV_PATH = os.path.join(DATA_DIR, "crowd_timeseries.csv")

FESTIVALS = {
    (1, 14): "Makar Sankranti",
    (3, 8): "Mahashivratri",
    (8, 19): "Raksha Bandhan",
    (10, 31): "Diwali",
}

WEATHERS = ["sunny", "cloudy", "rainy", "stormy"]

rng = np.random.default_rng(42)


def generate(start: datetime, end: datetime, freq: str = "H") -> pd.DataFrame:
    idx = pd.date_range(start=start, end=end, freq=freq)
    df = pd.DataFrame({"timestamp": idx})
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["month"] = df["timestamp"].dt.month
    df["hour"] = df["timestamp"].dt.hour

    # Base demand curve by hour (peaks around morning/evening)
    base_by_hour = {
        **{h: 0.3 for h in range(0, 5)},
        **{h: 0.7 for h in range(5, 8)},
        **{h: 1.0 for h in range(8, 11)},
        **{h: 0.6 for h in range(11, 16)},
        **{h: 1.1 for h in range(16, 20)},
        **{h: 0.5 for h in range(20, 24)},
    }
    df["hour_factor"] = df["hour"].map(base_by_hour)

    # Weekends boost
    df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)

    # Holidays/festivals
    df["is_holiday"] = 0
    df["is_festival_day"] = 0
    for (m, d), _name in FESTIVALS.items():
        mask = (df["timestamp"].dt.month == m) & (df["timestamp"].dt.day == d)
        df.loc[mask, "is_festival_day"] = 1
        # Treat festivals as holidays too
        df.loc[mask, "is_holiday"] = 1

    # Random public holidays (~2 per month)
    holidays = set()
    cur = start
    while cur <= end:
        for _ in range(2):
            day = rng.integers(1, 28)
            holidays.add((cur.month, day))
        cur += relativedelta(months=1)
    for (m, d) in holidays:
        mask = (df["timestamp"].dt.month == m) & (df["timestamp"].dt.day == d)
        df.loc[mask, "is_holiday"] = 1

    # Weather pattern (make rainy seasons around months 6-9 more rainy)
    probs = np.array([0.55, 0.25, 0.18, 0.02])
    probs_monsoon = np.array([0.3, 0.25, 0.4, 0.05])
    weather = []
    for m in df["month"]:
        p = probs_monsoon if 6 <= m <= 9 else probs
        weather.append(rng.choice(WEATHERS, p=p))
    df["weather"] = weather

    # Numeric encodings
    df["weather_rainy"] = (df["weather"] == "rainy").astype(int)
    df["weather_stormy"] = (df["weather"] == "stormy").astype(int)

    # Construct pilgrim_count with signal + noise
    base = 2000
    weekend_boost = 1200 * df["is_weekend"]
    holiday_boost = 1700 * df["is_holiday"]
    festival_boost = 3500 * df["is_festival_day"]
    hour_effect = 800 * df["hour_factor"]
    weather_penalty = -600 * df["weather_rainy"] + -1200 * df["weather_stormy"]

    noise = rng.normal(0, 200, size=len(df))

    demand = base + weekend_boost + holiday_boost + festival_boost + hour_effect + weather_penalty + noise
    demand = np.clip(demand, 50, None)

    df["pilgrim_count"] = demand.round().astype(int)

    return df


def main():
    os.makedirs(DATA_DIR, exist_ok=True)
    end = datetime.utcnow()
    start = end - timedelta(days=365 * 2)
    df = generate(start, end)
    df.to_csv(CSV_PATH, index=False)
    print(f"Saved {len(df)} rows to {CSV_PATH}")


if __name__ == "__main__":
    main()
