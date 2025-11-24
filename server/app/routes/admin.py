from fastapi import APIRouter, Depends

from app.config import get_settings
from app.dependencies import get_admin_user, get_repository
from app.models import CardRead, CardBase, DeckRead, DeckBase, DeckImport, RoomRead, UserRead
from app.repository import Repository, paginate

router = APIRouter(
    prefix="/admin", tags=["admin"], dependencies=[Depends(get_admin_user)]
)


@router.get("/verify")
def verify_admin():
    return {"status": "ok"}


@router.post("/cards", response_model=CardRead)
def create_card(payload: CardBase, repo: Repository = Depends(get_repository)):
    return repo.add_card(payload)


@router.get("/cards", response_model=list[CardRead])
def list_cards(limit: int | None = None, offset: int | None = None, repo: Repository = Depends(get_repository)):
    settings = get_settings()
    limit_value, offset_value = paginate(
        limit, offset, settings.default_page_size, settings.max_page_size
    )
    return repo.list_cards(limit_value, offset_value)


@router.put("/cards/{card_id}", response_model=CardRead)
def update_card(card_id: int, payload: CardBase, repo: Repository = Depends(get_repository)):
    return repo.update_card(card_id, payload)


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, repo: Repository = Depends(get_repository)):
    repo.delete_card(card_id)


@router.post("/decks", response_model=DeckRead)
def create_deck(payload: DeckBase, repo: Repository = Depends(get_repository)):
    return repo.add_deck(payload)


@router.get("/decks", response_model=list[DeckRead])
def list_decks(limit: int | None = None, offset: int | None = None, repo: Repository = Depends(get_repository)):
    settings = get_settings()
    limit_value, offset_value = paginate(
        limit, offset, settings.default_page_size, settings.max_page_size
    )
    return repo.list_decks(limit_value, offset_value)


@router.put("/decks/{deck_id}", response_model=DeckRead)
def update_deck(deck_id: int, payload: DeckBase, repo: Repository = Depends(get_repository)):
    return repo.update_deck(deck_id, payload)


@router.delete("/decks/{deck_id}", status_code=204)
def delete_deck(deck_id: int, repo: Repository = Depends(get_repository)):
    repo.delete_deck(deck_id)


@router.get("/decks/{deck_id}/export")
def export_deck(deck_id: int, repo: Repository = Depends(get_repository)):
    return repo.export_deck(deck_id)


@router.post("/decks/import", response_model=DeckRead)
def import_deck(payload: DeckImport, repo: Repository = Depends(get_repository)):
    return repo.import_deck(payload)


@router.post("/decks/{deck_id}/import", response_model=DeckRead)
def import_deck_into_existing(
    deck_id: int, payload: DeckImport, repo: Repository = Depends(get_repository)
):
    return repo.import_deck_into_existing(deck_id, payload)


@router.get("/users", response_model=list[UserRead])
def list_users(limit: int | None = None, offset: int | None = None, repo: Repository = Depends(get_repository)):
    settings = get_settings()
    limit_value, offset_value = paginate(
        limit, offset, settings.default_page_size, settings.max_page_size
    )
    return repo.list_users(limit_value, offset_value)


@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: str, repo: Repository = Depends(get_repository)):
    repo.delete_user(user_id)


@router.get("/rooms", response_model=list[RoomRead])
def list_all_rooms(
    limit: int | None = None,
    offset: int | None = None,
    status: str | None = None,
    sort: str | None = None,
    repo: Repository = Depends(get_repository),
):
    settings = get_settings()
    limit_value, offset_value = paginate(
        limit, offset, settings.default_page_size, settings.max_page_size
    )
    return repo.list_all_rooms(limit_value, offset_value, status, sort)


@router.delete("/rooms/{room_code}", status_code=204)
def delete_room(room_code: str, repo: Repository = Depends(get_repository)):
    repo.delete_room(room_code)
