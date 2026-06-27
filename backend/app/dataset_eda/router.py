from typing import Annotated, List, Literal

from app.dependencies.dataset_action import DatasetContext
from fastapi import APIRouter, Depends, HTTPException, Query

from app.dataset_eda.dependencies import check_columns_exist
from app.dataset_eda.schemas import (
    PagingParams,
    RowsResponse,
)
import app.dataset_eda.service as EdaService
from app.dependencies.dataset_action import get_dataset

from .dependencies import build_query

router = APIRouter(
    prefix="/dataset",
    tags=["dataset"],
    responses={404: {"description": "Not found"}},
)


@router.get("/prebuilt")
def get_prebuild_dataset():
    return [
        {
            "id": "iris",
            "name": "Iris Dataset",
            "image": "Deceased",
            "description": "Containing 150 samples of iris flowers with four features each, used to classify them into three species: setosa, versicolor, and virginica. It’s small, clean, and ideal for beginners learning multiclass classification.",
        },
        {
            "id": "wine",
            "name": "Wine Dataset",
            "image": "Wine_Bar",
            "description": "Having 178 samples of wines with 13 chemical features, classified into three cultivars. It’s commonly used to practice feature analysis and multiclass classification models.",
        },
        {
            "id": "breast",
            "name": "Breast Cancer Dataset",
            "image": "Oncology",
            "description": "Including 569 samples of cell nuclei features, labeled as malignant or benign tumors. It’s a classic binary classification dataset used in medical machine learning applications.",
        },
    ]


@router.get("/rows/filters")
def get_filtered_rows(
    paging: Annotated[PagingParams, Query()],
    query: str = Depends(build_query),
    context: DatasetContext = Depends(get_dataset),
) -> RowsResponse:
    df = context.df
    return EdaService.get_filtered_rows(
        query,
        paging.limit,
        paging.offset,
        df,
    )


@router.get("/rows/duplicated")
def get_duplicates(
    paging: PagingParams = Depends(),
    context: DatasetContext = Depends(get_dataset),
    subset: List[str] = Depends(check_columns_exist),
    keep: Literal["first", "last", "false"] = "false",
) -> RowsResponse:
    df = context.df
    return EdaService.get_duplicated_rows(
        limit=paging.limit,
        offset=paging.offset,
        df=df,
        subset=subset,
        keep=False if keep == "false" else keep,
    )


@router.get("/rows/missing")
def get_missings(
    paging: PagingParams = Depends(),
    context: DatasetContext = Depends(get_dataset),
    subset: List[str] | None = Depends(check_columns_exist),
) -> RowsResponse:
    df = context.df
    return EdaService.get_missing_rows(
        limit=paging.limit,
        offset=paging.offset,
        df=df,
        subset=subset,
    )


@router.get("/scatterplot")
def get_scatterPlot(
    paging: PagingParams = Depends(),
    context: DatasetContext = Depends(get_dataset),
    subset: List[str] | None = Depends(check_columns_exist),
):
    df = context.df
    if not (subset):
        raise HTTPException(status_code=400, detail="There is no input columns")
    return EdaService.get_scatterplot(df, subset, paging.limit, paging.offset)
