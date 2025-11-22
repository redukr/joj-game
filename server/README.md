# Server

Backend service for the game built with **FastAPI**. This layer exposes HTTP APIs for card data, game sessions, and administrative tools.

## Stack
- Python 3.11+
- FastAPI for the web framework
- Uvicorn for ASGI serving
- Pydantic for validation and settings

## Getting started
1. Ensure Python 3.11+ is installed and create a virtual environment:
   ```bash
   cd server
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Install core dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment (optional). Set an admin token and allowed OAuth providers in `.env`:
   ```bash
   echo "ADMIN_TOKEN=supersecret" > .env
   echo "ALLOWED_OAUTH_PROVIDERS=apple,google,guest" >> .env
   # Add extra origins for the web client if needed (defaults allow any localhost/127.x port)
   echo "ALLOWED_ORIGINS=http://localhost:8001,http://localhost:4173" >> .env
   ```
   The server also permits any `http://localhost:<port>` or `http://127.0.0.1:<port>` origin by default, so common dev setups
   (e.g., Vite on 5173/4173) work out of the box. Override `ALLOWED_ORIGIN_REGEX` if you need to tighten or broaden this rule.
   You can also copy `config/settings.yaml` and tweak it for local overrides. To load a custom file, point
   `SETTINGS_FILE` at its path:
   ```bash
   cp config/settings.yaml config/settings.local.yaml
   SETTINGS_FILE=config/settings.local.yaml uvicorn app.main:app --reload
   ```
4. Start a local dev server:
   ```bash
   uvicorn app.main:app --reload
   ```

## API surface
- `POST /auth/login` — sign in with provider `apple`, `google`, or `guest`; returns bearer token for subsequent calls.
- `POST /admin/cards` — create a card (requires `X-Admin-Token` header).
- `PUT /admin/cards/{id}` / `DELETE /admin/cards/{id}` — maintain cards.
- `POST /admin/decks` — create deck from existing cards (requires `X-Admin-Token`).
- `POST /rooms` — create a room using `Authorization: Bearer <token>` from `/auth/login`.
- `GET /rooms` — list all rooms.

## Notes
- Data now persists to SQLite (`./data/app.db`) via SQLModel; adjust `DATABASE_URL` to point to a different location.
- Token validation for Apple/Google logins is stubbed; wire it to the real OAuth/OpenID Connect verification per provider when ready.
- Decks can be exported with `GET /admin/decks/{id}/export` (admin token required); connect this to your renderer/export pipeline as needed.
