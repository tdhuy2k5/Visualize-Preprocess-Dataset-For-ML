from typing import List

import pandas as pd
from fastapi import Depends, HTTPException, Query, Request
from app.dependencies.dataset_action import DatasetContext
from app.dependencies.dataset_action import get_dataset


def check_column_exist(
    column_name: str, context: DatasetContext = Depends(get_dataset)
) -> str:
    df = context.df
    if column_name not in df.columns:
        raise HTTPException(status_code=404, detail="Column not found")
    return column_name


def check_columns_exist(
    subset: List[str] = Query(...), context: DatasetContext = Depends(get_dataset)
) -> List[str]:
    if not subset:
        raise HTTPException(status_code=400, detail=f"Invalid subset: {subset}")
    return [check_column_exist(c, context) for c in subset]


def check_column_numberic(
    column_name: str = Depends(check_column_exist),
    context: DatasetContext = Depends(get_dataset),
) -> str:
    df = context.df
    if not pd.api.types.is_numeric_dtype(df[column_name]):
        raise HTTPException(status_code=400, detail="Column is not numeric")
    return column_name


def build_query(
    request: Request, context: DatasetContext = Depends(get_dataset)
) -> str:
    df = context.df
    filters = {
        k: v
        for k, v in request.query_params.items()
        if k not in {"limit", "offset", "dataset_id"}
    }
    expressions = []

    for key, value in filters.items():
        if "__" in key:
            raise HTTPException(400, f"Invalid filter param: {key}")

        # Determine operator and column
        if key.startswith("min_"):
            col = key[4:]
            op = ">="
        elif key.startswith("max_"):
            col = key[4:]
            op = "<="
        elif key.startswith("not_"):
            col = key[4:]
            op = "!="
        else:
            col = key
            op = "=="

        if col not in df.columns:
            raise HTTPException(400, f"Column not found: {col}")

        # wrap string between ""
        if pd.api.types.is_string_dtype(df[col]):
            val_str = f'"{value}"'
        # turn number to string
        else:
            val_str = str(value)

        expressions.append(f"{col} {op} {val_str}")

    # build query string
    query_str = " and ".join(expressions)
    return query_str
