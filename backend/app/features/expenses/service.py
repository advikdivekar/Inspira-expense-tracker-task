import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.features.expenses.models import Expense, ExpenseStatus
from app.features.expenses.schemas import ExpenseCreate, ExpenseReview
from app.features.categories.service import get_category_by_id, get_or_create_custom_category
from app.features.users.service import get_user_by_id
from app.features.notifications.service import create_notification


def submit_expense(db: Session, data: ExpenseCreate) -> Expense:
    # validate user exists
    get_user_by_id(db, data.user_id)

    # resolve category — either existing or new custom one
    if data.category_id:
        category = get_category_by_id(db, data.category_id)
    else:
        category = get_or_create_custom_category(db, data.custom_category_name)

    expense = Expense(
        id=str(uuid.uuid4()),
        user_id=data.user_id,
        category_id=category.id,
        amount=data.amount,
        reason=data.reason,
        status=ExpenseStatus.PENDING,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)

    # reload with relationships for the response
    return _load_expense(db, expense.id)


def get_all_expenses(db: Session, status_filter: ExpenseStatus | None = None) -> list[Expense]:
    query = db.query(Expense).options(
        joinedload(Expense.user),
        joinedload(Expense.category),
    )
    if status_filter:
        query = query.filter(Expense.status == status_filter)
    return query.order_by(Expense.created_at.desc()).all()


def get_expenses_by_user(db: Session, user_id: str) -> list[Expense]:
    get_user_by_id(db, user_id)
    return db.query(Expense).options(
        joinedload(Expense.user),
        joinedload(Expense.category),
    ).filter(Expense.user_id == user_id).order_by(Expense.created_at.desc()).all()


def review_expense(db: Session, expense_id: str, data: ExpenseReview) -> Expense:
    expense = _load_expense(db, expense_id)

    if expense.status != ExpenseStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Expense is already {expense.status.value}, cannot review again",
        )

    expense.status = data.status
    expense.rejection_reason = data.rejection_reason if data.status == ExpenseStatus.REJECTED else None

    db.commit()
    db.refresh(expense)

    # create notification for the employee after manager reviews
    if data.status == ExpenseStatus.APPROVED:
        message = f"Your expense of ₹{expense.amount:.2f} has been approved."
    else:
        message = f"Your expense of ₹{expense.amount:.2f} was rejected. Reason: {data.rejection_reason}"

    create_notification(db, user_id=expense.user_id, expense_id=expense.id, message=message)

    return _load_expense(db, expense.id)


def _load_expense(db: Session, expense_id: str) -> Expense:
    expense = db.query(Expense).options(
        joinedload(Expense.user),
        joinedload(Expense.category),
    ).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense {expense_id} not found",
        )
    return expense