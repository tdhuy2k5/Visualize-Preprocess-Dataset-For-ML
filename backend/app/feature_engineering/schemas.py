from pydantic import BaseModel


class FeatureEngRequest(BaseModel):
    operation: str  # e.g., "extract_datetime", "text_length", etc., "expression"
    column: str = ""
    new_col: str = ""
    params: dict = {}  # for additional parameters
