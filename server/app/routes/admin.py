from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_store, require_admin
from app.models import Card, CardBase, Deck, DeckBase
from app.storage import InMemoryStore

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.post("/cards", response_model=Card)
def create_card(payload: CardBase, store: InMemoryStore = Depends(get_store)):
    return store.add_card(payload)


@router.get("/cards", response_model=list[Card])
def list_cards(store: InMemoryStore = Depends(get_store)):
    return list(store.cards.values())


@router.put("/cards/{card_id}", response_model=Card)
def update_card(card_id: int, payload: CardBase, store: InMemoryStore = Depends(get_store)):
    try:
        return store.update_card(card_id, payload)
    except KeyError:
        raise HTTPException(status_code=404, detail="Card not found")


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, store: InMemoryStore = Depends(get_store)):
    try:
        store.delete_card(card_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Card not found")


@router.post("/decks", response_model=Deck)
def create_deck(payload: DeckBase, store: InMemoryStore = Depends(get_store)):
    try:
        return store.add_deck(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/decks", response_model=list[Deck])
def list_decks(store: InMemoryStore = Depends(get_store)):
    return list(store.decks.values())


@router.put("/decks/{deck_id}", response_model=Deck)
def update_deck(deck_id: int, payload: DeckBase, store: InMemoryStore = Depends(get_store)):
    try:
        return store.update_deck(deck_id, payload)
    except KeyError:
        raise HTTPException(status_code=404, detail="Deck not found")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.delete("/decks/{deck_id}", status_code=204)
def delete_deck(deck_id: int, store: InMemoryStore = Depends(get_store)):
    try:
        store.delete_deck(deck_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Deck not found")
