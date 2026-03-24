import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split


def split_dataset(
    df: pd.DataFrame,
    target_column: str,
    test_size: float = 0.2,
    val_size: float = 0.1,
    random_state: int = 42,
    stratify: bool = True,
):
    """Train / validation / test split with optional stratification."""
    if target_column not in df.columns:
        raise ValueError(f"target_column '{target_column}' not found in DataFrame")

    X = df.drop(columns=[target_column])
    y = df[target_column]

    stratify_vals = y if stratify else None

    X_train_full, X_test, y_train_full, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=stratify_vals,
    )

    if val_size <= 0 or val_size >= 1:
        raise ValueError("val_size must be between 0 and 1")

    val_ratio = val_size / (1.0 - test_size)

    X_train, X_val, y_train, y_val = train_test_split(
        X_train_full,
        y_train_full,
        test_size=val_ratio,
        random_state=random_state,
        stratify=y_train_full if stratify else None,
    )

    return X_train, X_val, X_test, y_train, y_val, y_test


def build_preprocessor(
    numeric_features=None,
    categorical_features=None,
):
    """
    Build minimal ColumnTransformer.
    Assumes data is preprocessed via transformation.py and encoding.py services.
    Use this for final pipeline assembly after manual preprocessing steps.
    """
    numeric_features = numeric_features or []
    categorical_features = categorical_features or []

    # Minimal: just passthrough, since preprocessing done separately
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", "passthrough", numeric_features),
            ("cat", "passthrough", categorical_features),
        ],
        remainder="drop",
    )

    return preprocessor


def make_training_pipeline(preprocessor, estimator):
    """Wrap a preprocessor and estimator into a single sklearn pipeline."""
    return Pipeline(
        [
            ("preprocessor", preprocessor),
            ("estimator", estimator),
        ]
    )
