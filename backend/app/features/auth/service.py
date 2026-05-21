from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import HTTPException, status
from jose import jwt

from app.config import settings


# Hash the plain-text admin password from .env once at startup
_ADMIN_PASSWORD_HASH: bytes = bcrypt.hashpw(
    settings.ADMIN_PASSWORD.encode(), bcrypt.gensalt()
)


def login_admin(username: str, password: str) -> str:
    valid = username == settings.ADMIN_USERNAME and bcrypt.checkpw(
        password.encode(), _ADMIN_PASSWORD_HASH
    )
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": username, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
