from pydantic import BaseModel


class ServerStatusResponse(BaseModel):
    ram: float
    storage: str
