import pandas as pd
import numpy as np
from sklearn.feature_selection import mutual_info_classif, chi2
from sklearn.preprocessing import MinMaxScaler


def analyze_features(
    df: pd.DataFrame,
    target: str,
    var_threshold: float = 0.01,
    corr_threshold: float = 0.9,
):
    X = df.drop(columns=[target])
    y = df[target]

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
            corr_value = corr_matrix.iloc[i, j]

            if abs(corr_value) > corr_threshold:
                correlation_map[f1].append({
                    "feature": f2,
                    "correlation": float(corr_value)
                })
                correlation_map[f2].append({
                    "feature": f1,
                    "correlation": float(corr_value)
                })

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
        col: {
            "chi2": float(chi),
            "p_value": float(p)
        }
        for col, chi, p in zip(X.columns, chi_scores, p_values)
    }

    # -----------------------
    # 5. Combine everything per feature
    # -----------------------
    for col in X.columns:
        variance = float(variances.get(col, np.nan))

        feature_info = {
            "variance": variance,
            "low_variance_flag": variance < var_threshold if not np.isnan(variance) else None,

            "mutual_information": float(mi_scores.get(col, 0)),
            "chi_square": chi_map.get(col, {}),

            "correlated_with": correlation_map.get(col, []),
            "high_correlation_flag": len(correlation_map.get(col, [])) > 0,
        }

        # -----------------------
        # 6. Recommendation logic
        # -----------------------
        reasons = []

        if feature_info["low_variance_flag"]:
            reasons.append("low_variance")

        if feature_info["high_correlation_flag"]:
            reasons.append("high_correlation")

        if feature_info["mutual_information"] < 0.01:
            reasons.append("low_mi")

        feature_info["recommendation"] = {
            "action": "review" if reasons else "keep",
            "reasons": reasons
        }

        result[col] = feature_info

    return {
        "summary": {
            "total_features": len(X.columns),
            "low_variance_features": [k for k, v in result.items() if v["low_variance_flag"]],
            "high_correlation_features": [k for k, v in result.items() if v["high_correlation_flag"]],
        },
        "features": result,
        "correlation_matrix": corr_matrix.to_dict()
    }