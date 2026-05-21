import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Float, DateTime, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.database import Base


class ExpenseStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    category_id: Mapped[str] = mapped_column(
        String, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False
    )
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ExpenseStatus] = mapped_column(
        SAEnum(ExpenseStatus), default=ExpenseStatus.PENDING, nullable=False, index=True
    )
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user: Mapped["User"] = relationship("User", back_populates="expenses")
    category: Mapped["Category"] = relationship("Category", back_populates="expenses")
    notification: Mapped["Notification | None"] = relationship(
        "Notification", back_populates="expense", uselist=False
    )