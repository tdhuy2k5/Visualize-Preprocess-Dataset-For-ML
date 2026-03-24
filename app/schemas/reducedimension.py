from pydantic import BaseModel
from typing import List, Dict

class ReductionRequest(BaseModel):
    data: List[Dict]
    method: str = "pca"
    n_components: int = 2