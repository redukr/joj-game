# Project architecture

High-level map of the JOJ Game codebase with notes on the purpose of each area and how pieces fit together.

## Server (FastAPI backend)
- `server/app/main.py` – FastAPI application entrypoint: mounts static web bundles, wires CORS, registers routers, seeds cards/admin on startup, and exposes a simple health/root API.
- `server/app/config.py` – Settings loader for environment-driven configuration (origins, tokens, etc.).
- `server/app/db.py` – SQLAlchemy engine/session setup and scoped session context manager.
- `server/app/models.py` – Pydantic and ORM models for users, rooms, and cards plus auth payload schemas.
- `server/app/repository.py` – Data access layer wrapping CRUD for users, tokens, rooms, and cards.
- `server/app/loaders.py` – Utilities to ingest card JSON files from `cards/` into the database on startup.
- `server/app/dependencies.py` – FastAPI dependency helpers for auth (bearer token parsing, current user) and repository wiring.
- `server/app/routes/` – API routers split by domain:
  - `auth.py` handles login/logout/password flows with provider validation.
  - `admin.py` guards admin-only actions (token verification, role changes, deck management).
  - `rooms.py` manages lobby/room creation and joining.
  - `cards.py` exposes card retrieval and deck upload endpoints.
- `server/app/test_*.py` – Unit and integration tests for models plus admin/auth/room/card flows.
- `server/config/` – Deployment defaults (uvicorn, env examples) for the backend service.

## Web clients
- `client-web/` – Static HTML/CSS/JS bundle for players: login/join room UI, game interactions, and accessibility tweaks.
- `admin-web/` – Static admin console: token verification, user management, deck import/export, and admin toasts/focus styles.

## Native/desktop clients
- `client-android/`, `client-ios/`, `client-macos/`, `client-unix/`, `client-windows/` – Platform-specific client stubs/documentation for building native shells or wrappers around the game services.

## Game data
- `cards/` – Source decks and sample card definitions used by the server loader and client previews.

## Documentation & tooling
- `README.md` – Game overview, rules, and quickstart for running the FastAPI server.
- `manual.txt` – Additional manual/reference notes for gameplay or operations.
- `strat-server.bat` – Helper script for starting the server on Windows environments.
