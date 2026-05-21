from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.features.notifications.schemas import NotificationResponse, NotificationMarkRead
from app.features.notifications import service


router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/user/{user_id}", response_model=list[NotificationResponse])
def get_notifications(user_id: str, db: Session = Depends(get_db)):
    # employee polls this to check for new notifications
    return service.get_notifications_by_user(db, user_id)


@router.get("/user/{user_id}/unread-count")
def get_unread_count(user_id: str, db: Session = Depends(get_db)):
    count = service.get_unread_count(db, user_id)
    return {"unread_count": count}


@router.patch("/read", response_model=NotificationResponse)
def mark_as_read(data: NotificationMarkRead, db: Session = Depends(get_db)):
    # employee marks a notification as read after seeing it
    # user_id comes from the body here — in a real auth system it would come from the token
    from app.features.notifications.schemas import NotificationMarkRead
    return service.mark_notification_read(db, data.notification_id, user_id=None)