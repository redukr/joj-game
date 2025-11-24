from fastapi import Depends, HTTPException, Request, status

from app.config import get_settings
from app.db import get_session
from app.repository import Repository
from app.models import Provider, Role, UserRead


def get_settings_dep():
    return get_settings()


def get_repository(session=Depends(get_session)) -> Repository:
    return Repository(session)


def _extract_user_id(request: Request) -> str:
    user_id = request.headers.get("X-User-Id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User ID is required")
    return user_id


def get_current_user(request: Request, repo: Repository = Depends(get_repository)) -> UserRead:
    user_id = _extract_user_id(request)
    user = repo.get_user(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unknown user")
    if user.role == Role.ADMIN and user.provider == Provider.GUEST:
        password = request.headers.get("X-User-Password")
        if not password or not repo.verify_guest_password(user_id, password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )
    return user


def get_active_user(current_user: UserRead = Depends(get_current_user)) -> UserRead:
    if current_user.role == Role.GUEST:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Guest accounts cannot access this resource",
        )
    return current_user


def get_admin_user(current_user: UserRead = Depends(get_current_user)) -> UserRead:
    if current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role is required",
        )
    return current_user


def get_optional_user(request: Request, repo: Repository = Depends(get_repository)) -> UserRead | None:
    user_id = request.headers.get("X-User-Id")
    if not user_id:
        return None
    return repo.get_user(user_id)
