# app/test/feature_transformation/test_service.py
import unittest

import numpy as np
import pandas as pd

from app.feature_transformation.service import (
    log_transform,
    minmax_scale,
    normalize,
    power_transform,
    robust_scale,
    sqrt_transform,
    standard_scale,
)


class TestTransformationService(unittest.TestCase):
    def test_log_transform(self):
        df = pd.DataFrame({"A": [1, 2, 3, 4, 5], "B": [1, 2, 3, 4, 5]})
        transformed_df = log_transform(df, ["A", "B"])
        self.assertAlmostEqual(transformed_df["A"].iloc[0], np.log1p(1))
        self.assertAlmostEqual(transformed_df["B"].iloc[0], np.log1p(1))

    def test_sqrt_transform(self):
        df = pd.DataFrame({"A": [1, 4, 9, 16, 25], "B": [1, 4, 9, 16, 25]})
        transformed_df = sqrt_transform(df, ["A", "B"])
        self.assertAlmostEqual(transformed_df["A"].iloc[0], 1)
        self.assertAlmostEqual(transformed_df["B"].iloc[0], 1)

    def test_minmax_scale(self):
        df = pd.DataFrame({"A": [1, 2, 3, 4, 5], "B": [10, 20, 30, 40, 50]})
        transformed_df = minmax_scale(df, ["A", "B"])
        self.assertAlmostEqual(transformed_df["A"].min(), 0)
        self.assertAlmostEqual(transformed_df["A"].max(), 1)
        self.assertAlmostEqual(transformed_df["B"].min(), 0)
        self.assertAlmostEqual(transformed_df["B"].max(), 1)

    def test_standard_scale(self):
        df = pd.DataFrame({"A": [1, 2, 3, 4, 5], "B": [10, 20, 30, 40, 50]})
        transformed_df = standard_scale(df, ["A", "B"])
        self.assertAlmostEqual(transformed_df["A"].mean(), 0)
        self.assertAlmostEqual(transformed_df["B"].mean(), 0)
        self.assertAlmostEqual(transformed_df["A"].std(ddof=0), 1)
        self.assertAlmostEqual(transformed_df["B"].std(ddof=0), 1)

    def test_robust_scale(self):
        df = pd.DataFrame({"A": [1, 2, 3, 4, 5], "B": [10, 20, 30, 40, 50]})
        transformed_df = robust_scale(df, ["A", "B"])
        self.assertAlmostEqual(transformed_df["A"].mean(), 0)
        self.assertAlmostEqual(transformed_df["B"].mean(), 0)
        self.assertAlmostEqual(transformed_df["A"].median(), 0)
        self.assertAlmostEqual(
            transformed_df["A"].quantile(0.75) - transformed_df["A"].quantile(0.25),
            1,
        )
        self.assertAlmostEqual(transformed_df["B"].median(), 0)
        self.assertAlmostEqual(
            transformed_df["A"].quantile(0.75) - transformed_df["B"].quantile(0.25),
            1,
        )

    def test_power_transform(self):
        df = pd.DataFrame({"A": [1, 2, 3, 4, 5], "B": [1, 2, 3, 4, 5]})
        transformed_df = power_transform(df, ["A", "B"])
        self.assertAlmostEqual(transformed_df["A"].iloc[0], 1**2)
        self.assertAlmostEqual(transformed_df["B"].iloc[0], 1**2)

    def test_normalize(self):
        df = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})
        transformed_df = normalize(df, ["A", "B"])
        self.assertAlmostEqual(transformed_df["A"].iloc[0], 1 / np.sqrt(1**2 + 4**2))
        self.assertAlmostEqual(transformed_df["B"].iloc[0], 4 / np.sqrt(1**2 + 4**2))


if __name__ == "__main__":
    unittest.main()
