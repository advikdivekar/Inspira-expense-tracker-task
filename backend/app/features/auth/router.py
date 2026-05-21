from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.features.auth.schemas import TokenResponse
from app.features.auth.service import login_admin


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends()):
    # OAuth2PasswordRequestForm sends username+password as form-data,
    # which is what Swagger's Authorize button posts
    token = login_admin(form.username, form.password)
    return TokenResponse(access_token=token)