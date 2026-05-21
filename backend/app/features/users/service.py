import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.features.users.models import User
from app.features.users.schemas import UserCreate


def create_user(db: Session, data: UserCreate) -> User:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A user with email {data.email} already exists",
        )
    user = User(
        id=str(uuid.uuid4()),
        name=data.name,
        email=data.email,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: str) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found",
        )
    return user


def get_all_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.created_at.desc()).all()