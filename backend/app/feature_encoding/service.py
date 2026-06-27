from typing import Any
from typing import Dict
import pandas as pd
import math


# TODO: nunique for one_hot
# 1. One-hot
def one_hot(df, columns):
    return pd.get_dummies(df, columns=columns, prefix="one_hot").astype(int)


# 2. Label Encoding
def label_encode(df, column):
    df[column] = df[column].astype("category").cat.codes
    return df


# 3. Target Encoding
def target_encode(df, column, target):
    means = df.groupby(column)[target].mean()
    df[column] = df[column].map(means)
    return df


# 4. Count Encoding
def count_encode(df, column):
    counts = df[column].value_counts()
    df[column] = df[column].map(counts)
    return df


# 5. Frequency Encoding
def freq_encode(df, column):
    freq = df[column].value_counts(normalize=True)
    df[column] = df[column].map(freq)
    return df


# 6. Binary Encoding
def binary_encode(df, column):
    # Step 1: category → integer
    codes = df[column].astype("category").cat.codes

    # Step 2: determine number of bits needed
    max_val = codes.max()
    n_bits = math.ceil(math.log2(max_val + 1))

    # Step 3: convert to binary and pad
    binaries = codes.apply(lambda x: format(x, f"0{n_bits}b"))

    # Step 4: split into columns
    bit_cols = binaries.apply(lambda x: pd.Series(list(x))).astype(int)
    bit_cols.columns = [f"{column}_bit_{i}" for i in range(n_bits)]

    # Drop original column and join new ones
    df = df.drop(columns=[column]).join(bit_cols)

    return df


# 7. Ordinal Encoding
def ordinal_encode(df, column, mapping: Dict[str, Any]):
    df[column] = df[column].map(mapping)
    return df
