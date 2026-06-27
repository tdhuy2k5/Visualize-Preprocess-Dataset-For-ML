from typing import Literal

from pydantic import BaseModel


class EncodingRequest(BaseModel):
    method: Literal["one_hot", "label", "target", "count", "freq", "binary", "ordinal"]
    columns: list[str] = []
    column: str = ""
    target: str = ""
    mapping: dict = {}
