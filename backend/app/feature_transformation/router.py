from app.pipeline.schemas import StepType
from app.pipeline.service import save_pipeline
from app.dependencies.dataset_action import DatasetContext
from app.dependencies.dataset_action import get_dataset
from fastapi import Depends
import app.feature_transformation.service as transformation
from fastapi import APIRouter

from .schemas import TransformRequest

router = APIRouter(prefix="/features/transformation", tags=["Transformation"])


@router.post("/")
def transform_data(
    req: TransformRequest, context: DatasetContext = Depends(get_dataset)
):
    df = context.df
    method = req.method
    if method == "log":
        df = transformation.log_transform(df, req.columns)
    elif method == "sqrt":
        df = transformation.sqrt_transform(df, req.columns)
    elif method == "minmax":
        df = transformation.minmax_scale(df, req.columns)
    elif method == "standard":
        df = transformation.standard_scale(df, req.columns)
    elif method == "robust":
        df = transformation.robust_scale(df, req.columns)
    elif method == "power":
        df = transformation.power_transform(df, req.columns)
    elif method == "normalize":
        df = transformation.normalize(df, req.columns)
    else:
        raise ValueError("Unsupported transformation method")
    context.steps.append(StepType(type="transform", data=req))
    save_pipeline(context.dataset_id, context.steps)

    return True
