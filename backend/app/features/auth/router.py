from fastapi import APIRouter

from app.features.auth.schemas import LoginRequest, TokenResponse
from app.features.auth.service import login_admin


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    token = login_admin(body.username, body.password)
    return TokenResponse(access_token=token)