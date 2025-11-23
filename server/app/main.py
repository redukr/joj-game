import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from app.config import get_settings

from app.db import init_db, session_scope
from app.loaders import load_cards_from_disk
from app.models import Card
from app.routes import admin, auth, cards, rooms

logger = logging.getLogger(__name__)
settings = get_settings()

app = FastAPI(title="JOJ Game Server", version="0.1.0")

def _resolve_cors_settings():
    """Return sanitized CORS configuration based on environment."""

    origins = settings.allowed_origins or []
    origin_regex = settings.allowed_origin_regex if settings.environment != "production" else None

    if settings.environment == "production":
        if not origins:
            raise ValueError("ALLOWED_ORIGINS must be configured for production")
    else:
        if not origins:
            origins = [
                "http://localhost:8001",
                "http://127.0.0.1:8001",
                "http://localhost:8002",
                "http://127.0.0.1:8002",
            ]

    return origins, origin_regex

client_web_dir = Path(__file__).resolve().parents[2] / "client-web"
admin_web_dir = Path(__file__).resolve().parents[2] / "admin-web"

allowed_origins, allowed_origin_regex = _resolve_cors_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/client-web",
    StaticFiles(directory=client_web_dir, html=True),
    name="client-web",
)
app.mount(
    "/admin-web",
    StaticFiles(directory=admin_web_dir, html=True),
    name="admin-web",
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
        "web_client_url": "/client-web/",
        "admin_web_url": "/admin-web/",
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


@app.get("/admin.html")
def admin_index():
    """Redirect legacy admin path to the mounted admin web app."""

    index_path = admin_web_dir / "admin.html"
    if index_path.exists():
        return RedirectResponse(url="/admin-web/admin.html")
    return JSONResponse(
        status_code=404,
        content={"detail": "Admin web bundle not found"},
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
