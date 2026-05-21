from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.features.expenses.models import ExpenseStatus
from app.features.expenses.schemas import ExpenseCreate, ExpenseReview, ExpenseResponse
from app.features.expenses import service


router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("", response_model=ExpenseResponse, status_code=201)
def submit_expense(data: ExpenseCreate, db: Session = Depends(get_db)):
    # employees submit expenses, no auth required
    return service.submit_expense(db, data)


@router.get("", response_model=list[ExpenseResponse])
def get_all_expenses(
    status: ExpenseStatus | None = Query(default=None, description="Filter by status"),
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    # manager sees all expenses, optionally filtered by status
    return service.get_all_expenses(db, status_filter=status)


@router.get("/user/{user_id}", response_model=list[ExpenseResponse])
def get_expenses_by_user(user_id: str, db: Session = Depends(get_db)):
    # employee checks their own expenses
    return service.get_expenses_by_user(db, user_id)


@router.patch("/{expense_id}/review", response_model=ExpenseResponse)
def review_expense(
    expense_id: str,
    data: ExpenseReview,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    # only manager can approve or reject
    return service.review_expense(db, expense_id, data)