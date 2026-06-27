from app.pipeline.schemas import StepType
from dataclasses import dataclass
from app.pipeline.service import load_pipeline
from pathlib import Path
from typing import List, cast

import pandas as pd
from fastapi import Depends, HTTPException, Query
from sklearn.utils import Bunch

from app.pipeline.service import apply_pipeline

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = (BASE_DIR / "../../cached").resolve()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@dataclass
class DatasetContext:
    dataset_id: str
    df: pd.DataFrame
    steps: list[StepType]


def get_dataset(dataset_id: str = Query(...)):
    if dataset_id == "iris":
        from sklearn.datasets import load_iris

        data = cast(Bunch, load_iris())
        df = pd.DataFrame(data.data, columns=data.feature_names)
        df["target"] = data.target
        steps = load_pipeline(dataset_id)
        df = apply_pipeline(df, steps)
        return DatasetContext(dataset_id=dataset_id, df=df, steps=steps)

    elif dataset_id == "wine":
        from sklearn.datasets import load_wine

        data: Bunch = cast(Bunch, load_wine())
        df = pd.DataFrame(data.data, columns=data.feature_names)
        df["target"] = data.target
        steps = load_pipeline(dataset_id)
        df = apply_pipeline(df, steps)
        return DatasetContext(dataset_id=dataset_id, df=df, steps=steps)
    elif dataset_id == "breast":
        from sklearn.datasets import load_breast_cancer

        data: Bunch = cast(Bunch, load_breast_cancer())
        df = pd.DataFrame(data.data, columns=data.feature_names)
        df["target"] = data.target
        steps = load_pipeline(dataset_id)
        df = apply_pipeline(df, steps)
        return DatasetContext(dataset_id=dataset_id, df=df, steps=steps)

    UPLOAD_DIR = (BASE_DIR / "../../storage").resolve()
    csv_path = UPLOAD_DIR / f"{dataset_id}.csv"

    if csv_path.exists():
        df = pd.read_csv(csv_path)
        steps = load_pipeline(dataset_id)
        df = apply_pipeline(df, steps)
        return DatasetContext(
            dataset_id=dataset_id,
            df=df,
            steps=steps,
        )
    else:
        raise HTTPException(status_code=404, detail="Dataset not found")


def check_column_exist(
    column_name: str = Query(...), context: DatasetContext = Depends(get_dataset)
) -> str:
    df = context.df
    if column_name not in df.columns:
        raise HTTPException(status_code=404, detail="Column not found")
    return column_name


def check_columns_exist(
    subset: List[str] = Query(default=None),
    context: DatasetContext = Depends(get_dataset),
) -> List[str] | None:
    if not subset:
        return None
    return [check_column_exist(c, context) for c in subset]


def check_column_numberic(
    column_name: str = Depends(check_column_exist),
    context: DatasetContext = Depends(get_dataset),
) -> str:
    df = context.df
    if not pd.api.types.is_numeric_dtype(df[column_name]):
        raise HTTPException(status_code=400, detail="Column is not numeric")
    return column_name
