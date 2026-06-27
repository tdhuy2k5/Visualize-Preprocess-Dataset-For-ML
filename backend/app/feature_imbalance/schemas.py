from pydantic import BaseModel


class ImbalancedRequest(BaseModel):
    target: str
    method: str = "smote"
