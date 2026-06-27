from typing import Dict, List

from pydantic import BaseModel


class HistogramResponse(BaseModel):
    column: str
    bins: int
    histogram: List[Dict[str, int | float]]


class BoxPlotResponse(BaseModel):
    column: str
    min: float | int
    q1: float | int
    median: float | int
    q3: float | int
    max: float | int
    outliers: List[float | int]
    lower_bound: float | int
    upper_bound: float | int


class PCAResponse(BaseModel):
    points: List[List[float]]
    explained_variance: List[float]
    total_variance: float


class ScatterPlotResponse(BaseModel):
    points: List[List[float]]


class KDEResponse(BaseModel):
    points: List[List[float]]


class HeatmapResponse(BaseModel):
    labels: List[str]
    matrix: list[list[float]]
