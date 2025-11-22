from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from sqlalchemy import inspect, text
from sqlmodel import Session, SQLModel, create_engine

from app.config import get_settings


def _build_engine():
    settings = get_settings()
    db_path = Path(settings.database_url)
    if db_path.parent and not db_path.parent.exists():
        db_path.parent.mkdir(parents=True, exist_ok=True)
    return create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})


engine = _build_engine()


def _apply_migrations() -> None:
    inspector = inspect(engine)
    room_columns = {column_info["name"] for column_info in inspector.get_columns("room")}

    if "max_spectators" not in room_columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE room "
                    "ADD COLUMN max_spectators INTEGER NOT NULL DEFAULT 0"
                )
            )


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    _apply_migrations()


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_session() -> Generator[Session, None, None]:
    with session_scope() as session:
        yield session
