from app.dependencies.dataset_action import DatasetContext
from fastapi import APIRouter, Depends

from app.dependencies.dataset_action import get_dataset

from .schemas import ColumnInfoResponse, RenameColumnRequest, RenameColumnResponse
from .service import get, rename

router = APIRouter(
    prefix="/dataset/columns",
    tags=["dataset"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=ColumnInfoResponse)
async def get_columns(
    context: DatasetContext = Depends(get_dataset),
):
    df = context.df
    return get(df)


@router.post("/", response_model=RenameColumnResponse)
async def rename_columns(
    payload: RenameColumnRequest,
    context: DatasetContext = Depends(get_dataset),
):
    df = context.df
    return rename(df, old_names=payload.old_names, new_names=payload.new_names)
