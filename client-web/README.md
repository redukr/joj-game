# JOJ Game Web Client

Lightweight browser client for interacting with the FastAPI server. It lets you:

- Log in as a guest and grab an access token.
- Create rooms using your bearer token.
- List existing rooms.

## Running locally

Serve the static files with any HTTP server (Vite, nginx, or Python's built-in server):

```bash
cd client-web
python -m http.server 8001
```

Then open http://localhost:8001 in your browser and set the API base URL to wherever your FastAPI server is running (default http://localhost:8000).
