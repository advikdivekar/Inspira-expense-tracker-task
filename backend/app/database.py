import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.pool import NullPool

from app.config import settings

_on_vercel = os.getenv("VERCEL") == "1"

engine = create_engine(
    settings.DATABASE_URL,
    # Vercel serverless: each invocation is stateless, so connection pooling is
    # meaningless and can exhaust DB connections. Use NullPool there.
    # Locally / Docker: keep a real pool for performance.
    **({"poolclass": NullPool} if _on_vercel else {
        "pool_pre_ping": True,
        "pool_size": 10,
        "max_overflow": 20,
    }),
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,      # we control commits manually — nothing saves until session.commit()
    autoflush=False,       # don't flush to DB automatically before queries
)


# All models inherit from this Base so Alembic and SQLAlchemy can discover them
class Base(DeclarativeBase):
    pass