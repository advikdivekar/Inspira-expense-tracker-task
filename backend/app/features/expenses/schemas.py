from datetime import datetime
from pydantic import BaseModel, Field, model_validator

from app.features.expenses.models import ExpenseStatus
from app.features.users.schemas import UserResponse
from app.features.categories.schemas import CategoryResponse


class ExpenseCreate(BaseModel):
    user_id: str
    category_id: str | None = None       # either pick existing category
    custom_category_name: str | None = None   # or provide a new custom one
    amount: float = Field(gt=0, description="Amount must be greater than 0")
    reason: str = Field(min_length=5, description="Reason must be at least 5 characters")

    @model_validator(mode="after")
    def category_check(self) -> "ExpenseCreate":
        if not self.category_id and not self.custom_category_name:
            raise ValueError("Either category_id or custom_category_name must be provided")
        if self.category_id and self.custom_category_name:
            raise ValueError("Provide either category_id or custom_category_name, not both")
        return self


class ExpenseReview(BaseModel):
    status: ExpenseStatus
    rejection_reason: str | None = None

    @model_validator(mode="after")
    def rejection_reason_required_on_reject(self) -> "ExpenseReview":
        if self.status == ExpenseStatus.REJECTED and not self.rejection_reason:
            raise ValueError("rejection_reason is required when rejecting an expense")
        return self


class ExpenseResponse(BaseModel):
    id: str
    amount: float
    reason: str
    status: ExpenseStatus
    rejection_reason: str | None
    created_at: datetime
    updated_at: datetime
    user: UserResponse
    category: CategoryResponse

    model_config = {"from_attributes": True}