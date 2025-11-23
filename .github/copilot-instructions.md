# AI Coding Instructions for JOJ Game

## Project Overview
**JOJ Game** ("Журнал Журналів" - Journal of Journals) is a satirical Ukrainian military simulation card game about leadership and bureaucratic management. The codebase spans a **Python FastAPI backend**, multiple **client frontends** (web, Windows, mobile), **card/deck data**, and **admin management tools**.

## Architecture Overview

### Multi-Component System
```
server/              → FastAPI backend (game logic, persistence, auth, deck/card management)
├── app/
│   ├── models.py    → SQLModel definitions (Card, User, Room, Deck, RoomMembership)
│   ├── repository.py → Data access & business logic (638 lines - substantial!)
│   ├── db.py        → SQLite persistence, schema management
│   ├── config.py    → Settings from env/YAML with validation
│   └── routes/      → Auth, cards, admin, rooms API endpoints
client-web/          → Lightweight static JS client (guest login, room creation)
client-windows/      → C# WPF app with OAuth plugins & password hashing
admin-web/           → Static JS admin console (card/deck CRUD, token-based auth)
cards/               → Canonical JSON data (sample decks, card definitions)
```

### Data Flow
1. **Auth**: `/auth/login` (provider: apple/google/guest) → Bearer token → all subsequent requests require `Authorization: Bearer <token>`
2. **Cards**: Loaded at startup from `../cards/*.json` → stored in SQLite → served via `/cards` (public) or `/admin/cards` (admin-only with `X-Admin-Token`)
3. **Rooms**: Players create rooms (`POST /rooms`) → invite others via code → join as player or spectator → room state persists in DB
4. **Decks**: Admins create/import decks (`POST /admin/decks/import`) from JSON with embedded cards; export with `GET /admin/decks/{id}/export`

### Key Data Models (sqlmodel)
- **Card**: name, description, category, resource effects (time, reputation, discipline, documents, technology)
- **Deck**: name, card_ids list, created_at timestamp
- **User**: id, display_name, provider (apple/google/guest), role (admin/user), password (guest only)
- **Room**: code, name, host_user_id, max_players, max_spectators, status (active/completed), visibility
- **RoomMembership**: tracks which users are in which rooms (player vs spectator)

## Critical Conventions & Patterns

### Authentication & Authorization
- **Guest login**: username + password hashing with bcrypt; see `PasswordHasher.cs` in Windows client
- **OAuth (Apple/Google)**: token validation stubbed in `auth.py` — **wire real verification per provider**
- **Admin token**: `X-Admin-Token` header required for `/admin/*` routes; default token is "redukr" (env: `ADMIN_TOKEN`)
- **Bearer tokens**: issued by `/auth/login`, validated in `get_current_user` dependency

### Card/Deck Schema & Validation
- **Resource fields** must be integers in range -10 to +10 (e.g., `reputation: -1` means lose 1 reputation point)
- **Category**: optional string grouping (e.g., "scandal", "success") — no enum enforced; treat as free-form tags
- **Deck import/export**: uses `DeckImport` schema with nested `deck` object + `cards` list; see `cards/sample-deck.json` for format
- **Card uniqueness**: enforced by (name, category) tuple in `Repository._ensure_card_unique()` — changing name requires checking duplicates

### Settings & Environment
- **Config sources** (in order): env vars → YAML file (`config/settings.yaml` or `SETTINGS_FILE` env var) → defaults
- **CORS**: auto-allows `http://localhost:*` + `http://127.0.0.1:*` in dev; in production requires explicit `ALLOWED_ORIGINS`
- **Database**: SQLite stored at `./data/app.db` (configurable via `DATABASE_URL`); schema auto-migrates on startup (see `db.py` migration helpers)

### Error Handling & Validation
- Use FastAPI `HTTPException(status_code=4xx, detail="...")` for client errors
- Pydantic validates all request payloads; 400 Bad Request returns validation errors
- Database errors (e.g., duplicate key) surface as 400; not-found queries raise 404

### API Endpoint Patterns
- **Pagination**: `limit`/`offset` params; defaults from `settings.default_page_size`/`settings.max_page_size`
- **Sorting**: room listing supports `sort` param (e.g., `"-created_at"` for descending)
- **Filtering**: rooms filter by `visibility` (public/private), `status` (active/completed)

## Developer Workflows

### Local Development Setup
```powershell
# Backend
cd server
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:ADMIN_TOKEN="dev-token"; $env:APP_ENV="development"
uvicorn app.main:app --reload

# Clients (in separate terminals)
cd client-web; python -m http.server 8001
cd ../admin-web; python -m http.server 8002

# All three run on localhost; FastAPI CORS allows them by default
```

### Build & Test Notes
- **No existing pytest suite visible** — create tests in `server/tests/` with fixtures for DB, auth
- **Windows client**: built with C# .NET; edit `.csproj` dependencies; build via Visual Studio or `dotnet build`
- **Card validation**: validate JSON structure against schema when loading from disk (see `loaders.py`)
- **Database migration**: on startup, `init_db()` runs schema creation and migration helpers (e.g., adding missing resource columns)

### Running the Server
```bash
# Production: set DATABASE_URL, ADMIN_TOKEN, ALLOWED_ORIGINS, APP_ENV=production
# Dev: defaults to localhost CORS, sqlite at ./data/app.db, admin token "redukr"
uvicorn app.main:app --host 0.0.0.0 --port 8000

# With custom settings file
SETTINGS_FILE=config/settings.local.yaml uvicorn app.main:app --reload
```

## Common Tasks & Decision Points

### Adding a New Card Field
1. Add column to `CardBase` model in `models.py` (with Field description & range)
2. Add migration in `db.py` if schema exists (see `_ensure_card_resource_columns()` pattern)
3. Update `cards/sample-deck.json` example
4. Validate in tests: range checks, null handling

### Creating a New API Endpoint
1. Add route to appropriate file in `server/app/routes/` (auth, cards, admin, rooms)
2. Use dependency injection: `repo: Repository = Depends(get_repository)`, `current_user: UserRead = Depends(get_current_user)`
3. For admin routes: include `dependencies=[Depends(require_admin)]` in `APIRouter()` declaration
4. Return Pydantic response model (e.g., `CardRead`, `RoomRead`) for serialization

### Modifying Card/Room Logic
1. **Repository layer** is the source of truth — all queries, validation, state changes live here
2. **Database transactions**: use `session.flush()` after writes to ensure consistency before returning
3. **Deck card removal**: when deleting a card, `Repository.delete_card()` removes it from all decks automatically

### Cross-Client Concerns
- **Web clients** (JS) fetch from FastAPI; no shared state — stateless requests
- **Windows client** uses `AuthService` to manage OAuth + guest auth; stores credentials locally
- **Admin web** and **client-web** are independent; both mount as static files in `main.py`

## Integration Points & External Dependencies

### Existing Integrations
- **OAuth**: Apple & Google issuer URLs in config; JWKS validation stubbed (TODO: real verification)
- **SQLModel/SQLAlchemy**: ORM for persistence; auto-create tables on first run
- **Passlib + bcrypt**: password hashing for guest accounts (not admin token)
- **python-jose**: JWT token handling for bearer auth

### Data Seeding
- Server loads cards from `../cards/` JSON files on startup (see `loaders.py`)
- No pre-built `app.db` shipped; auto-created with seeded data on first run
- Deck import accepts JSON with embedded card definitions (useful for testing)

## Code Quality & Testing Notes
- **Repository pattern**: centralize all DB access; makes testing easier with mock sessions
- **Dependency injection**: FastAPI's Depends() enables easy testing without modifying routes
- **Settings validation**: Pydantic ensures env vars are coerced to correct types; fails fast on startup if invalid
- **Type hints**: extensive use of Pydantic models and Optional[] — leverage these in code generation

## Files to Reference for Patterns
- `server/app/repository.py` — comprehensive example of card/room/deck/user CRUD + validation
- `server/app/routes/admin.py` — admin-only endpoint pattern with token verification
- `server/app/models.py` — data model definitions (base, read, create schemas)
- `server/app/db.py` — schema migration pattern (handling breaking changes without recreating tables)
- `cards/sample-deck.json` — canonical deck import/export format
