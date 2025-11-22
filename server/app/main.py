from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from pathlib import Path

from app.db import init_db, session_scope
from app.loaders import load_cards_from_disk
from app.models import Card
from app.routes import admin, auth, cards, rooms

settings = get_settings()

app = FastAPI(title="JOJ Game Server", version="0.1.0")

allowed_origins = settings.allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(cards.router)
app.include_router(admin.router)
app.include_router(rooms.router)


@app.get("/", response_class=JSONResponse)
def root():
    """Provide a friendly root response instead of FastAPI's default 404."""

    return {
        "message": "JOJ Game server is running",
        "docs_url": "/docs",
        "openapi_url": "/openapi.json",
    }


@app.on_event("startup")
def _startup():
    init_db()
    cards_dir = Path(__file__).resolve().parents[2] / "cards"
    with session_scope() as session:
        has_cards = session.query(Card).first() is not None
        if not has_cards:
            load_cards_from_disk(session, cards_dir)


@app.get("/health")
def healthcheck():
    return {"status": "ok"}
