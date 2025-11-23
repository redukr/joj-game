from fastapi import APIRouter, Depends

from app.config import get_settings
from app.dependencies import get_current_user, get_optional_user, get_repository
from app.models import RoomRead, RoomCreate, UserRead, RoomJoin
from app.repository import Repository, paginate

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("", response_model=RoomRead)
def create_room(
    payload: RoomCreate,
    current_user: UserRead = Depends(get_current_user),
    repo: Repository = Depends(get_repository),
):
    return repo.create_room(payload, host_user_id=current_user.id)


@router.get("", response_model=list[RoomRead])
def list_rooms(
    limit: int | None = None,
    offset: int | None = None,
    repo: Repository = Depends(get_repository),
    current_user: UserRead | None = Depends(get_optional_user),
):
    settings = get_settings()
    limit_value, offset_value = paginate(limit, offset, settings.default_page_size)
    user_id = current_user.id if current_user else None
    return repo.list_rooms(limit_value, offset_value, user_id)


@router.post("/{code}/join", response_model=RoomRead)
def join_room(
    code: str,
    payload: RoomJoin,
    current_user: UserRead = Depends(get_current_user),
    repo: Repository = Depends(get_repository),
):
    return repo.join_room(code, current_user.id, payload.as_spectator)
