from app.pipeline.service import save_pipeline
from fastapi import HTTPException
from app.dependencies.dataset_action import DatasetContext
from fastapi import Depends
from app.dependencies.dataset_action import get_dataset
from fastapi import APIRouter

router = APIRouter(prefix="/pipeline", tags=["pipeline"])


@router.get("/")
def get_pipeline(context: DatasetContext = Depends(get_dataset)):
    return context.steps


@router.delete("/{step_index}")
def delete_step(step_index: int, context: DatasetContext = Depends(get_dataset)):
    if step_index < 0 or step_index >= len(context.steps):
        raise HTTPException(status_code=404, detail="Step not found")

    context.steps.pop(step_index)

    save_pipeline(context.dataset_id, context.steps)

    return {"steps": len(context.steps)}
