from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from sqlalchemy.exc import DatabaseError, OperationalError
from sqlalchemy import inspect, text
from sqlmodel import Session, SQLModel, create_engine

from app import models  # noqa: F401  Ensure models are registered with SQLModel metadata

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


def _ensure_card_resource_columns() -> None:
    inspector = inspect(engine)
    card_columns = {column_info["name"] for column_info in inspector.get_columns("card")}
    resource_columns = {"time", "reputation", "discipline", "documents", "technology"}
    missing = resource_columns - card_columns
    if not missing:
        return

    for column_name in sorted(missing):
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE card "
                    f"ADD COLUMN {column_name} INTEGER NOT NULL DEFAULT 0"
                )
            )
def _apply_migrations() -> None:
    inspector = inspect(engine)
    room_columns = {column_info["name"] for column_info in inspector.get_columns("room")}
    token_columns = {column_info["name"] for column_info in inspector.get_columns("token")}

    if "max_spectators" not in room_columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE room "
                    "ADD COLUMN max_spectators INTEGER NOT NULL DEFAULT 0"
                )
            )

    if "status" not in room_columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE room "
                    "ADD COLUMN status VARCHAR NOT NULL DEFAULT 'active'"
                )
            )
    if "expires_at" not in token_columns:
        with engine.begin() as connection:
            connection.execute(
                text("ALTER TABLE token ADD COLUMN expires_at DATETIME")
            )
        # Populate existing rows with a 12-hour expiry to match the application default
        with engine.begin() as connection:
            connection.execute(
                text(
                    "UPDATE token "
                    "SET expires_at = datetime('now', '+12 hours') "
                    "WHERE expires_at IS NULL"
                )
            )
    if "revoked_at" not in token_columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE token "
                    "ADD COLUMN revoked_at DATETIME"
                )
            )
    _ensure_card_resource_columns()


def init_db() -> None:
    try:
        SQLModel.metadata.create_all(engine)
    except DatabaseError as error:
        if not _recreate_malformed_deck(error):
            raise
    _migrate_password_hash_column()


def _recreate_malformed_deck(error: DatabaseError) -> bool:
    message = str(getattr(error, "orig", error)).lower()
    if "malformed database schema (deck)" not in message:
        return False

    db_path = Path(get_settings().database_url)
    if db_path.exists():
        db_path.unlink()

    SQLModel.metadata.create_all(engine)
    return True


def _migrate_password_hash_column() -> None:
    inspector = inspect(engine)
    columns = {column["name"] for column in inspector.get_columns("user")}
    if "password_hash" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE user ADD COLUMN password_hash VARCHAR"))
    _add_missing_max_spectators_column()
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
