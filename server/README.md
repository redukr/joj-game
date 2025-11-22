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
- Storage is in-memory for now; replace `InMemoryStore` with a database-backed repository for production.
- Token validation for Apple/Google logins is stubbed; wire it to the real OAuth/OpenID Connect verification per provider when ready.
- Card/deck management is structured so you can swap in logic from [CardGenerator](https://github.com/redukr/CardGenerator) by replacing the storage layer.
