from fastapi import FastAPI
from .api import user, feature_selection, imbalanced, reducedimension, feature_engineering, encoding, transformation, pipeline

app = FastAPI()

# Include routers
app.include_router(user.router)
app.include_router(feature_selection.router)
app.include_router(imbalanced.router)
app.include_router(reducedimension.router)
app.include_router(feature_engineering.router)
app.include_router(encoding.router)
app.include_router(transformation.router)
app.include_router(pipeline.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}