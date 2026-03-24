from fastapi import APIRouter
import pandas as pd
from pydantic import BaseModel
from app.services.analyze_features import analyze_features
from app.services.wrapper_analyze_feature import recommend_features_rfe, recommend_features_backward_elimination

router = APIRouter(prefix="/feature-selection", tags=["Feature Selection"])

class FilterRequest(BaseModel):
    data: list[dict]
    target: str

class RfeRequest(BaseModel):
    data: list[dict]
    target: str
    n_features: int = 10

class BackwardRequest(BaseModel):
    data: list[dict]
    target: str
    min_features: int = 10

@router.post("/filter")
def filter_features(req: FilterRequest):
    df = pd.DataFrame(req.data)
    result = analyze_features(df, req.target)
    selected = [k for k, v in result["features"].items() if v["recommendation"]["action"] == "keep"]
    return {
        "selected_features": selected,
        "summary": result["summary"],
        "details": result["features"]
    }

@router.post("/rfe")
def rfe_features(req: RfeRequest):
    df = pd.DataFrame(req.data)
    X = df.drop(columns=[req.target])
    y = df[req.target]
    result = recommend_features_rfe(X, y, target_n_features=req.n_features)
    return result

@router.post("/backward")
def backward_features(req: BackwardRequest):
    df = pd.DataFrame(req.data)
    X = df.drop(columns=[req.target])
    y = df[req.target]
    result = recommend_features_backward_elimination(X, y, min_features_to_keep=req.min_features)
    return result