from core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


def _normalize_url(url: str) -> str:
    """Make sure SQLAlchemy uses the psycopg (v3) driver for Postgres.

    Hosting providers often hand out URLs starting with "postgres://" or
    "postgresql://", which SQLAlchemy would map to the old psycopg2 driver.
    """
    for prefix in ("postgres://", "postgresql://"):
        if url.startswith(prefix):
            return "postgresql+psycopg://" + url[len(prefix) :]
    return url


engine = create_engine(
    _normalize_url(settings.DATABASE_URL),
    # Check connections before use so a restarted database doesn't
    # leave the app holding dead connections.
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create database tables based on the defined models."""
    Base.metadata.create_all(bind=engine)
