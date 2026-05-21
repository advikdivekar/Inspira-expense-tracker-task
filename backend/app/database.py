from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    # keeps a pool of connections open instead of opening/closing on every request
    pool_pre_ping=True,    # checks connection health before using it from the pool
    pool_size=10,          # max persistent connections
    max_overflow=20,       # extra connections allowed under heavy load
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,      # we control commits manually — nothing saves until session.commit()
    autoflush=False,       # don't flush to DB automatically before queries
)


# All models inherit from this Base so Alembic and SQLAlchemy can discover them
class Base(DeclarativeBase):
    pass