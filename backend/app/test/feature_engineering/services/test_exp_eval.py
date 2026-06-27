# app/test/feature_engineering/services/exp_eval.py
import unittest

import numpy as np
import pandas as pd

from app.feature_engineering.services.exp_eval import ExpressionEvaluator


class TestExpressionEvaluator(unittest.TestCase):
    def test_check_syntax(self):
        evaluator = ExpressionEvaluator()
        evaluator.dfs = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})
        expression = "(#A+#B)"
        expr_len = len(expression)
        # Mock the index attribute
        evaluator.index = 0
        evaluator.valid_pan = []
        evaluator.sub_expressions = []
        evaluator.dp_result = {}
        # Call the check_syntax method
        result_index = evaluator.check_syntax(expression, expr_len)
        self.assertIsNone(result_index)
        # Check the sub_expressions list
        self.assertEqual(len(evaluator.sub_expressions), 1)
        self.assertIsInstance(evaluator.sub_expressions[0], dict)
        self.assertIn("func_stack", evaluator.sub_expressions[0])
        self.assertIn("ops_stack", evaluator.sub_expressions[0])
        # Check the func_stack
        self.assertEqual(len(evaluator.sub_expressions[0]["func_stack"]), 2)
        self.assertEqual(evaluator.sub_expressions[0]["func_stack"][0], "A")
        self.assertEqual(evaluator.sub_expressions[0]["func_stack"][1], "B")
        # Check the ops_stack
        self.assertEqual(len(evaluator.sub_expressions[0]["ops_stack"]), 1)
        self.assertEqual(evaluator.sub_expressions[0]["ops_stack"][0], "+")
        # Check the index
        self.assertEqual(evaluator.index, expr_len)

    def test_exp_compiler(self):
        evaluator = ExpressionEvaluator()
        df = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})
        expression = "#A+#B"
        new_col = "C"
        evaluator.exp_compiler(df, expression, new_col)

    def test_exp_compiler_complex(self):
        evaluator = ExpressionEvaluator()
        df = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})
        expression = "@pow(@log(#B, 2), 1)+1"
        new_col = "C"
        evaluator.exp_compiler(df, expression, new_col)
        assert np.allclose(df["C"], [3.0, 3.321928, 3.584963], rtol=1e-6)

    def test_calc(self):
        evaluator = ExpressionEvaluator()
        func_stack = [1, 2, 3]
        ops_stack = ["+", "*"]
        result = evaluator.calc(func_stack, ops_stack)
        self.assertEqual(result, 7)

    def test_calculate_subexp(self):
        evaluator = ExpressionEvaluator()
        subexp = {"func_stack": [1, 2], "ops_stack": ["+"]}
        index = 0
        dp_result = {}
        evaluator.calculate_subexp(subexp, index, dp_result)
        self.assertEqual(dp_result[index], 3)

    def test_is_float(self):
        evaluator = ExpressionEvaluator()
        self.assertTrue(evaluator.is_float("1.0"))
        self.assertFalse(evaluator.is_float("a"))

    def test_apply_parameter(self):
        evaluator = ExpressionEvaluator()
        evaluator.dfs = pd.DataFrame({"A": [1, 2, 3]})
        small_funcs = ["A", "1.0"]
        evaluator.dp_result = {}
        evaluator.apply_parameter(small_funcs)
        self.assertTrue((small_funcs[0] == pd.Series([1, 2, 3])).all())  # type: ignore
        self.assertEqual(small_funcs[1], 1.0)

    # [['pow', 0, 1], 'pow']

    def test_recalculate(self):
        evaluator = ExpressionEvaluator()
        evaluator.dfs = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})
        evaluator.sub_expressions = [{"func_stack": ["A", "B"], "ops_stack": ["+"]}]
        evaluator.dp_result = {}
        evaluator.recalculate()


if __name__ == "__main__":
    unittest.main()
