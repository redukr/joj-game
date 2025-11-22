from functools import lru_cache
from typing import List

from pydantic import BaseSettings


class Settings(BaseSettings):
    admin_token: str = "changeme"
    allowed_oauth_providers: List[str] = ["apple", "google", "guest"]

    class Config:
        env_file = ".env"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
