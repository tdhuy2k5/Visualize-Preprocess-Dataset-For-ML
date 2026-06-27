from typing import List, Literal, Optional

from pydantic import BaseModel


class NodeSchema(BaseModel):
    id: str
    parent: Optional[str] = None
    half: Optional[Literal["left", "right"]] = None
    depth: int
    samples: int

    dist: List[int]

    type: Literal["split", "leaf"]
    title: str

    gini: Optional[float] = None
    gini_history: dict[str, float]
