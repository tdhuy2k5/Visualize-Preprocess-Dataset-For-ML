# app/test/feature_encoding/test_service.py
import unittest

import pandas as pd

from app.feature_encoding.service import (
    binary_encode,
    count_encode,
    freq_encode,
    label_encode,
    one_hot,
    ordinal_encode,
    target_encode,
)


class TestEncodingService(unittest.TestCase):
    def test_one_hot(self):
        df = pd.DataFrame({"A": [1, 2, 3], "B": [1, 1, 2]})
        encoded_df = one_hot(df, ["A"])
        expected_df = pd.DataFrame(
            {"B": [1, 1, 2], "A_1": [1, 0, 0], "A_2": [0, 1, 0], "A_3": [0, 0, 1]}
        )
        pd.testing.assert_frame_equal(encoded_df, expected_df)

    def test_label_encode(self):
        df = pd.DataFrame({"A": ["a", "b", "c"]})
        encoded_df = label_encode(df, "A")
        expected_df = pd.DataFrame({"A": [0, 1, 2]}, dtype="int8")
        pd.testing.assert_frame_equal(encoded_df, expected_df)

    def test_target_encode(self):
        df = pd.DataFrame({"A": [1, 1, 2], "target": [10, 20, 30]})
        encoded_df = target_encode(df, "A", "target")
        expected_df = pd.DataFrame({"A": [15.0, 15.0, 30.0], "target": [10, 20, 30]})
        pd.testing.assert_frame_equal(encoded_df, expected_df)

    def test_count_encode(self):
        df = pd.DataFrame({"A": [1, 2, 1]})
        encoded_df = count_encode(df, "A")
        expected_df = pd.DataFrame({"A": [2, 1, 2]})
        pd.testing.assert_frame_equal(encoded_df, expected_df)

    def test_freq_encode(self):
        df = pd.DataFrame({"A": [1, 2, 1]})
        encoded_df = freq_encode(df, "A")
        expected_df = pd.DataFrame({"A": [2 / 3, 1 / 3, 2 / 3]})
        pd.testing.assert_frame_equal(encoded_df, expected_df)

    def test_binary_encode(self):
        df = pd.DataFrame({"A": ["a", "b", "a"]})
        encoded_df = binary_encode(df, "A")
        expected_df = pd.DataFrame({"A": ["0", "1", "0"]})
        pd.testing.assert_frame_equal(encoded_df, expected_df)

    def test_ordinal_encode(self):
        df = pd.DataFrame({"A": ["low", "medium", "high"]})
        mapping = {"low": 1, "medium": 2, "high": 3}
        encoded_df = ordinal_encode(df, "A", mapping)
        expected_df = pd.DataFrame({"A": [1, 2, 3]})
        pd.testing.assert_frame_equal(encoded_df, expected_df)


if __name__ == "__main__":
    unittest.main()
