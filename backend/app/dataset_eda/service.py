from typing import Any, Dict, Hashable, List, Literal, Tuple

import numpy as np
import pandas as pd
from scipy.stats._kde import gaussian_kde

from app.dataset_eda.schemas import (
    ColumnInfoResponse,
    KDEResponse,
    RowsResponse,
)


def get_filtered_rows(
    query: str,
    limit: int,
    offset: int,
    df: pd.DataFrame,
) -> RowsResponse:
    queried_df = df.query(query) if query else df

    # apply limit and offset
    filtered_df = queried_df.iloc[offset : offset + limit]
    rows: List[List[float | str]] = filtered_df.round(2).values.tolist()
    return RowsResponse(rows=rows, count=queried_df.shape[0])


def get_columns(
    df: pd.DataFrame,
) -> ColumnInfoResponse:
    """
    Get the list of column names, first 5 rows (head), and shape of the dataset.

    Args:
        df (pd.DataFrame): The DataFrame passed via the Depends function.

    Returns:
        dict: A dictionary containing:
            - "columns": List of column names and their info.
            - "head": The first 5 rows of the DataFrame.
            - "shape": Tuple representing the shape of the DataFrame (rows, columns).
    """
    # Get the columns as a list
    columnsInfo: Dict[Hashable, Dict[Hashable, Any]] = df.describe().to_dict("index")
    # Get the first 5 rows (head) of the DataFrame
    rows = df.head().values.tolist()
    head = RowsResponse(rows=rows, count=len(rows))

    # Get the shape of the DataFrame (rows, columns)
    shape: Tuple[int, int] = df.shape  # This is a tuple (rows, columns)

    return ColumnInfoResponse(
        columns=columnsInfo,
        head=head,
        shape=shape,
    )


def get_duplicated_rows(
    limit: int,
    offset: int,
    df: pd.DataFrame,
    keep: Literal[False, "first", "last"],
    subset: None | List[str] = None,
) -> RowsResponse:
    """
    Find duplicated rows in a DataFrame.

    Args:
        df: Input DataFrame
        subset: Columns to consider (None = all columns)
        keep: 'first', 'last', or False
            - 'first': mark duplicates except first occurrence
            - 'last': mark duplicates except last occurrence
            - False: mark ALL duplicates

    Returns:
        DataFrame containing duplicated rows
    """
    duplicates_mask = df.duplicated(subset=subset, keep=keep)
    filtered_df = df.loc[duplicates_mask]
    rows = filtered_df.iloc[offset : offset + limit].values.tolist()
    return RowsResponse(rows=rows, count=len(rows))


def get_missing_rows(
    limit: int,
    offset: int,
    df: pd.DataFrame,
    subset: None | List[str] = None,
) -> RowsResponse:
    """
    Find rows with missing values in a DataFrame.

    Args:
        df: Input DataFrame
        subset: Columns to check (None = all columns)

    Returns:
        Rows containing missing values
    """
    if subset:
        missing_mask = df[subset].isna().any(axis=1)
    else:
        missing_mask = df.isna().any(axis=1)
    missing_df = df[missing_mask]
    missing_df = missing_df.iloc[offset : offset + limit]

    rows = missing_df.values.tolist()

    return RowsResponse(rows=rows, count=len(missing_df))


def get_scatterplot(
    df: pd.DataFrame, subset, limit: int = 100, offset: int = 0
) -> RowsResponse:
    rows: List = df[subset].iloc[offset : offset + limit].to_dict(orient="records")
    return RowsResponse(rows=rows, count=len(rows))


def get_KDEplot(df: pd.DataFrame, subset: str) -> KDEResponse:
    att: pd.Series = df[subset]
    kde = gaussian_kde(att)
    x_vals = np.linspace(att.min(), att.max(), 200)
    y_vals = kde(x_vals)
    points = [{"x": float(x), "y": float(y)} for x, y in zip(x_vals, y_vals)]
    return KDEResponse(points=points)
