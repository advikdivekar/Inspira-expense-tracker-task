from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.features.users.schemas import UserCreate, UserResponse
from app.features.users import service


router = APIRouter(prefix="/users", tags=["Users"])


@router.post("", response_model=UserResponse, status_code=201)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    # employees register themselves, no auth required
    return service.create_user(db, data)


@router.get("", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    # only manager can list all users
    return service.get_all_users(db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    return service.get_user_by_id(db, user_id)