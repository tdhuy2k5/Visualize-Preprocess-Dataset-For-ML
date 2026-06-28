from fastapi import APIRouter

from app.dataset_eda import router as eda
from app.server_stat import router as ServerStat
from app.dataset_transfer import router as Storage
from app.dataset_column import router as Column
from app.dataset_chart import router as Chart
from app.feature_encoding import router as Encoding
from app.feature_transformation import router as Transformation
from app.feature_imbalance import router as Imbalanced
from app.feature_engineering import router as FeatureEngineer
from app.pipeline import router as Pipeline
from app.decision_tree import router as DecisionTree

api_router = APIRouter()

api_router.include_router(eda.router)
api_router.include_router(ServerStat.router)
api_router.include_router(Storage.router)
api_router.include_router(Column.router)
api_router.include_router(Chart.router)
api_router.include_router(Encoding.router)
api_router.include_router(Transformation.router)
api_router.include_router(Imbalanced.router)
api_router.include_router(FeatureEngineer.router)
api_router.include_router(Pipeline.router)
api_router.include_router(DecisionTree.router)
