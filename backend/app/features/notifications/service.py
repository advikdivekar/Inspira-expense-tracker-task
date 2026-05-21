import uuid

from sqlalchemy.orm import Session

from app.features.notifications.models import Notification


def create_notification(db: Session, user_id: str, expense_id: str, message: str) -> Notification:
    notification = Notification(
        id=str(uuid.uuid4()),
        user_id=user_id,
        expense_id=expense_id,
        message=message,
        is_read=False,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_notifications_by_user(db: Session, user_id: str) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def mark_notification_read(db: Session, notification_id: str, user_id: str | None = None) -> Notification:
    query = db.query(Notification).filter(Notification.id == notification_id)
    if user_id is not None:
        query = query.filter(Notification.user_id == user_id)
    notification = query.first()
    if not notification:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


def get_unread_count(db: Session, user_id: str) -> int:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .count()
    )