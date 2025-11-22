import json
from pathlib import Path
from typing import Iterable

from sqlmodel import Session

from app.models import CardBase
from app.repository import Repository


def _iter_card_files(base_path: Path) -> Iterable[Path]:
    if not base_path.exists():
        return []
    return sorted(path for path in base_path.glob("*.json") if path.is_file())


def load_cards_from_disk(session: Session, cards_path: Path) -> int:
    repo = Repository(session)
    loaded = 0
    for file_path in _iter_card_files(cards_path):
        try:
            payload = json.loads(file_path.read_text())
            card = CardBase.parse_obj(payload)
            repo.add_card(card)
            loaded += 1
        except Exception:
            # Skip malformed entries but continue boot
            continue
    return loaded
