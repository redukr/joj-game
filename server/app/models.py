from datetime import datetime
from enum import Enum
from typing import List, Optional

from sqlalchemy import Column
from sqlalchemy.dialects.sqlite import JSON
from sqlmodel import Field, SQLModel


class Provider(str, Enum):
    APPLE = "apple"
    GOOGLE = "google"
    GUEST = "guest"


class CardBase(SQLModel):
    name: str = Field(..., description="Card name (e.g., 'Ляп на брифінгу')")
    description: str = Field(
        ..., description="Card description (e.g., 'Втрачено репутацію через невдалий виступ')"
    )
    category: Optional[str] = Field(None, description="Card category (e.g., 'scandal')")


class Card(CardBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


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


class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    provider: Provider
    display_name: str


class UserRead(SQLModel):
    id: str
    provider: Provider
    display_name: str

    class Config:
        orm_mode = True


class Token(SQLModel, table=True):
    token: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuthResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class LoginRequest(SQLModel):
    provider: Provider
    token: Optional[str] = Field(None, description="ID token from the provider")
    display_name: Optional[str] = Field(None, description="Fallback name for guest accounts")


class RoomCreate(SQLModel):
    name: str
    max_players: int = Field(4, ge=2, le=12)
    visibility: str = Field("private", description="private or public")


class Room(SQLModel, table=True):
    code: str = Field(primary_key=True, index=True)
    name: str
    host_user_id: str = Field(foreign_key="user.id")
    max_players: int
    visibility: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RoomRead(SQLModel):
    code: str
    name: str
    host_user_id: str
    max_players: int
    visibility: str
    created_at: datetime

    class Config:
        orm_mode = True
