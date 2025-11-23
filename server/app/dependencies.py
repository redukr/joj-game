from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import get_settings
from app.db import get_session
from app.repository import Repository


def get_settings_dep():
    return get_settings()


def get_repository(session=Depends(get_session)) -> Repository:
    return Repository(session)


def require_admin(
    x_admin_token: str = Header(..., alias="X-Admin-Token"), settings=Depends(get_settings_dep)
):
    if x_admin_token != settings.admin_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin token")


bearer_scheme = HTTPBearer(auto_error=False)


def _extract_token(credentials: HTTPAuthorizationCredentials | None) -> str:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Authorization scheme must be Bearer")
    if not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bearer token is empty")
    return credentials.credentials


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), repo: Repository = Depends(get_repository)):
    token = _extract_token(credentials)
    return repo.resolve_user(token)


def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    repo: Repository = Depends(get_repository),
):
    if not credentials:
        return None
    token = _extract_token(credentials)
    return repo.resolve_user(token)
