import secrets
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
    Card,
    CardBase,
    CardRead,
    Deck,
    DeckBase,
    DeckImport,
    DeckRead,
    LoginRequest,
    Provider,
    Role,
    Room,
    RoomCreate,
    RoomMembership,
    RoomRead,
    User,
    UserRead,
)


class Repository:
    def __init__(self, session: Session):
        self.session = session
        self.settings = get_settings()
        self._jwks_cache: dict[str, dict] = {}
        self._pwd_context = CryptContext(
            schemes=["bcrypt_sha256", "bcrypt", "scrypt"], deprecated="auto"
        )

    # Card helpers
    def _ensure_card_unique(self, name: str, category: str | None, existing_id: int | None = None) -> None:
        query = select(Card).where(Card.name == name)
        if category is None:
            query = query.where(Card.category.is_(None))
        else:
            query = query.where(Card.category == category)
        existing = self.session.exec(query).first()
        if existing and existing.id != existing_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Card with the same name and category already exists",
            )

    def add_card(self, payload: CardBase) -> CardRead:
        self._ensure_card_unique(payload.name, payload.category)
        card = Card.from_orm(payload)
        self.session.add(card)
        self.session.flush()
        self.session.refresh(card)
        return CardRead.from_orm(card)

    def update_card(self, card_id: int, payload: CardBase) -> CardRead:
        card = self.session.get(Card, card_id)
        if not card:
            raise HTTPException(status_code=404, detail="Card not found")
        self._ensure_card_unique(payload.name, payload.category, existing_id=card.id)
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
        raw_results = self.session.exec(
            select(Card.id).where(Card.id.in_(card_ids))
        ).all()
        found_ids = {
            row[0] if isinstance(row, tuple) else row
            for row in raw_results
        }
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
        card_ids = self._prepare_import_card_ids(payload)

        deck = Deck(
            name=payload.deck.name,
            description=payload.deck.description,
            card_ids=card_ids,
        )
        self.session.add(deck)
        self.session.flush()
        self.session.refresh(deck)
        return DeckRead.from_orm(deck)

    def import_deck_into_existing(self, deck_id: int, payload: DeckImport) -> DeckRead:
        deck = self.session.get(Deck, deck_id)
        if not deck:
            raise HTTPException(status_code=404, detail="Deck not found")

        card_ids = self._prepare_import_card_ids(payload)

        deck.name = payload.deck.name
        deck.description = payload.deck.description
        deck.card_ids = card_ids
        self.session.add(deck)
        self.session.flush()
        self.session.refresh(deck)
        return DeckRead.from_orm(deck)

    def _prepare_import_card_ids(self, payload: DeckImport) -> list[int]:
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

        return card_ids

    # Auth helpers
    def _hash_password(self, password: str) -> str:
        return self._pwd_context.hash(password)

    def _verify_password(self, password: str, password_hash: str | None) -> bool:
        if not password_hash:
            return False
        return self._pwd_context.verify(password, password_hash)

    def verify_guest_password(self, user_id: str, password: str) -> bool:
        user = self.session.get(User, user_id)
        if not user or user.provider != Provider.GUEST:
            return False
        return self._verify_password(password, user.password_hash)

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
        audience = self.settings.oauth_audience
        if not audience:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OAuth audience must be configured",
            )
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
                "audience": audience,
            }
            claims = jwt.decode(**decode_kwargs)
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OAuth token")
        return claims

    def _generate_user(
        self,
        provider: Provider,
        role: Role,
        display_name: str,
        password_hash: str | None,
    ) -> User:
        user_id = secrets.token_urlsafe(8)
        user = User(
            id=user_id,
            provider=provider,
            role=role,
            display_name=display_name,
            password_hash=password_hash,
        )
        self.session.add(user)
        self.session.flush()
        return user

    def ensure_admin_user(self) -> User:
        password_hash = self._hash_password("admin")
        admin = self.session.get(User, "admin")

        if admin:
            admin.role = Role.ADMIN
            admin.provider = Provider.GUEST
            admin.display_name = "admin"
            admin.password_hash = password_hash
        else:
            admin = User(
                id="admin",
                provider=Provider.GUEST,
                role=Role.ADMIN,
                display_name="admin",
                password_hash=password_hash,
            )
            self.session.add(admin)

        self.session.flush()
        self.session.refresh(admin)
        return admin

    def _get_user_by_display_name(
        self, provider: Provider, display_name: str
    ) -> User | None:
        statement = select(User).where(
            User.provider == provider, User.display_name == display_name
        )
        return self.session.exec(statement).first()

    def create_user(self, payload: LoginRequest) -> UserRead:
        display_name = payload.display_name or payload.provider.value.title()
        password_hash = None
        role = Role.GUEST if payload.provider == Provider.GUEST else Role.USER
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
            user = self._generate_user(
                payload.provider, role, display_name, password_hash
            )
        return UserRead.from_orm(user)

    def change_password(self, user_id: str, current_password: str, new_password: str) -> UserRead:
        user = self.session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        if user.provider != Provider.GUEST:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password changes are only supported for guest accounts",
            )
        if not self._verify_password(current_password, user.password_hash or ""):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect",
            )

        user.password_hash = self._hash_password(new_password)
        self.session.add(user)
        self.session.flush()
        return UserRead.from_orm(user)

    def get_user(self, user_id: str) -> UserRead | None:
        user = self.session.get(User, user_id)
        return UserRead.from_orm(user) if user else None

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

    def list_rooms(
        self,
        limit: int,
        offset: int,
        current_user_id: str | None = None,
        visibility: str | None = None,
        status: str | None = None,
        sort: str | None = None,
    ) -> List[RoomRead]:
        base_query = select(Room)
        if status:
            base_query = base_query.where(Room.status == status)
        if visibility:
            base_query = base_query.where(Room.visibility == visibility)
        else:
            base_query = base_query.where(Room.visibility.in_(["public", "private"]))
        if current_user_id:
            member_subquery = select(RoomMembership.room_code).where(
                RoomMembership.user_id == current_user_id
            )
            base_query = base_query.where(
                or_(Room.visibility == "public", Room.code.in_(member_subquery))
            )
        else:
            base_query = base_query.where(Room.visibility == "public")

        sort = sort or "-created_at"
        sort_field = sort[1:] if sort.startswith("-") else sort
        if not hasattr(Room, sort_field):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported sort field")
        if sort.startswith("-"):
            base_query = base_query.order_by(getattr(Room, sort_field).desc())
        else:
            base_query = base_query.order_by(getattr(Room, sort_field).asc())

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

    # User admin helpers
    def list_users(self, limit: int, offset: int) -> List[UserRead]:
        users = self.session.exec(select(User).offset(offset).limit(limit)).all()
        return [UserRead.from_orm(user) for user in users]

    def delete_user(self, user_id: str) -> None:
        user = self.session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        rooms_to_delete = self.session.exec(
            select(Room.code).where(Room.host_user_id == user_id)
        ).all()

        self.session.exec(delete(RoomMembership).where(RoomMembership.user_id == user_id))

        for (room_code,) in rooms_to_delete:
            self.delete_room(room_code)

        self.session.delete(user)
        self.session.flush()

    # Room admin helpers
    def list_all_rooms(
        self, limit: int, offset: int, status: str | None = None, sort: str | None = None
    ) -> List[RoomRead]:
        base_query = select(Room)
        if status:
            base_query = base_query.where(Room.status == status)

        sort = sort or "-created_at"
        sort_field = sort[1:] if sort.startswith("-") else sort
        if not hasattr(Room, sort_field):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported sort field")
        if sort.startswith("-"):
            base_query = base_query.order_by(getattr(Room, sort_field).desc())
        else:
            base_query = base_query.order_by(getattr(Room, sort_field).asc())

        rooms = self.session.exec(base_query.offset(offset).limit(limit)).all()
        return [self._room_to_read(room, None) for room in rooms]

    def delete_room(self, room_code: str) -> None:
        room = self.session.get(Room, room_code)
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        self.session.exec(delete(RoomMembership).where(RoomMembership.room_code == room_code))
        self.session.delete(room)
        self.session.flush()


def paginate(
    limit: Optional[int], offset: Optional[int], default_limit: int, max_limit: Optional[int] = None
) -> Tuple[int, int]:
    limit_value = limit or default_limit
    upper_bound = max_limit or default_limit
    limit_value = max(1, min(limit_value, upper_bound))
    offset_value = max(0, offset or 0)
    return limit_value, offset_value
