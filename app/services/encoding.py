import pandas as pd

# 1. One-hot
def one_hot(df, columns):
    return pd.get_dummies(df, columns=columns)


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


# 6. Binary Encoding (simple version)
def binary_encode(df, column):
    df[column] = df[column].astype("category").cat.codes
    df[column] = df[column].apply(lambda x: format(x, "b"))
    return df


# 7. Ordinal Encoding
def ordinal_encode(df, column, mapping: dict):
    df[column] = df[column].map(mapping)
    return df