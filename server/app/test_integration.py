import asyncio
import importlib
import pytest

httpx = pytest.importorskip("httpx", reason="httpx is required for HTTP clients")


class SyncASGITransport(httpx.ASGITransport):
    def handle_request(self, request):  # type: ignore[override]
        async_response = asyncio.run(self.handle_async_request(request))
        content = asyncio.run(async_response.aread())
        return httpx.Response(
            status_code=async_response.status_code,
            headers=async_response.headers,
            content=content,
            request=request,
            extensions=async_response.extensions,
        )


@pytest.fixture()
def client(tmp_path, monkeypatch):
    db_path = tmp_path / "integration.db"
    monkeypatch.setenv("DATABASE_URL", str(db_path))
    monkeypatch.setenv("APP_ENV", "development")

    for module_name in ["app.config", "app.db", "app.main"]:
        if module_name in list(importlib.sys.modules):
            importlib.reload(importlib.import_module(module_name))
    config = importlib.reload(importlib.import_module("app.config"))
    importlib.reload(importlib.import_module("app.db"))
    main = importlib.reload(importlib.import_module("app.main"))
    importlib.reload(importlib.import_module("app.repository"))

    main._startup()
    transport = SyncASGITransport(app=main.app)
    return httpx.Client(transport=transport, base_url="http://testserver")


@pytest.fixture()
def admin_credentials(client):
    login_payload = {
        "provider": "guest",
        "display_name": "admin",
        "password": "admin!",
    }
    response = client.post("/auth/login", json=login_payload)
    assert response.status_code == 200
    admin_user = response.json()
    return {"id": admin_user["id"], "password": login_payload["password"]}


@pytest.fixture()
def admin_headers(admin_credentials):
    return {
        "X-User-Id": admin_credentials["id"],
        "X-User-Password": admin_credentials["password"],
    }


def test_guest_room_flow_and_admin_exports(client, admin_headers):
    login_payload = {
        "provider": "guest",
        "display_name": "IntegrationUser",
        "password": "hunter2",
    }
    login_response = client.post("/auth/login", json=login_payload)
    assert login_response.status_code == 200
    guest = login_response.json()
    assert guest["role"] == "guest"
    guest_headers = {"X-User-Id": guest["id"]}

    room_payload = {"name": "Ops Room", "max_players": 2, "max_spectators": 1}
    create_room = client.post("/rooms", json=room_payload, headers=guest_headers)
    assert create_room.status_code == 403

    list_rooms = client.get("/rooms", headers=guest_headers)
    assert list_rooms.status_code == 403

    # Seed a non-guest user directly for gameplay flows
    from app.db import session_scope
    from app.models import Provider, Role, User

    with session_scope() as session:
        player = User(
            id="active-user",
            provider=Provider.GOOGLE,
            role=Role.USER,
            display_name="ActiveUser",
            password_hash=None,
        )
        session.add(player)

    headers = {"X-User-Id": "active-user"}

    create_room = client.post("/rooms", json=room_payload, headers=headers)
    assert create_room.status_code == 200
    room_code = create_room.json()["code"]

    join_room = client.post(
        f"/rooms/{room_code}/join", json={"as_spectator": False}, headers=headers
    )
    assert join_room.status_code == 200
    assert join_room.json()["is_joined"]

    card_payload = {
        "name": "Integration Card",
        "description": "Moves the flow along",
        "time": 1,
        "reputation": 0,
        "discipline": 0,
        "documents": 0,
        "technology": 0,
    }
    card_response = client.post("/admin/cards", json=card_payload, headers=admin_headers)
    assert card_response.status_code == 200
    card_id = card_response.json()["id"]

    deck_payload = {
        "name": "Integration Deck",
        "description": "",
        "card_ids": [card_id],
    }
    deck_response = client.post("/admin/decks", json=deck_payload, headers=admin_headers)
    assert deck_response.status_code == 200
    deck_id = deck_response.json()["id"]

    export_response = client.get(f"/admin/decks/{deck_id}/export", headers=admin_headers)
    assert export_response.status_code == 200
    exported = export_response.json()
    assert exported["deck"]["name"] == deck_payload["name"]
    assert exported["deck"]["card_ids"] == [card_id]
    assert exported["cards"][0]["id"] == card_id


def test_admin_card_validation(client, admin_headers):
    bad_payload = {
        "name": "Bad Bounds",
        "description": "Should fail",
        "time": 20,
        "reputation": 0,
        "discipline": 0,
        "documents": 0,
        "technology": 0,
    }

    response = client.post("/admin/cards", json=bad_payload, headers=admin_headers)

    assert response.status_code == 422
    assert "ensure this value is less than or equal to 10" in response.text


def test_admin_token_verification_endpoint(client, admin_headers):
    response = client.get("/admin/verify", headers=admin_headers)

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_admin_requires_password(client, admin_credentials):
    response = client.get("/admin/verify", headers={"X-User-Id": admin_credentials["id"]})

    assert response.status_code == 401
    assert "Invalid credentials" in response.text
