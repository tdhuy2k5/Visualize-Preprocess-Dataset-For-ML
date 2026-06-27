import pandas as pd
import numpy as np
from textblob import TextBlob


# -----------------------
# Helper
# -----------------------
def _val(x: pd.Series | float) -> np.ndarray | float:
    return x.to_numpy() if isinstance(x, pd.Series) else x


# -----------------------
# Basic Math
# -----------------------
def add(a: pd.Series | float, b: pd.Series | float) -> np.ndarray | float:
    return _val(a) + _val(b)


def sub(a: pd.Series | float, b: pd.Series | float) -> float | np.ndarray:
    return _val(a) - _val(b)


def mul(a: pd.Series | float, b: pd.Series | float) -> float | np.ndarray:
    return _val(a) * _val(b)


def div(a: pd.Series | float, b: pd.Series | float) -> float | np.ndarray:
    clean_a, clean_b = _val(a), _val(b)
    out = np.full(np.broadcast(clean_a, clean_b).shape, np.nan, dtype=np.float64)
    return np.divide(clean_a, clean_b, out=out, where=clean_b != 0)


def mod(a: pd.Series | float, b: pd.Series | float) -> float | np.ndarray:
    clean_a, clean_b = _val(a), _val(b)
    out = np.full(np.broadcast(clean_a, clean_b).shape, np.nan, dtype=np.float64)
    return np.mod(clean_a, clean_b, out=out, where=clean_b != 0)


# -----------------------
# Power
# -----------------------
def power(a: pd.Series | float, b: pd.Series | float) -> float | np.ndarray:
    return np.power(_val(a), _val(b))


# -----------------------
# Log (unified)
# log(a, base)
# -----------------------


def log(a: pd.Series | float, base: pd.Series | float) -> np.ndarray | float:
    clean_a, clean_base = _val(a), _val(base)

    out = np.full(np.broadcast(clean_a, clean_base).shape, np.nan, dtype=np.float64)

    return np.divide(
        np.log(clean_a),
        np.log(clean_base),
        out=out,
        where=(clean_a > 0) & (clean_base > 0) & (clean_base != 1),
    )


def sin(x: pd.Series | float, deg: int = 0):
    if deg not in [0, 1]:
        raise ValueError("is deg must in 0 1")
    clean_x = _val(x)
    if deg:
        clean_x = np.deg2rad(clean_x)
    return np.sin(clean_x)


def cos(x: pd.Series | float, deg: int = 0):
    if deg not in [0, 1]:
        raise ValueError("is deg must in 0 1")
    clean_x = _val(x)
    if deg:
        clean_x = np.deg2rad(clean_x)
    return np.cos(clean_x)


def tan(x: pd.Series | float, deg: int = 0):
    if deg not in [0, 1]:
        raise ValueError("is deg must in 0 1")
    clean_x = _val(x)
    if deg:
        clean_x = np.deg2rad(clean_x)
    return np.tan(clean_x)


def cot(x: pd.Series | float, deg: int = 0):
    if deg not in [0, 1]:
        raise ValueError("is deg must in 0 1")
    clean_x = _val(x)
    if deg:
        clean_x = np.deg2rad(clean_x)

    t = np.tan(clean_x)
    out = np.full_like(t, np.nan, dtype=np.float64)
    return np.divide(1.0, t, out=out, where=t != 0)


def extract_datetime(df, column):
    dt_col = pd.to_datetime(df[column])  # Convert once, reuse many times
    df[f"{column}_year"] = dt_col.dt.year
    df[f"{column}_month"] = dt_col.dt.month
    df[f"{column}_day"] = dt_col.dt.day
    df[f"{column}_weekday"] = dt_col.dt.weekday
    df[f"{column}_hour"] = dt_col.dt.hour
    df[f"{column}_is_weekend"] = dt_col.dt.weekday >= 5
    return df


# 5. TEXT FEATURES (The "Silent Killer" of performance)
def text_length(df, column, new_col: str):
    if not new_col:
        raise ValueError("Column required")
    df[new_col] = df[column].astype(str).str.len()
    return df


def word_count(df, column, new_col: str):
    if not new_col:
        raise ValueError("Column required")
    df[new_col] = df[column].astype(str).str.split().str.len()
    return df


def text_sentiment(df, column: str, new_col: str):
    if not new_col:
        raise ValueError("Column required")
    df[new_col] = [TextBlob(str(x)).sentiment.polarity for x in df[column]]  # type: ignore
    return df


# 6. BOOLEAN / FLAGS
def flag_missing(df: pd.DataFrame, column: str, new_col: str):
    if not new_col:
        raise ValueError("Column required")
    df[new_col] = df[column].isna().astype(np.int8)
    return df


# 2. AGGREGATION (Use 'transform' to avoid the slow 'merge')
def groupby_agg(df, group_col, agg_col, new_col: str, agg_func="mean"):
    if not new_col:
        raise ValueError("Column required")
    df[new_col] = df.groupby(group_col)[agg_col].transform(agg_func)
    return df
