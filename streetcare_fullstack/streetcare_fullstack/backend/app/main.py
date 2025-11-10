from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routers import auth, animals, reports

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="StreetCare API", version="0.1.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(animals.router)
app.include_router(reports.router)

@app.get("/health")
def health():
    return {"ok": True}
