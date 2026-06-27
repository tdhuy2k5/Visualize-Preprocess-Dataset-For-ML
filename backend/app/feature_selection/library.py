from dataclasses import dataclass
from typing import Any, List


@dataclass
class FeatureInfo:
    variance: float
    low_variance_flag: bool | None
    mutual_information: float
    chi_square: Any
    correlated_with: Any
    high_correlation_flag: Any


@dataclass
class FeaturesSummary:
    total_features: int
    low_variance_features: List[str]
    high_correlation_features: List[str]
