from fastapi import APIRouter, Depends, HTTPException

from app.config import get_settings
from app.models import AuthResponse, LoginRequest, Provider
from app.storage import InMemoryStore
from app.dependencies import get_store, get_settings_dep

router = APIRouter(prefix="/auth", tags=["auth"])


def _validate_login_payload(payload: LoginRequest, settings):
    if payload.provider.value not in settings.allowed_oauth_providers:
        raise HTTPException(status_code=400, detail="Unsupported provider")
    if payload.provider in {Provider.APPLE, Provider.GOOGLE} and not payload.token:
        raise HTTPException(status_code=400, detail="OAuth token is required for this provider")
    if payload.provider == Provider.GUEST and not payload.display_name:
        raise HTTPException(status_code=400, detail="Guest login requires a display name")


@router.post("/login", response_model=AuthResponse)
def login(
    payload: LoginRequest,
    store: InMemoryStore = Depends(get_store),
    settings=Depends(get_settings_dep),
):
    _validate_login_payload(payload, settings)
    display_name = payload.display_name or payload.provider.value.title()
    user, token = store.create_user(payload.provider, display_name=display_name)
    return AuthResponse(access_token=token, user=user)
