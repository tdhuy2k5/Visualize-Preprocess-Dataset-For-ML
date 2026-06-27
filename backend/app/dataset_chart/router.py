from app.dataset_chart.schemas import ScatterPlotResponse
from app.dataset_chart.schemas import KDEResponse
from fastapi import HTTPException
from app.dataset_chart.schemas import PCAResponse
from typing import List

from app.dependencies.dataset_action import DatasetContext
import pandas as pd
from fastapi import APIRouter, Depends, Query

from app.dataset_chart import service as ChartService
from app.dataset_chart.schemas import (
    BoxPlotResponse,
    HeatmapResponse,
    HistogramResponse,
)
from app.dependencies.dataset_action import (
    check_column_numberic,
    check_columns_exist,
    get_dataset,
)

router = APIRouter(
    prefix="/dataset/charts",
    tags=["dataset"],
    responses={404: {"description": "Not found"}},
)


# Get histogram statistics for a single column
@router.get("/histogram")
async def get_column_histogram(
    column_name: str = Depends(
        check_column_numberic
    ),  # The column name (from the URL path)
    bins: int = Query(10, ge=1, le=100),  # Number of bins, must be between 1 and 100
    context: DatasetContext = Depends(
        get_dataset
    ),  # The DataFrame passed via the Depends function
) -> HistogramResponse:
    df = context.df
    return ChartService.get_column_histogram(
        column_name,
        bins,
        df,
    )


@router.get("/boxplot")
async def get_boxplot_statistics(
    column_name: str = Depends(
        check_column_numberic
    ),  # Column name of the numeric column to check
    df: pd.DataFrame = Depends(
        get_dataset
    ),  # DataFrame passed via dependency injection
) -> BoxPlotResponse:
    return ChartService.get_boxplot_statistics(column_name, df)


@router.get("/heatmap")
def get_heatmap(
    context: DatasetContext = Depends(get_dataset),
    subset: List[str] = Depends(check_columns_exist),
) -> HeatmapResponse:
    df = context.df
    return ChartService.get_heatmap(df=df, subset=subset)


@router.get("/pca")
def get_PCA(context: DatasetContext = Depends(get_dataset)) -> PCAResponse:
    df = context.df
    try:
        return ChartService.get_pca_chart(df)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/kde")
def get_kdeplot(
    context: DatasetContext = Depends(get_dataset),
    column_name: str = Depends(check_column_numberic),
) -> KDEResponse:
    df = context.df
    return ChartService.get_KDEplot(df, column_name)


@router.get("/scatter")
def get_scatterplot(
    context: DatasetContext = Depends(get_dataset),
    subset: List[str] = Depends(check_columns_exist),
) -> ScatterPlotResponse:
    df = context.df
    return ChartService.get_scatterplot(df=df, subset=subset)
