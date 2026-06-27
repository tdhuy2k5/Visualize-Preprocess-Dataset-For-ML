from typing import Literal

from pydantic import BaseModel

from app.feature_encoding.schemas import EncodingRequest
from app.feature_engineering.schemas import FeatureEngRequest
from app.feature_imbalance.schemas import ImbalancedRequest
from app.feature_transformation.schemas import TransformRequest


class StepType(BaseModel):
    type: Literal["encoding", "transform", "engineer", "imbalance"]
    data: TransformRequest | EncodingRequest | FeatureEngRequest | ImbalancedRequest
