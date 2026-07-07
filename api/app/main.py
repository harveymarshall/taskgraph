from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.tasks import router as tasks_router
from app.api.v1.routes.events import router as events_router
from app.core.db import create_db_and_tables

app = FastAPI(title="TaskGraph API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()


app.include_router(health_router, prefix="/api/v1")
app.include_router(tasks_router, prefix="/api/v1")
app.include_router(events_router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "TaskGraph API is running"}
