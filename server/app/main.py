from fastapi import FastAPI

from app.routes import admin, auth, rooms

app = FastAPI(title="JOJ Game Server", version="0.1.0")

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(rooms.router)


@app.get("/health")
def healthcheck():
    return {"status": "ok"}
