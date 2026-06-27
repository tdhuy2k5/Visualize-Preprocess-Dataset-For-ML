from app.pipeline.schemas import StepType
from app.pipeline.service import save_pipeline
from app.dependencies.dataset_action import DatasetContext
from app.dependencies.dataset_action import get_dataset
from fastapi import Depends
from fastapi import APIRouter
from app.feature_imbalance.service import handle_imbalanced

from .schemas import ImbalancedRequest

router = APIRouter(prefix="/features/imbalanced", tags=["Imbalanced Data"])


@router.post("/")
def handle_imbalanced_data(
    req: ImbalancedRequest, context: DatasetContext = Depends(get_dataset)
):
    df = context.df
    handle_imbalanced(df, req.target, req.method)
    context.steps.append(StepType(type="imbalance", data=req))

    save_pipeline(context.dataset_id, context.steps)
    return True
