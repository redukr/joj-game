from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from sqlalchemy.exc import OperationalError
from sqlmodel import Session, SQLModel, create_engine

from app.config import get_settings


def _build_engine():
    settings = get_settings()
    db_path = Path(settings.database_url)
    if db_path.parent and not db_path.parent.exists():
        db_path.parent.mkdir(parents=True, exist_ok=True)
    return create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})


engine = _build_engine()


def _table_has_column(table_name: str, column_name: str) -> bool:
    with engine.connect() as connection:
        result = connection.exec_driver_sql(f"PRAGMA table_info('{table_name}')")
        for row in result.fetchall():
            if row[1] == column_name:
                return True
    return False


def _add_missing_max_spectators_column() -> None:
    if _table_has_column("room", "max_spectators"):
        return

    with engine.begin() as connection:
        try:
            connection.exec_driver_sql(
                "ALTER TABLE room ADD COLUMN max_spectators INTEGER NOT NULL DEFAULT 0"
            )
        except OperationalError as error:
            # If a concurrent worker already added the column between the check above
            # and this statement, ignore the duplicate-column error so startup
            # continues for all processes.
            message = str(getattr(error, "orig", error)).lower()
            if "duplicate column name" not in message:
                raise


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    _add_missing_max_spectators_column()


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
