import hashlib
import secrets
from typing import List, Optional, Tuple

from fastapi import HTTPException, status
from sqlalchemy import func
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
    RoomMembership,
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
    def _hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()

    def _generate_user(
        self, provider: Provider, display_name: str, password_hash: str | None
    ) -> User:
        user_id = secrets.token_urlsafe(8)
        user = User(
            id=user_id,
            provider=provider,
            display_name=display_name,
            password_hash=password_hash,
        )
        self.session.add(user)
        self.session.flush()
        return user

    def _get_user_by_display_name(
        self, provider: Provider, display_name: str
    ) -> User | None:
        statement = select(User).where(
            User.provider == provider, User.display_name == display_name
        )
        return self.session.exec(statement).first()

    def _issue_token(self, user_id: str) -> str:
        token_value = secrets.token_urlsafe(32)
        token = Token(token=token_value, user_id=user_id)
        self.session.add(token)
        self.session.flush()
        return token_value

    def create_user(self, payload: LoginRequest) -> AuthResponse:
        display_name = payload.display_name or payload.provider.value.title()
        password_hash = None
        if payload.password:
            password_hash = self._hash_password(payload.password)

        existing_user = None
        if payload.provider == Provider.GUEST and payload.display_name:
            existing_user = self._get_user_by_display_name(
                payload.provider, payload.display_name
            )

        if existing_user:
            if existing_user.password_hash and existing_user.password_hash != password_hash:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect password for existing user",
                )
            if not existing_user.password_hash:
                existing_user.password_hash = password_hash
                self.session.add(existing_user)
                self.session.flush()
            user = existing_user
        else:
            user = self._generate_user(payload.provider, display_name, password_hash)
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

    def _membership_counts(self, room_code: str) -> tuple[int, int]:
        counts = self.session.exec(
            select(RoomMembership.role, func.count())
            .where(RoomMembership.room_code == room_code)
            .group_by(RoomMembership.role)
        ).all()
        player_count = 0
        spectator_count = 0
        for role, amount in counts:
            if role == "spectator":
                spectator_count = amount
            else:
                player_count = amount
        return player_count, spectator_count

    def _ensure_host_membership(self, room: Room) -> None:
        if not room.host_user_id:
            return
        existing = self.session.get(RoomMembership, (room.code, room.host_user_id))
        if existing:
            return
        membership = RoomMembership(
            room_code=room.code,
            user_id=room.host_user_id,
            role="player",
            joined_at=room.created_at,
        )
        self.session.add(membership)
        self.session.flush()

    def _room_to_read(self, room: Room, current_user_id: str | None = None) -> RoomRead:
        self._ensure_host_membership(room)
        player_count, spectator_count = self._membership_counts(room.code)
        is_joined = False
        if current_user_id:
            is_joined = (
                self.session.get(RoomMembership, (room.code, current_user_id)) is not None
            )
        is_joinable = room.status == "active" and player_count < room.max_players
        return RoomRead(
            code=room.code,
            name=room.name,
            host_user_id=room.host_user_id,
            max_players=room.max_players,
            max_spectators=room.max_spectators,
            visibility=room.visibility,
            status=room.status,
            player_count=player_count,
            spectator_count=spectator_count,
            is_joined=is_joined,
            is_joinable=is_joinable,
            created_at=room.created_at,
        )

    def create_room(self, payload: RoomCreate, host_user_id: str) -> RoomRead:
        code = self._generate_unique_code()
        room = Room(
            code=code,
            name=payload.name,
            host_user_id=host_user_id,
            max_players=payload.max_players,
            max_spectators=payload.max_spectators,
            visibility=payload.visibility,
            status=payload.status,
        )
        self.session.add(room)
        self.session.flush()
        host_membership = RoomMembership(room_code=room.code, user_id=host_user_id, role="player")
        self.session.add(host_membership)
        self.session.flush()
        return self._room_to_read(room, host_user_id)

    def list_rooms(self, limit: int, offset: int, current_user_id: str | None = None) -> List[RoomRead]:
        rooms = self.session.exec(select(Room).offset(offset).limit(limit)).all()
        return [self._room_to_read(room, current_user_id) for room in rooms]

    def join_room(self, room_code: str, user_id: str, as_spectator: bool) -> RoomRead:
        room = self.session.get(Room, room_code)
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        if room.status != "active":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Room is not joinable")

        self._ensure_host_membership(room)

        existing = self.session.get(RoomMembership, (room_code, user_id))
        if existing:
            return self._room_to_read(room, user_id)

        player_count, spectator_count = self._membership_counts(room_code)
        role = "spectator" if as_spectator else "player"
        if role == "player" and player_count >= room.max_players:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Room is full for players")
        if role == "spectator" and spectator_count >= room.max_spectators:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Room is full for spectators")

        membership = RoomMembership(room_code=room_code, user_id=user_id, role=role)
        self.session.add(membership)
        self.session.flush()
        return self._room_to_read(room, user_id)


def paginate(limit: Optional[int], offset: Optional[int], default_limit: int) -> Tuple[int, int]:
    limit_value = limit or default_limit
    limit_value = max(1, min(limit_value, default_limit))
    offset_value = max(0, offset or 0)
    return limit_value, offset_value
