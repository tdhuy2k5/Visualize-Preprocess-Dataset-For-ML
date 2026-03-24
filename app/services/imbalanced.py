import pandas as pd
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from sklearn.utils import resample

def handle_imbalanced(df: pd.DataFrame, target: str, method: str = "smote", random_state: int = 42):
    """
    Handle imbalanced data.
    Methods: 'smote', 'undersample', 'oversample'
    """
    X = df.drop(columns=[target])
    y = df[target]

    if method == "smote":
        smote = SMOTE(random_state=random_state)
        X_res, y_res = smote.fit_resample(X, y)
    elif method == "undersample":
        rus = RandomUnderSampler(random_state=random_state)
        X_res, y_res = rus.fit_resample(X, y)
    elif method == "oversample":
        X_res, y_res = resample(X, y, replace=True, n_samples=len(y) * 2, random_state=random_state)
    else:
        raise ValueError("Invalid method")

    res_df = pd.concat([X_res, y_res], axis=1)
    return res_df