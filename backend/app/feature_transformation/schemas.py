from pydantic import BaseModel


class TransformRequest(BaseModel):
    method: str  # "log", "sqrt", "minmax", "standard", "robust", "power", "normalize"
    columns: list[str]
