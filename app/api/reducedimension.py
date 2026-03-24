from fastapi import APIRouter
import pandas as pd

from app.schemas.reducedimension import ReductionRequest
from app.services.reducedimension import run_pca, run_umap

router = APIRouter(prefix="/reduction", tags=["Reduction"])


@router.post("/")
def reduce_dimension(req: ReductionRequest):
    df = pd.DataFrame(req.data)

    if req.method == "pca":
        reduced = run_pca(df)

    elif req.method == "umap":
        reduced = run_umap(df)

    else:
        return {"error": "Invalid method"}

    result = []

    for i, row in df.iterrows():
        result.append({
            **row.to_dict(),
            "x": float(reduced[i, 0]),
            "y": float(reduced[i, 1])
        })

    return {
        "method": req.method,
        "data": result
    }