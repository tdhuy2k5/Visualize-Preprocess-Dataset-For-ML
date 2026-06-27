import numpy as np
import pandas as pd
from textblob import TextBlob


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
    df[new_col] = df[column].isna().to_numpy(np.int8)
    return df


# 2. AGGREGATION (Use 'transform' to avoid the slow 'merge')
def groupby_agg(df, group_col: list[str], agg_col: str, new_col: str, agg_func="mean"):
    if not new_col:
        raise ValueError("Column required")
    df[new_col] = df.groupby(group_col)[agg_col].transform(agg_func)
    return df
