from fastapi import APIRouter
import pandas as pd
from pydantic import BaseModel
from app.services import sp_ops
from app.services import exp_eval

router = APIRouter(prefix="/feature-engineering", tags=["Feature Engineering"])

class FeatureEngRequest(BaseModel):
    data: list[dict]
    operation: str  # e.g., "extract_datetime", "text_length", etc., "expression"
    column: str = None
    new_col: str = None
    params: dict = {}  # for additional parameters

@router.post("/")
def engineer_feature(req: FeatureEngRequest):
    df = pd.DataFrame(req.data)
    op = req.operation
    if op == "extract_datetime":
        sp_ops.extract_datetime(df, req.column)
    elif op == "text_length":
        sp_ops.text_length(df, req.column, req.new_col)
    elif op == "word_count":
        sp_ops.word_count(df, req.column, req.new_col)
    elif op == "text_sentiment":
        sp_ops.text_sentiment(df, req.column, req.new_col)
    elif op == "flag_missing":
        sp_ops.flag_missing(df, req.column, req.new_col)
    elif op == "groupby_agg":
        sp_ops.groupby_agg(df, req.params["group_col"], req.params["agg_col"], req.new_col, req.params.get("agg_func", "mean"))
    elif op == "expression":
        # Use exp_eval for expression-based feature creation
        expression = req.params.get("expression", "")
        new_col = req.new_col or "new_feature"
        result = exp_eval.exp_compiler(df, expression, new_col)
        df[new_col] = result
    else:
        raise ValueError("Unsupported operation")
    return {"data": df.to_dict("records")}