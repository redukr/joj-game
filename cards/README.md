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
5. Use `cards/sample-deck.json` as a template for the `/admin/decks/import` endpoint.

### Card fields
| Field | Type | Range/Limit | Notes |
| --- | --- | --- | --- |
| `name` | string | ≤ 128 chars | Card name, must be unique per category. |
| `description` | string | ≤ 512 chars | What the card represents. |
| `category` | string or null | ≤ 64 chars | Optional grouping (e.g., `scandal`, `success`). |
| `time` | integer | -10..10 | Effect on time resource. |
| `reputation` | integer | -10..10 | Effect on reputation resource. |
| `discipline` | integer | -10..10 | Effect on discipline resource. |
| `documents` | integer | -10..10 | Effect on documents resource. |
| `technology` | integer | -10..10 | Effect on technology resource. |

Deck payloads for import/export follow the server `DeckImport` schema:

```json
{
  "deck": { "name": "Starter deck", "description": "Optional text", "card_ids": [1, 2] },
  "cards": [
    { "name": "Example", "description": "...", "category": "tag", "time": 1, "reputation": 0, "discipline": 0, "documents": 0, "technology": 0 }
  ]
}
```

## Integration tips
- Server: load and cache card data at startup; expose read-only endpoints.
- Clients: fetch card data from the backend or bundle snapshots for offline play.
- Testing: include fixtures that mirror the live schema to keep clients and server in sync.
