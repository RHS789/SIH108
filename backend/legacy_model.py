import os
import pickle
from typing import Optional
from urllib.request import urlretrieve

import pandas as pd

# Local storage for the provided pickle artifacts
BASE_DIR = os.path.dirname(__file__)
LEGACY_DIR = os.path.join(BASE_DIR, "models", "legacy")

# Remote sources for artifacts (provided by user)
REMOTE_URLS = {
    "model.pkl": "https://cdn.builder.io/o/assets%2F8e97096ec2144e59b24fa184ec47bfc8%2Ff57115e1ab2046d497ab8229944b58ce?alt=media&token=4af5a9b2-6485-487f-a714-dbc5a38b4a9c&apiKey=8e97096ec2144e59b24fa184ec47bfc8",
    "day_encoder.pkl": "https://cdn.builder.io/o/assets%2F8e97096ec2144e59b24fa184ec47bfc8%2F0327a35ac8324eb892604c871c5a7352?alt=media&token=70014147-f260-461f-af89-0e3d9c403889&apiKey=8e97096ec2144e59b24fa184ec47bfc8",
    "festival_encoder.pkl": "https://cdn.builder.io/o/assets%2F8e97096ec2144e59b24fa184ec47bfc8%2F1e956f63a5e54a41903b3f3b8b9b33b6?alt=media&token=37efbff8-dbef-4053-baeb-93809b9602ed&apiKey=8e97096ec2144e59b24fa184ec47bfc8",
    "weather_encoder.pkl": "https://cdn.builder.io/o/assets%2F8e97096ec2144e59b24fa184ec47bfc8%2Fc2a1caf86c20471bb59c71aa158bd067?alt=media&token=fed2173c-f994-447f-bc8b-69d6d2c99e44&apiKey=8e97096ec2144e59b24fa184ec47bfc8",
}

_model = None
_day_enc = None
_fest_enc = None
_weather_enc = None


def _local_path(name: str) -> str:
    os.makedirs(LEGACY_DIR, exist_ok=True)
    return os.path.join(LEGACY_DIR, name)


def _ensure_file(name: str) -> str:
    path = _local_path(name)
    if os.path.exists(path):
        return path
    url = REMOTE_URLS.get(name)
    if not url:
        raise FileNotFoundError(f"No remote URL configured for {name}")
    urlretrieve(url, path)
    return path


def load_legacy_model() -> None:
    global _model, _day_enc, _fest_enc, _weather_enc
    if _model is not None and _day_enc is not None and _fest_enc is not None and _weather_enc is not None:
        return
    # Support either exact names or files with spaces that users may upload manually
    candidates = [
        ("model.pkl", ["model.pkl", "model (1).pkl"]),
        ("day_encoder.pkl", ["day_encoder.pkl", "day_encoder (1).pkl"]),
        ("festival_encoder.pkl", ["festival_encoder.pkl"]),
        ("weather_encoder.pkl", ["weather_encoder.pkl"]),
    ]

    resolved = {}
    for key, opts in candidates:
        # Prefer already-downloaded canonical file
        canonical = _local_path(key)
        if os.path.exists(canonical):
            resolved[key] = canonical
            continue
        # Check alternative names
        alt = next((p for p in opts if os.path.exists(_local_path(p))), None)
        if alt:
            resolved[key] = _local_path(alt)
            continue
        # Otherwise fetch from remote
        resolved[key] = _ensure_file(key)

    with open(resolved["model.pkl"], "rb") as f:
        _model = pickle.load(f)
    with open(resolved["day_encoder.pkl"], "rb") as f:
        _day_enc = pickle.load(f)
    with open(resolved["festival_encoder.pkl"], "rb") as f:
        _fest_enc = pickle.load(f)
    with open(resolved["weather_encoder.pkl"], "rb") as f:
        _weather_enc = pickle.load(f)


def _safe_encode(encoder, value: str) -> int:
    # Many simple encoders are sklearn.preprocessing.LabelEncoder
    # Use classes_ mapping directly to handle unknown labels gracefully.
    classes = getattr(encoder, "classes_", None)
    if classes is not None:
        mapping = {str(cls): int(i) for i, cls in enumerate(classes)}
        return mapping.get(str(value), len(mapping))
    # Fallback: try transform, default to +1 beyond max
    try:
        return int(encoder.transform([value])[0])
    except Exception:
        try:
            arr = encoder.transform(getattr(encoder, "classes_", []))
            return int(max(arr) + 1) if len(arr) else 0
        except Exception:
            return 0


def predict_simple(day: str, festival: Optional[str], weather: str) -> int:
    load_legacy_model()
    d = str(day)
    f = str(festival) if festival is not None else "No"
    w = str(weather)

    day_enc = _safe_encode(_day_enc, d)
    fest_enc = _safe_encode(_fest_enc, f)
    weather_enc = _safe_encode(_weather_enc, w)

    X_new = pd.DataFrame([[day_enc, fest_enc, weather_enc]], columns=["Day_enc", "Festival_enc", "Weather_enc"])
    y = _model.predict(X_new)[0]
    try:
        yi = int(y)
    except Exception:
        yi = int(float(y))
    return max(0, yi)
