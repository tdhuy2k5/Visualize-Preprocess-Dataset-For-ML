import numpy as np
from sklearn.preprocessing import MinMaxScaler, RobustScaler, StandardScaler


# 1. Log transform
def log_transform(df, columns):
    for col in columns:
        df[col] = np.log1p(df[col])
    return df


# 2. Square root
def sqrt_transform(df, columns):
    for col in columns:
        df[col] = np.sqrt(df[col])
    return df


# 3. Min-Max Scaling
def minmax_scale(df, columns):
    scaler = MinMaxScaler()
    df[columns] = scaler.fit_transform(df[columns])
    return df


# 4. Standard Scaling
def standard_scale(df, columns):
    scaler = StandardScaler()
    df[columns] = scaler.fit_transform(df[columns])
    return df


# 5. Robust Scaling (good for outliers)
def robust_scale(df, columns):
    scaler = RobustScaler()
    df[columns] = scaler.fit_transform(df[columns])
    return df


# 6. Power transform
def power_transform(df, columns):
    for col in columns:
        df[col] = np.power(df[col], 2)
    return df


# 7. Normalize (row-wise)
def normalize(df, columns):
    df[columns] = df[columns].div(np.linalg.norm(df[columns], axis=1), axis=0)
    return df
