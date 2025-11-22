import secrets
from datetime import datetime
from typing import Dict, List

from app.models import Card, CardBase, Deck, DeckBase, Provider, Room, RoomCreate, User


class InMemoryStore:
    def __init__(self) -> None:
        self._card_id = 0
        self._deck_id = 0
        self.cards: Dict[int, Card] = {}
        self.decks: Dict[int, Deck] = {}
        self.users: Dict[str, User] = {}
        self.tokens: Dict[str, str] = {}  # token -> user id
        self.rooms: Dict[str, Room] = {}  # code -> room

    # Card helpers
    def add_card(self, payload: CardBase) -> Card:
        self._card_id += 1
        card = Card(id=self._card_id, **payload.dict())
        self.cards[card.id] = card
        return card

    def update_card(self, card_id: int, payload: CardBase) -> Card:
        if card_id not in self.cards:
            raise KeyError("Card not found")
        card = Card(id=card_id, **payload.dict())
        self.cards[card_id] = card
        return card

    def delete_card(self, card_id: int) -> None:
        if card_id not in self.cards:
            raise KeyError("Card not found")
        del self.cards[card_id]
        # Remove from any deck that referenced it
        for deck in self.decks.values():
            if card_id in deck.card_ids:
                deck.card_ids = [c for c in deck.card_ids if c != card_id]

    # Deck helpers
    def add_deck(self, payload: DeckBase) -> Deck:
        self._deck_id += 1
        self._validate_cards_exist(payload.card_ids)
        deck = Deck(id=self._deck_id, **payload.dict())
        self.decks[deck.id] = deck
        return deck

    def update_deck(self, deck_id: int, payload: DeckBase) -> Deck:
        if deck_id not in self.decks:
            raise KeyError("Deck not found")
        self._validate_cards_exist(payload.card_ids)
        deck = Deck(id=deck_id, **payload.dict())
        self.decks[deck_id] = deck
        return deck

    def delete_deck(self, deck_id: int) -> None:
        if deck_id not in self.decks:
            raise KeyError("Deck not found")
        del self.decks[deck_id]

    def _validate_cards_exist(self, card_ids: List[int]) -> None:
        missing = [cid for cid in card_ids if cid not in self.cards]
        if missing:
            raise ValueError(f"Cards do not exist: {missing}")

    # Auth helpers
    def create_user(self, provider: Provider, display_name: str) -> User:
        user_id = secrets.token_urlsafe(8)
        user = User(id=user_id, provider=provider, display_name=display_name)
        self.users[user.id] = user
        token = secrets.token_urlsafe(32)
        self.tokens[token] = user.id
        return user, token

    def resolve_user(self, token: str) -> User:
        user_id = self.tokens.get(token)
        if not user_id:
            raise KeyError("Invalid token")
        return self.users[user_id]

    # Room helpers
    def create_room(self, payload: RoomCreate, host_user_id: str) -> Room:
        code = secrets.token_hex(3)
        room = Room(
            code=code,
            name=payload.name,
            host_user_id=host_user_id,
            max_players=payload.max_players,
            visibility=payload.visibility,
            created_at=datetime.utcnow(),
        )
        self.rooms[code] = room
        return room


store = InMemoryStore()
