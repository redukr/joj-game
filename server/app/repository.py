import hashlib
import secrets
from datetime import datetime, timedelta
from typing import List, Optional, Tuple

import requests
from fastapi import HTTPException, status
from jose import jwt
from jose.exceptions import JWTError
from sqlalchemy import func, or_
from sqlmodel import Session, delete, select
from passlib.context import CryptContext

from app.config import get_settings
from app.models import (
    AuthResponse,
    Card,
    CardBase,
    CardRead,
    Deck,
    DeckBase,
    DeckImport,
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
        self.settings = get_settings()
        self._jwks_cache: dict[str, dict] = {}
        self._pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

    def import_deck(self, payload: DeckImport) -> DeckRead:
        new_card_ids: list[int] = []
        for card_payload in payload.cards:
            card = Card.from_orm(card_payload)
            self.session.add(card)
            self.session.flush()
            self.session.refresh(card)
            new_card_ids.append(card.id)

        deck_payload = payload.deck

        if new_card_ids:
            card_ids = list(deck_payload.card_ids or [])
            if card_ids:
                unique_existing_ids: list[int] = []
                for cid in card_ids:
                    if cid not in unique_existing_ids:
                        unique_existing_ids.append(cid)

                replacement_map = {
                    old_id: new_id
                    for old_id, new_id in zip(unique_existing_ids, new_card_ids)
                }
                card_ids = [replacement_map.get(cid, cid) for cid in card_ids]

                if len(new_card_ids) > len(unique_existing_ids):
                    card_ids.extend(new_card_ids[len(unique_existing_ids) :])
            else:
                card_ids = new_card_ids
        else:
            card_ids = list(deck_payload.card_ids or [])
            self._validate_cards_exist(card_ids)

        deck = Deck(
            name=deck_payload.name,
            description=deck_payload.description,
            card_ids=card_ids,
        )
        self.session.add(deck)
        self.session.flush()
        self.session.refresh(deck)
        return DeckRead.from_orm(deck)

    # Auth helpers
    def _hash_password(self, password: str) -> str:
        return self._pwd_context.hash(password)

    def _verify_password(self, password: str, password_hash: str | None) -> bool:
        if not password_hash:
            return False
        if self._pwd_context.verify(password, password_hash):
            return True
        # Legacy SHA256 fallback for existing guest accounts created before bcrypt rollout
        legacy_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
        return legacy_hash == password_hash

    def _get_provider_config(self, provider: Provider) -> tuple[str, str]:
        if provider == Provider.GOOGLE:
            return self.settings.google_issuer, self.settings.google_jwks_url
        if provider == Provider.APPLE:
            return self.settings.apple_issuer, self.settings.apple_jwks_url
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported provider")

    def _fetch_jwks(self, jwks_url: str) -> dict:
        if jwks_url in self._jwks_cache:
            return self._jwks_cache[jwks_url]
        response = requests.get(jwks_url, timeout=5)
        if response.status_code != 200:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Unable to fetch provider keys")
        data = response.json()
        self._jwks_cache[jwks_url] = data
        return data

    def _validate_oauth_token(self, provider: Provider, token: str) -> dict:
        issuer, jwks_url = self._get_provider_config(provider)
        audience = self.settings.oauth_audience or None
        jwks = self._fetch_jwks(jwks_url)
        try:
            header = jwt.get_unverified_header(token)
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OAuth token")
        key = None
        for jwk in jwks.get("keys", []):
            if jwk.get("kid") == header.get("kid"):
                key = jwk
                break
        if not key:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unknown signing key")
        try:
            decode_kwargs = {
                "token": token,
                "key": key,
                "algorithms": [header.get("alg", "RS256")],
                "issuer": issuer,
            }
            if audience:
                decode_kwargs["audience"] = audience
            else:
                decode_kwargs["options"] = {"verify_aud": False}
            claims = jwt.decode(**decode_kwargs)
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OAuth token")
        return claims

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
        expires_at = datetime.utcnow() + timedelta(hours=12)
        token = Token(token=token_value, user_id=user_id, expires_at=expires_at)
        self.session.add(token)
        self.session.flush()
        return token_value

    def _revoke_user_tokens(self, user_id: str) -> None:
        self.session.exec(delete(Token).where(Token.user_id == user_id))

    def _cleanup_expired_tokens(self) -> None:
        now = datetime.utcnow()
        self.session.exec(delete(Token).where(Token.expires_at < now))

    def create_user(self, payload: LoginRequest) -> AuthResponse:
        display_name = payload.display_name or payload.provider.value.title()
        password_hash = None
        if payload.provider in {Provider.APPLE, Provider.GOOGLE}:
            if not payload.token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="OAuth token is required",
                )
            self._validate_oauth_token(payload.provider, payload.token)
        if payload.password:
            password_hash = self._hash_password(payload.password)

        existing_user = None
        if payload.provider == Provider.GUEST and payload.display_name:
            existing_user = self._get_user_by_display_name(
                payload.provider, payload.display_name
            )

        if existing_user:
            if existing_user.password_hash and not self._verify_password(
                payload.password or "", existing_user.password_hash
            ):
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
        self._revoke_user_tokens(user.id)
        token = self._issue_token(user.id)
        return AuthResponse(access_token=token, user=UserRead.from_orm(user))

    def resolve_user(self, token: str) -> UserRead:
        self._cleanup_expired_tokens()
        token_row = self.session.get(Token, token)
        if not token_row:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        if token_row.expires_at and token_row.expires_at < datetime.utcnow():
            self.session.delete(token_row)
            self.session.flush()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
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
        base_query = select(Room).where(Room.status == "active")
        if current_user_id:
            member_subquery = (
                select(RoomMembership.room_code)
                .where(RoomMembership.user_id == current_user_id)
                .subquery()
            )
            base_query = base_query.where(
                or_(Room.visibility == "public", Room.code.in_(member_subquery))
            )
        else:
            base_query = base_query.where(Room.visibility == "public")
        rooms = self.session.exec(base_query.offset(offset).limit(limit)).all()
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
