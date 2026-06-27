import pandas as pd
import numpy as np

# =============================================================
# Math Functions - Always return pd.Series
# Original parameter signatures preserved
# =============================================================


def _to_series(x):
    return x


# -----------------------
# Basic Math
# -----------------------
def add(a: pd.Series | float, b: pd.Series | float) -> pd.Series:
    return _to_series(a) + _to_series(b)


def sub(a: pd.Series | float, b: pd.Series | float) -> pd.Series:
    return _to_series(a) - _to_series(b)


def mul(a: pd.Series | float, b: pd.Series | float) -> pd.Series:
    return _to_series(a) * _to_series(b)


def div(a: pd.Series | float, b: pd.Series | float) -> pd.Series:
    a_s = _to_series(a)
    b_s = _to_series(b)
    # Safe division: NaN when b == 0
    return a_s / b_s.where(b_s != 0, np.nan)


def mod(a: pd.Series | float, b: pd.Series | float) -> pd.Series:
    a_s = _to_series(a)
    b_s = _to_series(b)
    # Safe modulo: NaN when b == 0
    return a_s % b_s.where(b_s != 0, np.nan)


# -----------------------
# Power
# -----------------------
def power(a: pd.Series | float, b: pd.Series | float) -> pd.Series:
    return _to_series(a) ** _to_series(b)


# -----------------------
# Log (unified) - log(a, base)
# -----------------------
def log(a: pd.Series | float, base: pd.Series | float) -> pd.Series:
    a_s = _to_series(a)
    base_s = _to_series(base)

    condition = (a_s > 0) & (base_s > 0) & (base_s != 1)

    ln_a = np.log(a_s)
    ln_base = np.log(base_s)

    return (ln_a / ln_base).where(condition, np.nan)


# -----------------------
# Trigonometric Functions
# -----------------------
def sin(x: pd.Series | float, deg: int = 0) -> pd.Series:
    if deg not in [0, 1]:
        raise ValueError("deg must be 0 or 1")

    x_s = _to_series(x)
    if deg == 1:
        x_s = np.deg2rad(x_s)
    return pd.Series(np.sin(x_s), dtype="float64")


def cos(x: pd.Series | float, deg: int = 0) -> pd.Series:
    if deg not in [0, 1]:
        raise ValueError("deg must be 0 or 1")

    x_s = _to_series(x)
    if deg == 1:
        x_s = np.deg2rad(x_s)
    return pd.Series(np.cos(x_s), dtype="float64")


def tan(x: pd.Series | float, deg: int = 0) -> pd.Series:
    if deg not in [0, 1]:
        raise ValueError("deg must be 0 or 1")

    x_s = _to_series(x)
    if deg == 1:
        x_s = np.deg2rad(x_s)
    return pd.Series(np.tan(x_s), dtype="float64")


def cot(x: pd.Series | float, deg: int = 0) -> pd.Series:
    if deg not in [0, 1]:
        raise ValueError("deg must be 0 or 1")

    x_s = _to_series(x)
    if deg == 1:
        x_s = np.deg2rad(x_s)

    t = np.tan(x_s)
    result = 1.0 / t
    return pd.Series(result, dtype="float64").where(t != 0, np.nan)
