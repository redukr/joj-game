import os
from functools import lru_cache
from pathlib import Path
from typing import List

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


class Settings(BaseSettings):
    admin_token: str = Field("changeme", env="ADMIN_TOKEN")
    allowed_oauth_providers: List[str] = Field(
        default_factory=lambda: ["apple", "google", "guest"], env="ALLOWED_OAUTH_PROVIDERS"
    )

    @validator("allowed_oauth_providers", pre=True)
    def _split_providers(cls, value):  # noqa: N805
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    class Config:
        env_file = ".env"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    settings_file = Path(os.getenv("SETTINGS_FILE", DEFAULT_CONFIG_PATH))
    file_settings = _load_file_settings(settings_file)
    return Settings(**file_settings)
