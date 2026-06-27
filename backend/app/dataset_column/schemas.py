from typing import Any, Dict, Hashable, List, Tuple

from pydantic import BaseModel


class RowsResponse(BaseModel):
    rows: List[Dict[Hashable, Any]]
    count: int


class ColumnInfoResponse(BaseModel):
    columns: Dict[Hashable, Dict[Hashable, Any]]
    head: RowsResponse
    shape: Tuple[int, int]


class RenameColumnRequest(BaseModel):
    old_names: List[str]
    new_names: List[str]


class RenameColumnResponse(BaseModel):
    old_names: List[str]
    new_names: List[str]
