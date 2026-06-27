# app/test/feature_imbalance/test_service.py
import unittest

import pandas as pd

from app.feature_imbalance.service import handle_imbalanced


class TestImbalanceService(unittest.TestCase):
    def test_smote(self):
        # Create an imbalanced dataset
        df = pd.DataFrame(
            {
                "X1": [1, 2, 3, 4, 5],
                "X2": [1, 2, 3, 4, 5],
                "y": [0, 0, 0, 1, 1],  # Imbalanced target variable
            }
        )

        # Apply SMOTE
        res_df = handle_imbalanced(df, "y", method="smote", random_state=42)

        # Check if the target variable is now balanced
        self.assertAlmostEqual(
            res_df["y"].value_counts()[0], res_df["y"].value_counts()[1]
        )

    def test_undersample(self):
        # Create an imbalanced dataset
        df = pd.DataFrame(
            {
                "X1": [1, 2, 3, 4, 5],
                "X2": [1, 2, 3, 4, 5],
                "y": [0, 0, 0, 1, 1],  # Imbalanced target variable
            }
        )

        # Apply RandomUnderSampler
        res_df = handle_imbalanced(df, "y", method="undersample", random_state=42)

        # Check if the target variable is now balanced
        self.assertLessEqual(
            len(res_df[res_df["y"] == 0]), len(res_df[res_df["y"] == 1])
        )

    def test_oversample(self):
        # Create an imbalanced dataset
        df = pd.DataFrame(
            {
                "X1": [1, 2, 3, 4, 5],
                "X2": [1, 2, 3, 4, 5],
                "y": [0, 0, 0, 1, 1],  # Imbalanced target variable
            }
        )

        # Apply oversampling
        res_df = handle_imbalanced(df, "y", method="oversample", random_state=42)

        # Check if the target variable is now more balanced
        self.assertGreaterEqual(
            len(res_df[res_df["y"] == 1]), len(res_df[res_df["y"] == 0])
        )

    def test_invalid_method(self):
        # Create an imbalanced dataset
        df = pd.DataFrame(
            {
                "X1": [1, 2, 3, 4, 5],
                "X2": [1, 2, 3, 4, 5],
                "y": [0, 0, 0, 1, 1],  # Imbalanced target variable
            }
        )

        # Check if an invalid method raises a ValueError
        with self.assertRaises(ValueError):
            handle_imbalanced(df, "y", method="invalid_method", random_state=42)


if __name__ == "__main__":
    unittest.main()
