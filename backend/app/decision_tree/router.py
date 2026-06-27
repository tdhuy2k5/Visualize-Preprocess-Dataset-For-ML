from uuid import UUID
from fastapi import APIRouter, Depends, Query

import app.decision_tree.service as Service
from app.dependencies.dataset_action import DatasetContext, get_dataset

router = APIRouter(
    prefix="/model/decision-tree",
    tags=["model, decision-tree"],
    responses={404: {"description": "Not found"}},
)


@router.get("/tree")
def get_tree(context: DatasetContext = Depends(get_dataset)):
    return Service.get_tree(data=context.df, feature_names=context.df.columns[:-1])


@router.post("/split")
def add_node(node_id: UUID = Query(None)):
    return Service.add_node(node_id)
