import re
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

import numpy as np
import pandas as pd

import app.dependencies.math_ops as mo

func_ops = {
    "log": mo.log,
    "pow": mo.power,
}
trigo_ops = {"sin": mo.sin, "cos": mo.cos, "tan": mo.tan, "cot": mo.cot}
ops = {
    "*": mo.mul,
    "/": mo.div,
    "%": mo.mod,
    "+": mo.add,
    "-": mo.sub,
}


class ExpressionEvaluator:
    def __init__(self):
        self.dfs: pd.DataFrame = pd.DataFrame()
        self.sub_expressions = []
        self.dp_result = {}
        self.valid_pan = []
        self.index = 0

    def check_syntax(self, expression, expr_len):
        tmp = ""
        func_stack = []
        ops_stack = []
        while self.index < expr_len:
            if expression[self.index] == "@":
                func_name = ""
                self.index += 1
                while self.index < expr_len and expression[self.index] != "(":
                    func_name += expression[self.index]
                    self.index += 1
                if func_name not in func_ops.keys():
                    raise ValueError("unsupported function")
                tmp = func_name
                self.valid_pan.append("(")
                self.index += 1
                parameter1 = self.check_syntax(expression, expr_len)
                if func_name in trigo_ops.keys():
                    parameter2 = 0
                    if expression[self.index] == ",":
                        is_deg = self.check_syntax(expression, expr_len)
                        if is_deg not in [0, 1]:
                            raise ValueError("is_deg must be 0 o 1")
                        func_stack.append([func_name, parameter1, is_deg])

                if expression[self.index] == ",":
                    self.index += 1
                    parameter2 = self.check_syntax(expression, expr_len)
                    func_stack.append([func_name, parameter1, parameter2])

                tmp = ""
            elif expression[self.index] == "#":
                self.index += 1
                col_name = ""
                while (
                    self.index < expr_len
                    and expression[self.index] not in ops.keys()
                    and expression[self.index] not in [")", ","]
                ):
                    col_name += expression[self.index]
                    self.index += 1

                if col_name not in self.dfs:
                    raise ValueError(f"column not found, {col_name}")
                tmp = col_name
                continue
            elif expression[self.index] == "(":
                self.valid_pan.append("(")
                self.index += 1
                func_stack.append(["get", self.check_syntax(expression, expr_len)])
            elif expression[self.index] in ops:
                if self.index + 1 < expr_len and expression[self.index + 1] in ops:
                    raise ValueError("syntax error")
                if tmp != "":
                    func_stack.append(tmp)
                    tmp = ""

                ops_stack.append(expression[self.index])
                self.index += 1
                continue
            elif expression[self.index] == ",":
                if self.index + 1 < expr_len and expression[self.index + 1] in [
                    ",",
                    ")",
                ]:
                    raise ValueError("syntax error")
                if not self.valid_pan:
                    raise ValueError("syntax error")
                self.valid_pan.pop()
                self.valid_pan.append(",")
                if tmp != "":
                    func_stack.append(tmp)
                self.sub_expressions.append(
                    {"func_stack": func_stack, "ops_stack": ops_stack}
                )
                return len(self.sub_expressions) - 1
            elif expression[self.index] == ")":
                if not self.valid_pan:
                    raise ValueError("syntax error")
                if tmp != "":
                    func_stack.append(tmp)
                self.valid_pan.pop()
                self.sub_expressions.append(
                    {"func_stack": func_stack, "ops_stack": ops_stack}
                )
                return len(self.sub_expressions) - 1
            elif expression[self.index].isdigit():
                tmp += expression[self.index]
            elif not expression[self.index].isdigit():
                raise ValueError("Syntax error")
            self.index += 1

    def exp_compiler(self, df: pd.DataFrame, expression: str, new_col: str):
        self.sub_expressions = []
        self.dp_result = {}
        self.valid_pan = []
        self.index = 0
        self.dfs = df
        expression = expression.replace(" ", "")
        if expression[0] != "(" or expression[-1] != ")":
            expression = f"({expression})"
        self.check_syntax(expression, len(expression))
        if self.valid_pan:
            raise ValueError("syntax error")
        self.recalculate()
        df[new_col] = self.dp_result.get(len(self.dp_result) - 1)

    def calc(self, func_stack, ops_stack):
        vals = func_stack[:]
        ops_local = ops_stack[:]  # tránh đè lên input
        if not ops_local:
            return func_stack[0]
        priority = {"+": 1, "-": 1, "*": 2, "/": 2, "%": 2}

        i = 0
        while i < len(ops_local):
            if priority[ops_local[i]] == 2:
                a = vals[i]
                b = vals[i + 1]

                res = ops[ops_local[i]](a, b)  # 🔥 dùng global ops

                vals[i] = res
                del vals[i + 1]
                del ops_local[i]
            else:
                i += 1

        result = vals[0]
        for i, op in enumerate(ops_local):
            result = ops[op](result, vals[i + 1])

        return result

    def calculate_subexp(self, subexp, index, dp_result):
        func_stack = subexp["func_stack"]
        ops_stack = subexp["ops_stack"]
        dp_result[index] = self.calc(func_stack, ops_stack)

    def is_float(self, s):
        try:
            float(s)
            return True
        except (ValueError, TypeError):
            return False

    def apply_parameter(self, small_funcs):
        for i in range(len(small_funcs)):
            func = small_funcs[i]
            if isinstance(func, str):
                if self.is_float(func):
                    small_funcs[i] = float(func)
                else:
                    small_funcs[i] = self.dfs[func]
            elif isinstance(func, list):
                if func[0] == "get":
                    small_funcs[i] = self.dp_result[func[1]]
                elif func[0] in trigo_ops:
                    small_funcs[i] = trigo_ops[func[0]](
                        self.dp_result[func[1]], self.dp_result[func[2]]
                    )
                else:
                    small_funcs[i] = func_ops[func[0]](
                        self.dp_result[func[1]], self.dp_result[func[2]]
                    )

    def recalculate(self):
        i = 0
        while i < len(self.sub_expressions):
            self.apply_parameter(self.sub_expressions[i]["func_stack"])
            self.calculate_subexp(self.sub_expressions[i], i, self.dp_result)
            i += 1
