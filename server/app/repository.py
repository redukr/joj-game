import secrets
import secrets
from typing import List, Optional, Tuple

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models import (
    AuthResponse,
    Card,
    CardBase,
    CardRead,
    Deck,
    DeckBase,
    DeckRead,
    LoginRequest,
    Provider,
    Room,
    RoomCreate,
    RoomRead,
    Token,
    User,
    UserRead,
)


class Repository:
    def __init__(self, session: Session):
        self.session = session

    # Card helpers
    def add_card(self, payload: CardBase) -> CardRead:
        card = Card.from_orm(payload)
        self.session.add(card)
        self.session.flush()
        self.session.refresh(card)
        return CardRead.from_orm(card)

    def update_card(self, card_id: int, payload: CardBase) -> CardRead:
        card = self.session.get(Card, card_id)
        if not card:
            raise HTTPException(status_code=404, detail="Card not found")
        for field, value in payload.dict().items():
            setattr(card, field, value)
        self.session.add(card)
        self.session.flush()
        return CardRead.from_orm(card)

    def delete_card(self, card_id: int) -> None:
        card = self.session.get(Card, card_id)
        if not card:
            raise HTTPException(status_code=404, detail="Card not found")
        self.session.delete(card)
        self.session.flush()
        # Remove card id from decks
        decks = self.session.exec(select(Deck).where(Deck.card_ids.contains([card_id]))).all()
        for deck in decks:
            deck.card_ids = [c for c in deck.card_ids if c != card_id]
            self.session.add(deck)

    def list_cards(self, limit: int, offset: int) -> List[CardRead]:
        cards = self.session.exec(select(Card).offset(offset).limit(limit)).all()
        return [CardRead.from_orm(card) for card in cards]

    # Deck helpers
    def _validate_cards_exist(self, card_ids: List[int]) -> None:
        if not card_ids:
            return
        found_ids = set(
            cid for (cid,) in self.session.exec(select(Card.id).where(Card.id.in_(card_ids))).all()
        )
        missing = [cid for cid in card_ids if cid not in found_ids]
        if missing:
            raise HTTPException(status_code=400, detail=f"Cards do not exist: {missing}")

    def add_deck(self, payload: DeckBase) -> DeckRead:
        self._validate_cards_exist(payload.card_ids)
        deck = Deck.from_orm(payload)
        self.session.add(deck)
        self.session.flush()
        self.session.refresh(deck)
        return DeckRead.from_orm(deck)

    def update_deck(self, deck_id: int, payload: DeckBase) -> DeckRead:
        deck = self.session.get(Deck, deck_id)
        if not deck:
            raise HTTPException(status_code=404, detail="Deck not found")
        self._validate_cards_exist(payload.card_ids)
        for field, value in payload.dict().items():
            setattr(deck, field, value)
        self.session.add(deck)
        self.session.flush()
        return DeckRead.from_orm(deck)

    def delete_deck(self, deck_id: int) -> None:
        deck = self.session.get(Deck, deck_id)
        if not deck:
            raise HTTPException(status_code=404, detail="Deck not found")
        self.session.delete(deck)
        self.session.flush()

    def list_decks(self, limit: int, offset: int) -> List[DeckRead]:
        decks = self.session.exec(select(Deck).offset(offset).limit(limit)).all()
        return [DeckRead.from_orm(deck) for deck in decks]

    def export_deck(self, deck_id: int) -> dict:
        deck = self.session.get(Deck, deck_id)
        if not deck:
            raise HTTPException(status_code=404, detail="Deck not found")
        cards = []
        if deck.card_ids:
            cards = self.session.exec(select(Card).where(Card.id.in_(deck.card_ids))).all()
        return {
            "deck": DeckRead.from_orm(deck),
            "cards": [CardRead.from_orm(card) for card in cards],
        }

    # Auth helpers
    def _generate_user(self, provider: Provider, display_name: str) -> User:
        user_id = secrets.token_urlsafe(8)
        user = User(id=user_id, provider=provider, display_name=display_name)
        self.session.add(user)
        self.session.flush()
        return user

    def _issue_token(self, user_id: str) -> str:
        token_value = secrets.token_urlsafe(32)
        token = Token(token=token_value, user_id=user_id)
        self.session.add(token)
        self.session.flush()
        return token_value

    def create_user(self, payload: LoginRequest) -> AuthResponse:
        display_name = payload.display_name or payload.provider.value.title()
        user = self._generate_user(payload.provider, display_name)
        token = self._issue_token(user.id)
        return AuthResponse(access_token=token, user=UserRead.from_orm(user))

    def resolve_user(self, token: str) -> UserRead:
        token_row = self.session.get(Token, token)
        if not token_row:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = self.session.get(User, token_row.user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token owner")
        return UserRead.from_orm(user)

    # Room helpers
    def _generate_unique_code(self) -> str:
        while True:
            code = secrets.token_hex(3)
            existing = self.session.get(Room, code)
            if not existing:
                return code

    def create_room(self, payload: RoomCreate, host_user_id: str) -> RoomRead:
        code = self._generate_unique_code()
        room = Room(
            code=code,
            name=payload.name,
            host_user_id=host_user_id,
            max_players=payload.max_players,
            visibility=payload.visibility,
        )
        self.session.add(room)
        self.session.flush()
        return RoomRead.from_orm(room)

    def list_rooms(self, limit: int, offset: int) -> List[RoomRead]:
        rooms = self.session.exec(select(Room).offset(offset).limit(limit)).all()
        return [RoomRead.from_orm(room) for room in rooms]


def paginate(limit: Optional[int], offset: Optional[int], default_limit: int) -> Tuple[int, int]:
    limit_value = limit or default_limit
    limit_value = max(1, min(limit_value, default_limit))
    offset_value = max(0, offset or 0)
    return limit_value, offset_value
