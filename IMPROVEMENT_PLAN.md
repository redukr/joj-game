# Comprehensive Change Proposal

This document consolidates all recommended changes discovered during the repository review.
It is organized by theme and maps each recommendation to the code paths that should be
updated or created.

## Backend (server)
- **Persistence and schema**
  - Replace the in-memory store with a database-backed repository (e.g., SQLite/PostgreSQL)
    to persist cards, decks, rooms, players, and tokens across restarts. Define ORM models
    and migrations.
  - Add JSON schemas and Pydantic models for cards/decks. Load card/deck data from
    `cards/` at startup and validate against the schemas.
  - Ensure room codes are unique and collision-resistant; add a uniqueness check or
    database constraint.
- **Security and authentication**
  - Implement real OAuth/OpenID flows for Apple/Google instead of accepting raw tokens.
    Verify ID tokens server-side, enforce TTL/refresh, and add token revocation and audit
    logging.
  - Replace the static admin token with a managed role/permission system; rotate secrets
    via environment variables or a secrets manager.
  - Add rate limiting and input validation on all routes; return clear error responses.
- **API design and features**
  - Add endpoints for exporting decks/cards (e.g., `/decks/{id}/export`) and for generating
    previews (image/HTML) of cards or templates.
  - Introduce pagination and filtering on list endpoints (rooms, cards, decks) to keep
    responses efficient at scale.
  - Normalize CORS configuration to a single source of truth and avoid hardcoded localhost
    duplicates.
- **Observability and robustness**
  - Add structured logging, metrics, and tracing around auth, admin, and room operations.
  - Implement error handling middleware to standardize responses.

## Web client (client-web)
- **Auth UX**
  - Persist bearer tokens in `localStorage` (with secure clearing) and add automatic
    handling of 401/403 responses, including optional refresh flows.
- **Deck/card UI features**
  - Add UI controls for exporting decks to JSON/CSV and for requesting preview renders
    from the server.
  - Improve room and deck management UX with pagination and search to match new server
    capabilities.

## Native clients (android/ios/macos/windows/unix)
- Mirror the web client changes: token persistence, error handling, and support for deck
  export/preview features using the new server endpoints.

## Build, packaging, and release
- Add packaging scripts (PyInstaller/Docker) and a reproducible build pipeline for the
  server; publish artifacts under `dist/`.
- Create CI workflows (lint, type check, test) for backend and clients to prevent
  regressions.

## Testing and quality
- Introduce unit/integration tests for auth flows, admin APIs, room lifecycle, card/deck
  CRUD, export, and preview rendering.
- Validate JSON schemas for cards/decks in tests to ensure data quality.

## Project structure and scalability
- Modularize the server into domain-layer services and repositories to keep handlers thin
  and testable.
- Document API contracts and data formats (OpenAPI/Swagger updates, README sections) to
  align backend and clients.

## Template/Deck rendering and previews
- Implement a renderer service (could be headless browser or templating engine) that turns
  card/deck definitions into preview assets. Expose this via dedicated endpoints and cache
  results when possible.

## PyInstaller and dist layout
- Add PyInstaller spec files or alternative packaging configuration to generate
  distributables for supported platforms. Ensure build output lands under `dist/` with
  clear structure and documentation.

## Migration plan (high level)
1. Define schemas and database models; add migrations and data loaders.
2. Implement secure auth and admin roles; wire logging and rate limiting.
3. Add export/preview endpoints and client UI to consume them.
4. Introduce pagination, filtering, and consistent CORS configuration.
5. Add tests and CI pipelines; integrate packaging (PyInstaller/Docker) and publish
   artifacts.
