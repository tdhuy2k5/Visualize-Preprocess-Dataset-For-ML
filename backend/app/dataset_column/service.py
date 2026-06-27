from typing import Any, Dict, Hashable, List, Tuple

import pandas as pd

from .schemas import ColumnInfoResponse, RenameColumnResponse, RowsResponse


def rename(
    df: pd.DataFrame, old_names: List[str], new_names: List[str]
) -> RenameColumnResponse:
    """
    Rename multiple columns in a DataFrame.

    Parameters:
    - df: pandas DataFrame
    - old_names: list of existing column names to rename
    - new_names: list of new column names to assign

    Returns:
    - A new DataFrame with renamed columns
    """
    if len(old_names) != len(new_names):
        raise ValueError("Length of old_name and new_name lists must match")

    rename_dict = dict(zip(old_names, new_names))
    df = df.rename(columns=rename_dict)
    return RenameColumnResponse(new_names=new_names, old_names=old_names)


def get(
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
    columnsInfo: Dict[Hashable, Dict[Hashable, Any]] = df.describe().T.to_dict("index")
    dtypes = df.dtypes.astype(str)
    for col in columnsInfo:
        columnsInfo[col]["type"] = dtypes[str(col)]
    # Get the first 5 rows (head) of the DataFrame
    rows = df.head().to_dict(orient="records")  # Convert to a list of dictionaries
    head = RowsResponse(rows=rows, count=len(rows))

    # Get the shape of the DataFrame (rows, columns)
    shape: Tuple[int, int] = df.shape  # This is a tuple (rows, columns)

    return ColumnInfoResponse(
        columns=columnsInfo,
        head=head,
        shape=shape,
    )
