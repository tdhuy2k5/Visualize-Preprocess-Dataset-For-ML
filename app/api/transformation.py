from fastapi import APIRouter
import pandas as pd
from pydantic import BaseModel
from app.services import transformation

router = APIRouter(prefix="/transformation", tags=["Transformation"])

class TransformRequest(BaseModel):
    data: list[dict]
    method: str  # "log", "sqrt", "minmax", "standard", "robust", "power", "normalize"
    columns: list[str]

@router.post("/")
def transform_data(req: TransformRequest):
    df = pd.DataFrame(req.data)
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
    return {"data": df.to_dict("records")}