from collections import Counter
from typing import cast

import numpy as np
import pandas as pd
import umap
from sklearn.decomposition import PCA
from sklearn.feature_selection import RFE, chi2, mutual_info_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import MinMaxScaler

from app.feature_selection.schemas import ReductionResponse

from .library import FeatureInfo, FeaturesSummary
from .schemas import AnalyzedFeatures


def analyze_features(
    df: pd.DataFrame,
    target: str,
    var_threshold: float = 0.01,
    corr_threshold: float = 0.9,
):
    X: pd.DataFrame = df.drop(columns=[target])
    y: pd.Series = df[target]

    result = {}

    # -----------------------
    # 1. Variance
    # -----------------------
    variances = X.var(numeric_only=True)

    # -----------------------
    # 2. Correlation matrix (auto computed)
    # -----------------------
    corr_matrix = X.corr(numeric_only=True)
    # Build correlation map
    correlation_map = {col: [] for col in X.columns}

    for i in range(len(corr_matrix.columns)):
        for j in range(i + 1, len(corr_matrix.columns)):
            f1 = corr_matrix.columns[i]
            f2 = corr_matrix.columns[j]
            corr_value = cast(float, corr_matrix.iloc[i, j])

            if abs(corr_value) > corr_threshold:
                correlation_map[f1].append(
                    {"feature": f2, "correlation": float(corr_value)}
                )
                correlation_map[f2].append(
                    {"feature": f1, "correlation": float(corr_value)}
                )
    # -----------------------
    # 3. Mutual Information
    # -----------------------
    mi_scores = mutual_info_classif(X.fillna(0), y)
    mi_scores = dict(zip(X.columns, mi_scores))

    # -----------------------
    # 4. Chi-square
    # -----------------------
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X.fillna(0))

    chi_scores, p_values = chi2(X_scaled, y)

    chi_map = {
        col: {"chi2": float(chi), "p_value": float(p)}
        for col, chi, p in zip(X.columns, chi_scores, p_values)
    }

    # -----------------------
    # 5. Combine everything per feature
    # -----------------------
    select = []
    for col in X.columns:
        variance = float(variances.get(col, np.nan))
        low_variance_flag = variance < var_threshold if not np.isnan(variance) else None
        mutual_information = float(mi_scores.get(col, 0))
        high_correlation_flag = len(correlation_map.get(col, [])) > 0

        # -----------------------
        # 6. Recommendation logic
        # -----------------------

        if low_variance_flag and high_correlation_flag and mutual_information < 0.01:
            select.append(col)

        feature_info = FeatureInfo(
            variance=variance,
            low_variance_flag=(
                variance < var_threshold if not np.isnan(variance) else None
            ),
            mutual_information=float(mi_scores.get(col, 0)),
            chi_square=chi_map.get(col, {}),
            correlated_with=correlation_map.get(col, []),
            high_correlation_flag=len(correlation_map.get(col, [])) > 0,
        )

        result[col] = feature_info

    return AnalyzedFeatures(
        select=select,
        summary=FeaturesSummary(
            total_features=len(X.columns),
            low_variance_features=[k for k, v in result.items() if v.low_variance_flag],
            high_correlation_features=[
                k for k, v in result.items() if v.high_correlation_flag
            ],
        ),
        detail=result,
    )


def recommend_features_rfe(X, y, target_n_features=10, step_size=1, estimator=None):

    if estimator is None:
        estimator = LogisticRegression(max_iter=1000, random_state=42)

    selector = RFE(
        estimator=estimator,
        n_features_to_select=target_n_features,
        step=step_size,
        verbose=0,
    )

    selector.fit(X, y)

    return {
        "recommended_to_keep": X.columns[selector.support_].tolist(),
        "feature_ranking": dict(zip(X.columns, selector.ranking_)),
        "n_features_kept": target_n_features,
        "estimator_used": estimator.__class__.__name__,
    }


def recommend_features_backward_elimination(
    X, y, min_features_to_keep=10, cv_folds=5, scoring_metric="roc_auc", estimator=None
):

    if estimator is None:
        estimator = LogisticRegression(max_iter=1000, random_state=42)
    # Reduce cv_folds if too large for the smallest class
    y_counts = Counter(y)
    min_class_count = min(y_counts.values())
    if cv_folds > min_class_count:
        cv_folds = min_class_count
    current_features = list(X.columns)
    removal_history = []

    while len(current_features) > min_features_to_keep:
        scores = []

        for feature_to_try_remove in current_features:
            remaining = [f for f in current_features if f != feature_to_try_remove]

            if len(remaining) == 0:
                break

            cv_mean_score = cross_val_score(
                estimator,
                X[remaining],
                y,
                cv=cv_folds,
                scoring=scoring_metric,
                n_jobs=-1,
            ).mean()

            scores.append((cv_mean_score, feature_to_try_remove))

        if not scores:
            break

        # Higher score = better → remove the feature that gives highest score when removed
        best_score_after_removal, feature_removed = max(scores)

        removal_history.append(
            {
                "removed": feature_removed,
                "cv_score_after_removal": float(best_score_after_removal),
                "features_remaining": len(current_features) - 1,
            }
        )

        current_features.remove(feature_removed)

    return {
        "recommended_to_keep": current_features,
        "recommended_to_remove": [h["removed"] for h in removal_history],
        "removal_history": removal_history,
        "final_cv_score_estimate": removal_history[-1]["cv_score_after_removal"]
        if removal_history
        else None,
        "estimator_used": estimator.__class__.__name__,
    }


def get_reduce_dimension(df, method) -> ReductionResponse:
    reduced = np.ndarray(0)
    if method == "pca":
        model = PCA(n_components=2)
        reduced: np.ndarray = model.fit_transform(df.values)

    elif method == "umap":
        model = umap.UMAP(n_components=2)
        reduced = np.asarray(model.fit_transform(df.values))

    result = []

    for i, (_, row) in enumerate(df.iterrows()):
        result.append(
            {**row.to_dict(), "x": float(reduced[i, 0]), "y": float(reduced[i, 1])}
        )

    return ReductionResponse(method=method, data=result)
