# JOJ Game Web Client

Lightweight browser client for interacting with the FastAPI server. It lets you:

- Log in as a guest and grab an access token.
- Create rooms using your bearer token.
- List existing rooms.

## Running locally

Serve the static files with any HTTP server (Vite, nginx, or Python's built-in server). Keep this client on port 8001:

```bash
cd client-web
python -m http.server 8001
```

Then open http://localhost:8001 in your browser and set the API base URL to wherever your FastAPI server is running (default http://localhost:8000).

Looking for the admin tools? They now live in `../admin-web` and are typically served on port 8002.

> The FastAPI server now enables CORS for allowed origins. Any `http://localhost:<port>` or `http://127.0.0.1:<port>` origin is allowed by default, plus anything you list in `ALLOWED_ORIGINS` (comma-separated). Override `ALLOWED_ORIGIN_REGEX` in `.env` or `config/settings.yaml` if you need a different pattern.
