"""
Run this once after migrations to populate predefined expense categories.

Usage:
    docker compose exec backend python seeds.py
"""

import uuid
from app.database import SessionLocal
from app.features.categories.models import Category

# Import all models so SQLAlchemy can resolve cross-model relationships
import app.features.users.models  # noqa: F401
import app.features.expenses.models  # noqa: F401
import app.features.notifications.models  # noqa: F401


PREDEFINED_CATEGORIES = [
    "Travel",
    "Accommodation",
    "Meals & Entertainment",
    "Office Supplies",
    "Software & Subscriptions",
    "Training & Courses",
    "Client Gifts",
    "Internet & Phone",
    "Medical & Wellness",
    "Miscellaneous",
]


def seed_categories() -> None:
    db = SessionLocal()
    try:
        existing = db.query(Category).filter(Category.is_custom == False).all()
        existing_names = {c.name for c in existing}

        added = 0
        for name in PREDEFINED_CATEGORIES:
            if name not in existing_names:
                category = Category(
                    id=str(uuid.uuid4()),
                    name=name,
                    is_custom=False,
                )
                db.add(category)
                added += 1

        db.commit()
        print(f"Seeding complete. {added} categories added, {len(existing_names)} already existed.")
    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_categories()