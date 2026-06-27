from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.dataset_eda import router as eda
from app.server_stat import router as ServerStat
from app.dataset_transfer import router as Storage
from app.dataset_column import router as Column
from app.dataset_chart import router as Chart
from app.feature_encoding import router as Encoding
from app.feature_transformation import router as Transformation
from app.feature_engineering import router as FeatureEngineer
from app.feature_imbalance import router as Imbalanced
from app.pipeline import router as Pipeline
from app.decision_tree import router as DecisionTree

app = FastAPI()
app.include_router(eda.router)
app.include_router(ServerStat.router)
app.include_router(Storage.router)
app.include_router(Column.router)
app.include_router(Chart.router)
app.include_router(Encoding.router)
app.include_router(Transformation.router)
app.include_router(Imbalanced.router)
app.include_router(FeatureEngineer.router)
app.include_router(Pipeline.router)
app.include_router(DecisionTree.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_main():
    return {"msg": "Hello World"}
