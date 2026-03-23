from fastapi import FastAPI
from .routers import user

app = FastAPI()

# This merges the routes into the main app
app.include_router(user.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}