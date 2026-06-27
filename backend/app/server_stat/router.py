from app.server_stat.schemas import ServerStatusResponse
from fastapi import APIRouter
from app.server_stat import service as ServerService

router = APIRouter(
    prefix="/server",
    tags=["server"],
    responses={404: {"description": "Not found"}},
)


@router.get("/status")
def get_status() -> ServerStatusResponse:
    return ServerService.get_server_status()
