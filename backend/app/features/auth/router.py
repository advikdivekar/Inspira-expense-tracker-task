from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.features.auth.schemas import LoginRequest, TokenResponse
from app.features.auth.service import login_admin


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    token = login_admin(body.username, body.password)
    return TokenResponse(access_token=token)


@router.post("/token", response_model=TokenResponse, include_in_schema=False)
def login_form(form: OAuth2PasswordRequestForm = Depends()):
    token = login_admin(form.username, form.password)
    return TokenResponse(access_token=token)