from pydantic import BaseModel


class UploadedDataset(BaseModel):
    name: str
    dateModified: str
    size: int
