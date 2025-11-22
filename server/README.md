# Server

Backend service for the game built with **FastAPI**. This layer will expose HTTP APIs for card data, game sessions, and administrative tools.

## Planned stack
- Python 3.11+
- FastAPI for the web framework
- Uvicorn for ASGI serving
- Pydantic for validation and settings
- PostgreSQL (or SQLite for local development)

## Getting started
1. Ensure Python 3.11+ is installed and create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Install core dependencies:
   ```bash
   pip install fastapi uvicorn[standard] pydantic[dotenv]
   ```
3. Start a local dev server (expects an `app/main.py` module):
   ```bash
   uvicorn app.main:app --reload
   ```
4. Add environment variables (e.g., database URL) to a `.env` file and load them via Pydantic settings.

## Next steps
- Scaffold initial FastAPI app structure under `app/` with routers for cards and sessions.
- Add tests with `pytest` and type checks with `mypy`.
- Containerize the service with Docker for consistent deployment.
