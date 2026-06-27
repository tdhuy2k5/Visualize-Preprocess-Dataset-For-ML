from app.pipeline.schemas import StepType
from app.pipeline.service import save_pipeline
from app.dependencies.dataset_action import DatasetContext
from pathlib import Path

from fastapi import APIRouter, Depends

import app.feature_encoding.service as encoding
from app.dependencies.dataset_action import get_dataset

from .schemas import EncodingRequest

router = APIRouter(prefix="/features/encoding", tags=["Encoding"])

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = (BASE_DIR / "../../cached").resolve()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/")
def encode_data(req: EncodingRequest, context: DatasetContext = Depends(get_dataset)):
    method = req.method
    if method == "one_hot":
        if context.df[req.column].nunique() < 5:
            encoding.one_hot(context.df, req.column)
        else:
            raise ValueError("Too many unique rows")
    elif method == "label":
        encoding.label_encode(context.df, req.column)
    elif method == "target":
        encoding.target_encode(context.df, req.column, req.target)
    elif method == "count":
        encoding.count_encode(context.df, req.column)
    elif method == "freq":
        encoding.freq_encode(context.df, req.column)
    elif method == "binary":
        encoding.binary_encode(context.df, req.column)
    elif method == "ordinal":
        encoding.ordinal_encode(context.df, req.column, req.mapping)
    else:
        raise ValueError("Unsupported encoding method")
    context.steps.append(StepType(type="encoding", data=req))

    save_pipeline(context.dataset_id, context.steps)
    return True
