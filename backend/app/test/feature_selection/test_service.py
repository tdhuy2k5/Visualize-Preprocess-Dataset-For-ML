# app/test/feature_selection/test_service.py
import unittest

import numpy as np
import pandas as pd

from app.feature_selection.schemas import AnalyzedFeatures, ReductionResponse
from app.feature_selection.service import (
    analyze_features,
    get_reduce_dimension,
    recommend_features_backward_elimination,
    recommend_features_rfe,
)


class TestFeatureSelectionService(unittest.TestCase):
    def test_analyze_features(self):
        df = pd.DataFrame(
            {
                "A": [1, 2, 3, 4, 5],
                "B": [2, 3, 5, 7, 11],
                "C": [1, 1, 1, 1, 1],
                "target": [0, 0, 0, 1, 1],
            }
        )
        target = "target"
        var_threshold = 0.01
        corr_threshold = 0.9

        result = analyze_features(df, target, var_threshold, corr_threshold)

        self.assertIsInstance(result, AnalyzedFeatures)
        result_dict = result.model_dump()
        self.assertIn("select", result_dict)
        self.assertIn("summary", result_dict)
        self.assertIn("detail", result_dict)

    def test_recommend_features_rfe(self):
        df = pd.DataFrame(
            {
                "A": [1, 2, 3, 4, 5],
                "B": [2, 3, 5, 7, 11],
                "C": [1, 1, 1, 1, 1],
                "target": [0, 0, 0, 1, 1],
            }
        )
        target = "target"
        target_n_features = 2
        step_size = 1

        X = df.drop(columns=[target])
        y = df[target]

        result = recommend_features_rfe(X, y, target_n_features, step_size)

        self.assertIsInstance(result, dict)
        self.assertIn("recommended_to_keep", result)
        self.assertIn("feature_ranking", result)
        self.assertIn("n_features_kept", result)
        self.assertIn("estimator_used", result)

    def test_recommend_features_backward_elimination(self):
        df = pd.DataFrame(
            {
                "A": [1, 2, 3, 4, 5],
                "B": [2, 3, 5, 7, 11],
                "C": [1, 1, 1, 1, 1],
                "target": [0, 0, 0, 1, 1],
            }
        )
        target = "target"
        min_features_to_keep = 2
        cv_folds = 5
        scoring_metric = "roc_auc"

        X = df.drop(columns=[target])
        y = df[target]

        result = recommend_features_backward_elimination(
            X, y, min_features_to_keep, cv_folds, scoring_metric
        )

        self.assertIsInstance(result, dict)
        self.assertIn("recommended_to_keep", result)
        self.assertIn("recommended_to_remove", result)
        self.assertIn("removal_history", result)
        self.assertIn("final_cv_score_estimate", result)
        self.assertIn("estimator_used", result)

    def test_get_reduce_dimension(self):
        df = pd.DataFrame(
            {"A": [1, 2, 3, 4, 5], "B": [2, 3, 5, 7, 11], "C": [1, 1, 1, 1, 1]}
        )
        method = "pca"

        result = get_reduce_dimension(df, method)

        self.assertIsInstance(result, ReductionResponse)
        result_dict = result.model_dump()
        self.assertIn("method", result_dict)
        self.assertIn("data", result_dict)


if __name__ == "__main__":
    unittest.main()
