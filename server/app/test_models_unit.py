import pytest
from pydantic import ValidationError

from app.models import CardBase, LoginRequest, Provider


def test_card_base_rejects_out_of_bounds_effects():
    with pytest.raises(ValidationError):
        CardBase(
            name="Too Strong",
            description="Breaks bounds",
            category=None,
            time=15,
            reputation=0,
            discipline=0,
            documents=0,
            technology=0,
        )


def test_login_request_rejects_unknown_provider():
    with pytest.raises(ValidationError):
        LoginRequest(provider="invalid", display_name="User", password="pw")
