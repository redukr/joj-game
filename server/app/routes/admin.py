from fastapi import APIRouter, Depends

from app.config import get_settings
from app.dependencies import get_repository, require_admin
from app.models import CardRead, CardBase, DeckRead, DeckBase, DeckImport
from app.repository import Repository, paginate

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


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
