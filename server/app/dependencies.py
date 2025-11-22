from fastapi import Depends, Header, HTTPException, status

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


def get_current_user(authorization: str = Header(..., alias="Authorization"), repo: Repository = Depends(get_repository)):
    try:
        scheme, token = authorization.split()
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Use Bearer token")
    return repo.resolve_user(token)
