from datetime import datetime, timedelta
from enum import Enum
from typing import List, Optional

from pydantic import validator
from sqlalchemy import Column, String, UniqueConstraint
from sqlalchemy.dialects.sqlite import JSON
from sqlmodel import Field, SQLModel


class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"


def _normalize_role_value(value: Role | str | None) -> Role:
    if isinstance(value, Role):
        return value
    if isinstance(value, str):
        lowered = value.strip().lower()
        if lowered in Role._value2member_map_:
            return Role(lowered)
    return Role.USER


class Provider(str, Enum):
    APPLE = "apple"
    GOOGLE = "google"
    GUEST = "guest"


class CardBase(SQLModel):
    name: str = Field(
        ...,
        max_length=128,
        description="Card name (e.g., 'Ляп на брифінгу')",
    )
    description: str = Field(
        ...,
        max_length=512,
        description="Card description (e.g., 'Втрачено репутацію через невдалий виступ')",
    )
    category: Optional[str] = Field(
        None, max_length=64, description="Card category (e.g., 'scandal')"
    )
    time: int = Field(0, ge=-10, le=10, description="Time effect for the card (e.g., +1 or -2)")
    reputation: int = Field(0, ge=-10, le=10, description="Reputation effect for the card")
    discipline: int = Field(0, ge=-10, le=10, description="Discipline effect for the card")
    documents: int = Field(0, ge=-10, le=10, description="Documents effect for the card")
    technology: int = Field(0, ge=-10, le=10, description="Technology effect for the card")


class Card(CardBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    __table_args__ = (UniqueConstraint("name", "category", name="uq_card_name_category"),)


class CardRead(CardBase):
    id: int

    class Config:
        orm_mode = True


class DeckBase(SQLModel):
    name: str
    description: Optional[str] = None
    card_ids: List[int] = Field(default_factory=list, sa_column=Column(JSON))


class Deck(DeckBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class DeckRead(DeckBase):
    id: int

    class Config:
        orm_mode = True


class DeckImport(SQLModel):
    deck: DeckBase
    cards: List[CardBase] = Field(default_factory=list)


class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    provider: Provider
    display_name: str
    password_hash: str | None = Field(default=None, description="Hashed password for local auth")
    role: Role = Field(
        default=Role.USER,
        sa_column=Column(String, nullable=False),
    )

    @validator("role", pre=True)
    def normalize_role(cls, value: Role | str | None) -> Role:  # noqa: N805
        return _normalize_role_value(value)


class UserRead(SQLModel):
    id: str
    provider: Provider
    display_name: str
    role: Role

    @validator("role", pre=True)
    def normalize_role(cls, value: Role | str | None) -> Role:  # noqa: N805
        return _normalize_role_value(value)

    class Config:
        orm_mode = True


class UserRoleUpdate(SQLModel):
    role: Role

    @validator("role", pre=True)
    def normalize_role(cls, value: Role | str | None) -> Role:  # noqa: N805
        return _normalize_role_value(value)


class Token(SQLModel, table=True):
    token: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(hours=12))
    revoked_at: datetime | None = None


class AuthResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class LoginRequest(SQLModel):
    provider: Provider = Field(
        Provider.GUEST,
        description="Authentication provider; defaults to guest for simple registration",
    )
    token: Optional[str] = Field(None, description="ID token from the provider")
    display_name: Optional[str] = Field(
        None,
        alias="displayName",
        description="Fallback name for guest accounts",
    )
    password: Optional[str] = Field(
        None,
        min_length=4,
        max_length=128,
        alias="password",
        description="Password used for guest/local authentication",
    )

    class Config:
        allow_population_by_field_name = True


class PasswordChangeRequest(SQLModel):
    current_password: str = Field(..., min_length=4, max_length=128)
    new_password: str = Field(..., min_length=4, max_length=128)


class RoomCreate(SQLModel):
    name: str
    max_players: int = Field(
        ..., ge=2, le=6, description="Number of players (must be between 2 and 6)"
    )
    max_spectators: int = Field(
        ..., ge=0, le=10, description="Maximum spectators allowed (up to 10)"
    )
    visibility: str = Field("private", description="private or public")
    status: str = Field("active", description="active or archived")


class RoomJoin(SQLModel):
    as_spectator: bool = False


class Room(SQLModel, table=True):
    code: str = Field(primary_key=True, index=True)
    name: str
    host_user_id: str = Field(foreign_key="user.id")
    max_players: int
    max_spectators: int
    visibility: str
    status: str = Field(default="active")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RoomRead(SQLModel):
    code: str
    name: str
    host_user_id: str
    max_players: int
    max_spectators: int
    visibility: str
    status: str
    player_count: int = 0
    spectator_count: int = 0
    is_joined: bool = False
    is_joinable: bool = False
    created_at: datetime

    class Config:
        orm_mode = True


class RoomMembership(SQLModel, table=True):
    room_code: str = Field(foreign_key="room.code", primary_key=True)
    user_id: str = Field(foreign_key="user.id", primary_key=True)
    role: str = Field(default="player")
    joined_at: datetime = Field(default_factory=datetime.utcnow)
