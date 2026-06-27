from app.dependencies.dataset_action import get_dataset
from app.dependencies.dataset_action import DatasetContext
import pandas as pd
from fastapi import APIRouter, Depends

from .schemas import (
    AnalyzedFeatures,
    BackwardRequest,
    FilterRequest,
    ReductionRequest,
    ReductionResponse,
    RfeRequest,
)
from .service import (
    analyze_features,
    get_reduce_dimension,
    recommend_features_backward_elimination,
    recommend_features_rfe,
)

router = APIRouter(prefix="/feature-selection", tags=["Feature Selection"])


@router.post("/filter")
def filter_features(
    req: FilterRequest, context: DatasetContext = Depends(get_dataset)
) -> AnalyzedFeatures:
    df = context.df
    return analyze_features(df, req.target)


@router.post("/rfe")
def rfe_features(req: RfeRequest, context: DatasetContext = Depends(get_dataset)):
    df = context.df
    df = pd.DataFrame(req.data)
    X = df.drop(columns=[req.target])
    y = df[req.target]
    result = recommend_features_rfe(X, y, target_n_features=req.n_features)
    return result


@router.post("/backward")
def backward_features(
    req: BackwardRequest, context: DatasetContext = Depends(get_dataset)
):
    df = context.df
    df = pd.DataFrame(req.data)
    X = df.drop(columns=[req.target])
    y = df[req.target]
    result = recommend_features_backward_elimination(
        X, y, min_features_to_keep=req.min_features
    )
    return result


@router.post("/reduction")
def reduce_dimension(
    req: ReductionRequest, context: DatasetContext = Depends(get_dataset)
) -> ReductionResponse:
    df = context.df
    return get_reduce_dimension(df, method=req.method)

