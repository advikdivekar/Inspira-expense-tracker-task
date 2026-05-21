from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.features.categories.schemas import CategoryResponse
from app.features.categories import service


router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    # public endpoint — employees need this to populate the category dropdown
    return service.get_all_categories(db)