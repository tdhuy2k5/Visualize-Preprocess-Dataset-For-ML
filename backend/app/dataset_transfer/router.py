from fastapi import APIRouter, WebSocket

from app.dataset_transfer.service import (
    save_chunk,
    validate_file,
    delete_file,
    get_uploaded_dataset,
)

router = APIRouter(
    prefix="/dataset",
    tags=["dataset, transfer"],
    responses={404: {"description": "Not found"}},
)


@router.get("/uploaded")
def get_uploaded():
    return get_uploaded_dataset()


@router.websocket("/upload")
async def upload_dataset(ws: WebSocket):
    await ws.accept()
    MAX_SIZE = 50 * 1024 * 1024
    file_name = await ws.receive_text()
    if file_name:
        await ws.send_json({"type": "ready"})
    total_received = 0
    while True:
        message = await ws.receive()
        if "bytes" not in message:
            break
        chunk = message["bytes"]
        if not chunk:
            break
        total_received += len(chunk)
        if total_received > MAX_SIZE:
            await ws.send_json(
                {"type": "error", "message": "File exceeds the 50 MB limit."}
            )
            await ws.close(code=1009)
            return
        await save_chunk(file_name, chunk)
        await ws.send_json({"type": "progress", "uploaded_bytes": total_received})
    try:
        await validate_file(file_name)
        await ws.send_json({"type": "success"})
    except ValueError as e:
        await ws.send_json(
            {
                "type": "error",
                "message": str(e),
            }
        )
        await delete_file(file_name)  # cleanup
    finally:
        await ws.close()
