import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.features.categories.models import Category


def get_all_categories(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.is_custom, Category.name).all()


def get_category_by_id(db: Session, category_id: str) -> Category:
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category {category_id} not found",
        )
    return category


def get_or_create_custom_category(db: Session, name: str) -> Category:
    # reuse existing custom category with same name if it exists (case-insensitive)
    existing = db.query(Category).filter(
        Category.name.ilike(name),
        Category.is_custom == True,
    ).first()
    if existing:
        return existing

    category = Category(
        id=str(uuid.uuid4()),
        name=name.strip(),
        is_custom=True,
    )
    db.add(category)
    db.flush()  # flush to get the id without committing yet, expense creation commits
    return category