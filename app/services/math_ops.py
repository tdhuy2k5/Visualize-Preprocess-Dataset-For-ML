import pandas as pd
import numpy as np

# -----------------------
# Helper
# -----------------------
def _val(x: pd.Series | float):
    return x.values if isinstance(x, pd.Series) else x


# -----------------------
# Basic Math
# -----------------------
def add(a: pd.Series | float, b: pd.Series | float):
    a, b = _val(a), _val(b)
    return a + b


def sub(a: pd.Series | float, b: pd.Series | float):
    a, b = _val(a), _val(b)
    return a - b


def mul(a: pd.Series | float, b: pd.Series | float):
    a, b = _val(a), _val(b)
    return a * b


def div(a: pd.Series | float, b: pd.Series | float):
    a, b = _val(a), _val(b)
    out = np.full(np.broadcast(a, b).shape, np.nan, dtype=np.float64)
    return np.divide(a, b, out=out, where=b != 0)


def mod(a: pd.Series | float, b: pd.Series | float):
    a, b = _val(a), _val(b)
    out = np.full(np.broadcast(a, b).shape, np.nan, dtype=np.float64)
    return np.mod(a, b, out=out, where=b != 0)


# -----------------------
# Power
# -----------------------
def power(a: pd.Series | float, b: pd.Series | float):
    a, b = _val(a), _val(b)
    return np.power(a, b)


# -----------------------
# Log (unified)
# log(a, base)
# -----------------------
def log(a: pd.Series | float, base: pd.Series | float):
    a, base = _val(a), _val(base)

    out = np.full(np.broadcast(a, base).shape, np.nan, dtype=np.float64)

    return np.divide(
        np.log(a),
        np.log(base),
        out=out,
        where=(a > 0) & (base > 0) & (base != 1)
    )

def sin(x: pd.Series | float, deg: int = 0):
    if deg not in [0,1]:
        raise ValueError("is deg must in 0 1")
    x = _val(x)
    if deg:
        x = np.deg2rad(x)
    return np.sin(x)


def cos(x: pd.Series | float, deg: int = 0):
    if deg not in [0,1]:
        raise ValueError("is deg must in 0 1")
    x = _val(x)
    if deg:
        x = np.deg2rad(x)
    return np.cos(x)


def tan(x: pd.Series | float, deg: int = 0):
    if deg not in [0,1]:
        raise ValueError("is deg must in 0 1")
    x = _val(x)
    if deg:
        x = np.deg2rad(x)
    return np.tan(x)


def cot(x: pd.Series | float, deg: int = 0):
    if deg not in [0,1]:
        raise ValueError("is deg must in 0 1")
    x = _val(x)
    if deg:
        x = np.deg2rad(x)

    t = np.tan(x)
    out = np.full_like(t, np.nan, dtype=np.float64)
    return np.divide(1.0, t, out=out, where=t != 0)