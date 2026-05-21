import uuid

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    # False = predefined (seeded), True = created by an employee at submission time
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # one category can be used across many expenses
    expenses: Mapped[list["Expense"]] = relationship("Expense", back_populates="category")