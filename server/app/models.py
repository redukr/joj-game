from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class Provider(str, Enum):
    APPLE = "apple"
    GOOGLE = "google"
    GUEST = "guest"


class CardBase(BaseModel):
    name: str = Field(..., example="Ляп на брифінгу")
    description: str = Field(..., example="Втрачено репутацію через невдалий виступ")
    category: Optional[str] = Field(None, example="scandal")


class Card(CardBase):
    id: int


class DeckBase(BaseModel):
    name: str
    description: Optional[str] = None
    card_ids: List[int] = Field(default_factory=list)


class Deck(DeckBase):
    id: int


class User(BaseModel):
    id: str
    provider: Provider
    display_name: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User


class LoginRequest(BaseModel):
    provider: Provider
    token: Optional[str] = Field(None, description="ID token from the provider")
    display_name: Optional[str] = Field(None, description="Fallback name for guest accounts")


class RoomCreate(BaseModel):
    name: str
    max_players: int = Field(4, ge=2, le=12)
    visibility: str = Field("private", description="private or public")


class Room(BaseModel):
    code: str
    name: str
    host_user_id: str
    max_players: int
    visibility: str
    created_at: datetime
