import pandas as pd
import numpy as np
import re
import math_ops as mo

func_ops = {
    'log': mo.log,
    'powr': mo.power,
}
trigo_ops = {
    'sin': mo.sin,
    'cos': mo.cos,
    'tan': mo.tan,
    'cot': mo.cot
}
ops = {
    '*': mo.mul,
    '/': mo.div,
    '%': mo.mod,
    '+': mo.add,
    '-': mo.sub,
}

def calculate(expression, expr_len):
    tmp = ''
    func_stack = []
    ops_stack = []
    while index < expr_len:
        if expression[index] == '@':
            func_name = ''
            index += 1
            while index < expr_len and expression[index] != '(':
                func_name += expression[index]
                index += 1
            if func_name not in func_ops.keys():
                raise ValueError('unsupported function')
            tmp = func_name
            valid_pan.append('(')
            index += 1
            parameter1 = calculate(expression, expr_len)
            if func_name in trigo_ops.keys():
                parameter2 = 0
                if expression[index] == ',':
                    is_deg = calculate(expression, expr_len)
                    if is_deg not in [0, 1]:
                        raise ValueError('is_deg must be 0 or 1')
                    func_stack.append([func_name, parameter1, is_deg])
            if expression[index] == ',':
                index += 1
                parameter2 = calculate(expression, expr_len)
                func_stack.append([func_name, parameter1, parameter2])
        elif expression[index] == '#':
            col_name = ''
            while index < expr_len and expression[index] not in ops.keys():
                col_name += expression[index]
                index += 1
            if col_name not in dfs:
                raise ValueError('column not found')
            tmp = col_name
        elif expression[index] == '(':
            valid_pan.append('(')
            index += 1
            func_stack.append(['get', calculate(expression, expr_len)])
        elif expression[index] in ops:
            if index + 1 < expr_len and expression[index + 1] in ops:
                raise ValueError('syntax error')
            func_stack.append(tmp)
            tmp = ''
            ops_stack.append(expression[index])
            index += 1
            continue
        elif expression[index] == ',':
            if index + 1 < expr_len and expression[index + 1] in [',', ')']:
                raise ValueError('syntax error')
            if not valid_pan:
                raise ValueError('syntax error')
            valid_pan.pop()
            valid_pan.append(',')
            if tmp:
                func_stack.append(tmp)
            sub_expressions.append({
                'func_stack': func_stack,
                'ops_stack': ops_stack
            })
            return len(sub_expressions) - 1
        elif expression[index] == ')':
            if not valid_pan:
                raise ValueError('syntax error')
            if tmp:
                func_stack.append(tmp)
            sub_expressions.append({
                'func_stack': func_stack,
                'ops_stack': ops_stack
            })
            return len(sub_expressions) - 1
        elif expression[index].isdigit():
            tmp += expression[index]
        elif not expression[index].isdigit():
            raise ValueError('Syntax error')
        index += 1

def exp_compiler(df: pd.DataFrame, expression: str, new_col: str):
    global sub_expressions
    sub_expressions = []
    global dp_result
    dp_result = {}
    global valid_pan
    valid_pan = []
    global index
    index = 0
    global dfs
    dfs = df
    calculate(expression, len(expression))
    df[new_col] = dp_result.get(-1, None)

def calc(func_stack, ops_stack):
    vals = func_stack[:]
    ops_local = ops_stack[:]   # tránh đè lên input

    priority = {'+':1, '-':1, '*':2, '/':2, '%':2}

    i = 0
    while i < len(ops_local):
        if priority[ops_local[i]] == 2:
            a = vals[i]
            b = vals[i+1]

            res = ops[ops_local[i]](a, b)   # 🔥 dùng global ops

            vals[i] = res
            del vals[i+1]
            del ops_local[i]
        else:
            i += 1

    result = vals[0]
    for i, op in enumerate(ops_local):
        result = ops[op](result, vals[i+1])

    return result

def calculate_subexp(subexp, index, dp_result):
    func_stack = subexp['func_stack']
    ops_stack = subexp['ops_stack']
    dp_result[index] = calc(func_stack, ops_stack)

def is_float(s):
    try:
        float(s)
        return True
    except (ValueError, TypeError):
        return False

def apply_parameter(df, small_funcs, dp_result):
    for i in range(len(small_funcs)):
        func = small_funcs[i]
        if isinstance(func, str):
            if is_float(func):
                small_funcs[i] = float(func)
            else:
                small_funcs[i] = df[func]
        elif isinstance(func, list):
            if func[0] == 'get':
                small_funcs[i] = dp_result[func[1]]
            elif func[0] in trigo_ops:
                small_funcs[i] = trigo_ops[func[0]](dp_result[func[1]], dp_result[func[2]])
            else:
                small_funcs[i] = func_ops[func[0]](dp_result[func[1]], dp_result[func[2]])

def recalculate(df: pd.DataFrame, sub_expressions, dp_result):
    i = 0
    while i < len(sub_expressions):
        apply_parameter(df, sub_expressions[i]['func_stack'], dp_result)
        calculate_subexp(sub_expressions[i], index, dp_result)
        i += 1
    
