from fastapi import APIRouter
import pandas as pd
from pydantic import BaseModel
from app.services.pipeline import split_dataset, build_preprocessor, make_training_pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

router = APIRouter(prefix="/pipeline", tags=["Pipeline"])

class PipelineRequest(BaseModel):
    data: list[dict]
    target: str
    numeric_features: list[str] = []
    categorical_features: list[str] = []
    estimator: str = "logistic"  # "logistic" or "rf"

@router.post("/run")
def run_pipeline(req: PipelineRequest):
    df = pd.DataFrame(req.data)
    X_train, X_val, X_test, y_train, y_val, y_test = split_dataset(df, req.target)
    preproc = build_preprocessor(req.numeric_features, req.categorical_features)
    if req.estimator == "logistic":
        est = LogisticRegression()
    elif req.estimator == "rf":
        est = RandomForestClassifier()
    else:
        raise ValueError("Unsupported estimator")
    pipe = make_training_pipeline(preproc, est)
    pipe.fit(X_train, y_train)
    train_score = pipe.score(X_train, y_train)
    val_score = pipe.score(X_val, y_val)
    test_score = pipe.score(X_test, y_test)
    return {
        "train_score": train_score,
        "val_score": val_score,
        "test_score": test_score
    }