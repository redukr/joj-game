from fastapi import Depends, Header, HTTPException, status

from app.config import get_settings
from app.storage import store


def get_store():
    return store


def get_settings_dep():
    return get_settings()


def require_admin(
    x_admin_token: str = Header(..., alias="X-Admin-Token"), settings=Depends(get_settings_dep)
):
    if x_admin_token != settings.admin_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin token")


def get_current_user(authorization: str = Header(..., alias="Authorization")):
    try:
        scheme, token = authorization.split()
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Use Bearer token")
    try:
        return store.resolve_user(token)
    except KeyError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
