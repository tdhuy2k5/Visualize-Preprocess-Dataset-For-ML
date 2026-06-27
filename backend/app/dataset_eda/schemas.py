from typing import Any, Dict, Hashable, List, Tuple

from pydantic import BaseModel, Field


class RowsResponse(BaseModel):
    rows: List[List[float | str]]
    count: int


class PagingParams(BaseModel):
    limit: int = Field(1, ge=1, le=25, description="Number of rows to return")
    offset: int = Field(0, ge=0, description="Number of rows to skip")


class ColumnInfoResponse(BaseModel):
    columns: Dict[Hashable, Dict[Hashable, Any]]
    head: RowsResponse
    shape: Tuple[int, int]


class KDEResponse(BaseModel):
    points: List[Dict[str, float]]
