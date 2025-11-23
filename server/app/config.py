import os
from functools import lru_cache
from pathlib import Path
from typing import Any, List

import yaml
from pydantic import BaseSettings, Field, validator

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG_PATH = BASE_DIR / "config" / "settings.yaml"


def _load_file_settings(path: Path) -> dict:
    if not path.exists():
        return {}
    data = yaml.safe_load(path.read_text()) or {}
    if not isinstance(data, dict):
        raise ValueError("Settings file must contain a mapping at the top level")
    return data


def _file_settings_source(_: BaseSettings) -> dict[str, Any]:
    settings_file = Path(os.getenv("SETTINGS_FILE", DEFAULT_CONFIG_PATH))
    return _load_file_settings(settings_file)


class Settings(BaseSettings):
    admin_token: str = Field("redukr", env="ADMIN_TOKEN")
    database_url: str = Field("./data/app.db", env="DATABASE_URL")
    allowed_oauth_providers: List[str] = Field(
        default_factory=lambda: ["apple", "google", "guest"], env="ALLOWED_OAUTH_PROVIDERS"
    )
    allowed_origins: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:8001",
            "http://127.0.0.1:8001",
        ],
        env="ALLOWED_ORIGINS",
    )
    oauth_audience: List[str] = Field(default_factory=list, env="OAUTH_AUDIENCE")
    google_issuer: str = Field("https://accounts.google.com", env="GOOGLE_ISSUER")
    google_jwks_url: str = Field(
        "https://www.googleapis.com/oauth2/v3/certs", env="GOOGLE_JWKS_URL"
    )
    apple_issuer: str = Field("https://appleid.apple.com", env="APPLE_ISSUER")
    apple_jwks_url: str = Field(
        "https://appleid.apple.com/auth/keys", env="APPLE_JWKS_URL"
    )
    allowed_origin_regex: str | None = Field(
        None,
        env="ALLOWED_ORIGIN_REGEX",
    )
    default_page_size: int = Field(50, env="DEFAULT_PAGE_SIZE")

    @validator("allowed_oauth_providers", "allowed_origins", "oauth_audience", pre=True)
    def _split_csv(cls, value):  # noqa: N805
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @validator("allowed_origin_regex", pre=True)
    def _empty_regex_to_none(cls, value):  # noqa: N805
        if value in {"", None}:
            return None
        return value

    class Config:
        env_file = ".env"

        @classmethod
        def customise_sources(cls, init_settings, env_settings, file_secret_settings):
            return (
                env_settings,
                init_settings,
                file_secret_settings,
                _file_settings_source,
            )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
