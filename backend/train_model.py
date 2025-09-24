import os
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from xgboost import xgb
from xgb import XGBRegressor
from sklearn.metrics import r2_score

DATA_CSV = os.path.join(os.path.dirname(__file__), "data", "crowd_timeseries.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "model.pkl")

CATEGORICAL = ["day_of_week", "month", "hour", "weather"]
NUMERIC = ["is_weekend", "is_holiday", "is_festival_day"]
TARGET = "pilgrim_count"


def ensure_data():
    if not os.path.exists(DATA_CSV):
        from generate_data import main as gen_main
        gen_main()


def train() -> str:
    ensure_data()
    df = pd.read_csv(DATA_CSV, parse_dates=["timestamp"])  # noqa: F841

    X = df[CATEGORICAL + NUMERIC]
    y = df[TARGET]

    pre = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
            ("num", "passthrough", NUMERIC),
        ]
    )

    model = XGBRegressor(n_estimators=200, random_state=42, n_jobs=-1)

    pipe = Pipeline(steps=[
        ("pre", pre),
        ("rf", model),
    ])

    pipe.fit(X, y)

    # quick evaluation
    y_pred = pipe.predict(X)
    score = r2_score(y, y_pred)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump({"pipe": pipe, "score": float(score)}, MODEL_PATH)
    return MODEL_PATH


def load_model():
    if not os.path.exists(MODEL_PATH):
        train()
    obj = joblib.load(MODEL_PATH)
    return obj["pipe"], obj.get("score", None)


if __name__ == "__main__":
    path = train()
    print(f"Model saved to {path}")
