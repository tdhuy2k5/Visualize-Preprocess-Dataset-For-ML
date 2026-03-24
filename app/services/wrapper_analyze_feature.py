from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score


def recommend_features_rfe(
    X,
    y,
    target_n_features=10,
    step_size=1,
    estimator=None
):
   
    if estimator is None:
        estimator = LogisticRegression(max_iter=1000, random_state=42)

    selector = RFE(
        estimator=estimator,
        n_features_to_select=target_n_features,
        step=step_size,
        verbose=0
    )

    selector.fit(X, y)

    return {
        "recommended_to_keep": X.columns[selector.support_].tolist(),
        "feature_ranking": dict(zip(X.columns, selector.ranking_)),
        "n_features_kept": target_n_features,
        "estimator_used": estimator.__class__.__name__
    }


def recommend_features_backward_elimination(
    X,
    y,
    min_features_to_keep=10,
    cv_folds=5,
    scoring_metric="roc_auc",
    estimator=None
):
    
    if estimator is None:
        estimator = LogisticRegression(max_iter=1000, random_state=42)

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
                n_jobs=-1
            ).mean()

            scores.append((cv_mean_score, feature_to_try_remove))

        if not scores:
            break

        # Higher score = better → remove the feature that gives highest score when removed
        best_score_after_removal, feature_removed = max(scores)

        removal_history.append({
            "removed": feature_removed,
            "cv_score_after_removal": float(best_score_after_removal),
            "features_remaining": len(current_features) - 1
        })

        current_features.remove(feature_removed)

    return {
        "recommended_to_keep": current_features,
        "recommended_to_remove": [h["removed"] for h in removal_history],
        "removal_history": removal_history,
        "final_cv_score_estimate": removal_history[-1]["cv_score_after_removal"] if removal_history else None,
        "estimator_used": estimator.__class__.__name__
    }