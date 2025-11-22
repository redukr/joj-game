from fastapi import APIRouter, Depends

from app.config import get_settings
from app.dependencies import get_repository
from app.models import CardRead
from app.repository import Repository, paginate

router = APIRouter(prefix="/cards", tags=["cards"])


@router.get("", response_model=list[CardRead])
def list_cards(
    limit: int | None = None,
    offset: int | None = None,
    repo: Repository = Depends(get_repository),
):
    settings = get_settings()
    limit_value, offset_value = paginate(limit, offset, settings.default_page_size)
    return repo.list_cards(limit_value, offset_value)
