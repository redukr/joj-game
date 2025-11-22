# Cards

Shared card data and related schemas that power all clients and the server.

## Purpose
- Store canonical JSON data for cards, decks, and related metadata.
- Provide a single source of truth for gameplay balancing and localization.
- Enable programmatic validation and migrations as the card set evolves.

## Getting started
1. Define a JSON schema for card objects (e.g., id, name, type, effects, costs, rarity).
2. Add initial card data under `cards/data/` as `*.json` files.
3. Create validation scripts (Python/Node) to ensure data integrity before committing changes.
4. Consider adding localization files (e.g., `cards/i18n/uk.json`, `cards/i18n/en.json`).

## Integration tips
- Server: load and cache card data at startup; expose read-only endpoints.
- Clients: fetch card data from the backend or bundle snapshots for offline play.
- Testing: include fixtures that mirror the live schema to keep clients and server in sync.
