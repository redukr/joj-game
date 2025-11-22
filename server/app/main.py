import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from pathlib import Path

from app.db import init_db, session_scope
from app.loaders import load_cards_from_disk
from app.models import Card
from app.routes import admin, auth, cards, rooms

settings = get_settings()

app = FastAPI(title="JOJ Game Server", version="0.1.0")

allowed_origins = settings.allowed_origins

client_web_dir = Path(__file__).resolve().parents[2] / "client-web"
client_web_available = client_web_dir.is_dir()

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if client_web_available:
    app.mount(
        "/client-web",
        StaticFiles(directory=client_web_dir, html=True),
        name="client-web",
    )
else:
    logging.getLogger(__name__).warning(
        "Client web directory %s not found; skipping static mount", client_web_dir
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
        "web_client_url": "/client-web/" if client_web_available else None,
    }


@app.get("/index.html")
def client_index():
    """Redirect legacy index path to the mounted client web app."""

    index_path = client_web_dir / "index.html"
    if index_path.exists():
        return RedirectResponse(url="/client-web/index.html")
    return JSONResponse(
        status_code=404,
        content={"detail": "Client web bundle not found"},
    )


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
