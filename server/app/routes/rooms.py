from fastapi import APIRouter, Depends

from app.dependencies import get_current_user, get_store
from app.models import Room, RoomCreate, User
from app.storage import InMemoryStore

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("", response_model=Room)
def create_room(
    payload: RoomCreate,
    current_user: User = Depends(get_current_user),
    store: InMemoryStore = Depends(get_store),
):
    return store.create_room(payload, host_user_id=current_user.id)


@router.get("", response_model=list[Room])
def list_rooms(store: InMemoryStore = Depends(get_store)):
    return list(store.rooms.values())
