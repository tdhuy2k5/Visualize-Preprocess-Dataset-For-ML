from typing import Tuple, cast

import pandas as pd
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from sklearn.utils import resample


def handle_imbalanced(
    df: pd.DataFrame, target: str, method: str = "smote", random_state: int = 42
):
    """
    Handle imbalanced data.
    Methods: 'smote', 'undersample', 'oversample'
    """
    X = df.drop(columns=[target])
    y = df[target]

    if method == "smote":
        min_class_count = y.value_counts().min()
        k_neighbors = max(1, min(5, min_class_count - 1))
        smote = SMOTE(k_neighbors=k_neighbors, random_state=random_state)
        X_res, y_res = smote.fit_resample(X, y)  # type: ignore
    elif method == "undersample":
        rus = RandomUnderSampler(random_state=random_state)
        X_res, y_res = rus.fit_resample(X, y)  # type: ignore
    elif method == "oversample":
        X_res, y_res = cast(
            Tuple[pd.DataFrame, pd.Series],
            resample(
                X, y, replace=True, n_samples=len(y) * 2, random_state=random_state
            ),
        )
    else:
        raise ValueError("Invalid method")

    res_df = pd.concat([X_res, y_res], axis=1)
    return res_df
