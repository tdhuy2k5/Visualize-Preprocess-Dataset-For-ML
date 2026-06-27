from typing import Any, Dict, List, Literal

from pydantic import BaseModel

from .library import FeatureInfo, FeaturesSummary


class FilterRequest(BaseModel):
    data: list[dict]
    target: str


class RfeRequest(BaseModel):
    data: list[dict]
    target: str
    n_features: int = 10


class BackwardRequest(BaseModel):
    data: list[dict]
    target: str
    min_features: int = 10


class ReductionRequest(BaseModel):
    data: List[Dict]
    method: Literal["pca", "umap"] = "pca"
    n_components: int = 2


class AnalyzedFeatures(BaseModel):
    select: List[str]
    summary: FeaturesSummary
    detail: Dict[str, FeatureInfo]


class ReductionResponse(BaseModel):
    method: Literal["pca", "umap"]
    data: Any
