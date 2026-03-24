from fastapi import APIRouter
import pandas as pd
from pydantic import BaseModel
from app.services.imbalanced import handle_imbalanced

router = APIRouter(prefix="/imbalanced", tags=["Imbalanced Data"])

class ImbalancedRequest(BaseModel):
    data: list[dict]
    target: str
    method: str = "smote"

@router.post("/")
def handle_imbalanced_data(req: ImbalancedRequest):
    df = pd.DataFrame(req.data)
    result_df = handle_imbalanced(df, req.target, req.method)
    return {"data": result_df.to_dict("records"), "shape": result_df.shape}