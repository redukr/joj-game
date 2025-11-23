from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import ValidationError

from app.config import get_settings
from app.dependencies import (
    get_bearer_token,
    get_current_user,
    get_repository,
    get_settings_dep,
)
from app.models import AuthResponse, LoginRequest, PasswordChangeRequest, Provider
from app.repository import Repository

router = APIRouter(prefix="/auth", tags=["auth"])


def _validate_login_payload(payload: LoginRequest, settings):
    if payload.provider.value not in settings.allowed_oauth_providers:
        raise HTTPException(status_code=400, detail="Unsupported provider")
    if payload.provider in {Provider.APPLE, Provider.GOOGLE} and not payload.token:
        raise HTTPException(status_code=400, detail="OAuth token is required for this provider")
    if payload.provider == Provider.GUEST:
        if not payload.display_name:
            raise HTTPException(status_code=400, detail="Guest login requires a display name")
        if not payload.password:
            raise HTTPException(status_code=400, detail="Guest login requires a password")


async def _parse_login_request(request: Request) -> LoginRequest:
    """Accept login payloads from JSON or form bodies and normalize errors."""

    content_type = request.headers.get("content-type", "")
    try:
        if content_type.startswith("application/json"):
            data = await request.json()
        else:
            form_data = await request.form()
            data = dict(form_data)
        return LoginRequest.parse_obj(data)
    except ValidationError as exc:
        raise HTTPException(status_code=400, detail={"errors": exc.errors()}) from exc


@router.post("/login", response_model=AuthResponse)
async def login(
    payload: LoginRequest = Depends(_parse_login_request),
    repo: Repository = Depends(get_repository),
    settings=Depends(get_settings_dep),
):
    _validate_login_payload(payload, settings)
    return repo.create_user(payload)


@router.post("/logout", status_code=204)
def logout(token: str = Depends(get_bearer_token), repo: Repository = Depends(get_repository)):
    repo.revoke_token(token)


@router.post("/password", response_model=AuthResponse)
def change_password(
    payload: PasswordChangeRequest,
    current_user=Depends(get_current_user),
    repo: Repository = Depends(get_repository),
):
    return repo.change_password(current_user.id, payload.current_password, payload.new_password)
