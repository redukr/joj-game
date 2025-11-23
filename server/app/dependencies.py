import logging
import time
from collections import deque, defaultdict
from typing import Deque

from fastapi import Depends, Header, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import get_settings
from app.db import get_session
from app.repository import Repository
from app.models import Role, UserRead


def get_settings_dep():
    return get_settings()


def get_repository(session=Depends(get_session)) -> Repository:
    return Repository(session)


def require_admin(
    x_admin_token: str | None = Header(None, alias="X-Admin-Token"),
    settings=Depends(get_settings_dep),
    current_user: UserRead | None = Depends(get_optional_user),
):
    if x_admin_token and x_admin_token == settings.admin_token:
        return
    if current_user and current_user.role == Role.ADMIN:
        return
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin access required")


_logger = logging.getLogger(__name__)
bearer_scheme = HTTPBearer(auto_error=True)
optional_bearer_scheme = HTTPBearer(auto_error=False)
_failed_attempts: defaultdict[str, Deque[float]] = defaultdict(deque)
ATTEMPT_WINDOW_SECONDS = 60
MAX_FAILED_ATTEMPTS = 10


def _rate_limit(client_id: str) -> None:
    now = time.time()
    attempts = _failed_attempts[client_id]
    while attempts and attempts[0] < now - ATTEMPT_WINDOW_SECONDS:
        attempts.popleft()
    if len(attempts) >= MAX_FAILED_ATTEMPTS:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many authentication attempts")


def _extract_token(request: Request, credentials: HTTPAuthorizationCredentials) -> str:
    client_id = request.client.host if request.client else "unknown"
    try:
        if credentials.scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Authorization scheme must be Bearer",
            )
        if not credentials.credentials:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Bearer token is empty"
            )
        return credentials.credentials
    except HTTPException as exc:  # pragma: no cover - defensive logging
        attempts = _failed_attempts[client_id]
        attempts.append(time.time())
        _logger.warning("Authentication failure from %s: %s", client_id, exc.detail)
        _rate_limit(client_id)
        raise


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    repo: Repository = Depends(get_repository),
):
    token = _extract_token(request, credentials)
    return repo.resolve_user(token)


def get_optional_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_bearer_scheme),
    repo: Repository = Depends(get_repository),
):
    if not credentials:
        return None
    token = _extract_token(request, credentials)
    return repo.resolve_user(token)
