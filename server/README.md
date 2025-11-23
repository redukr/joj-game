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
3. Configure environment (optional). Set allowed OAuth providers in `.env`:
   ```bash
   echo "ALLOWED_OAUTH_PROVIDERS=apple,google,guest" >> .env
   # Add extra origins for the web client if needed (defaults allow any localhost/127.x port)
   echo "ALLOWED_ORIGINS=http://localhost:8001,http://localhost:8002,http://localhost:4173" >> .env
   ```
   The server also permits any `http://localhost:<port>`, `https://localhost:<port>`, `http://127.0.0.1:<port>`, or
   `https://127.0.0.1:<port>` origin by default, so common dev setups (e.g., Vite on 5173/4173) work out of the box.
   Override `ALLOWED_ORIGIN_REGEX` if you need to tighten or broaden this rule.
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
- `POST /auth/login` — sign in with provider `apple`, `google`, or `guest` (default if omitted); returns bearer token for subsequent calls. Payload accepts both `display_name` and `displayName` keys for guest sign-up/login.
- `POST /admin/cards` — create a card (requires admin bearer token).
- `PUT /admin/cards/{id}` / `DELETE /admin/cards/{id}` — maintain cards.
- `POST /admin/decks` — create deck from existing cards (requires admin bearer token).
- `POST /rooms` — create a room using `Authorization: Bearer <token>` from `/auth/login`.
- `GET /rooms` — list all rooms.

## Notes
- Data now persists to SQLite (`./data/app.db`) via SQLModel; adjust `DATABASE_URL` to point to a different location. The
  repository no longer ships a prebuilt `app.db` file, so the first startup will create the database and seed cards from the
  JSON files in `../cards/`.
- On startup the database layer will recreate the file automatically if it encounters the previously malformed `deck` table
  definition, preventing the schema error seen in older seeded databases.
- Token validation for Apple/Google logins is stubbed; wire it to the real OAuth/OpenID Connect verification per provider when ready.
- Decks can be exported with `GET /admin/decks/{id}/export`; connect this to your renderer/export pipeline as needed.
