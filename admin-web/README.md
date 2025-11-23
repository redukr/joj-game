# JOJ Game Admin Console

Administrative pages for managing cards, decks, and system status. Served separately from the player client.

## Running locally

Run a lightweight HTTP server from this directory on port 8002:

```bash
cd admin-web
python -m http.server 8002
```

Open http://localhost:8002 in your browser. Point the API base URL fields to wherever your FastAPI server is running (default http://localhost:8000). The FastAPI server accepts requests from this origin by default.

For the player experience, run the sibling `client-web` on port 8001.
