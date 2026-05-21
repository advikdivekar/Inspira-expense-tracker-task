from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.features.auth.router import router as auth_router
from app.features.users.router import router as users_router
from app.features.categories.router import router as categories_router
from app.features.expenses.router import router as expenses_router
from app.features.notifications.router import router as notifications_router


app = FastAPI(
    title="Expense Tracker API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# CORS — allows the React frontend origin to talk to this API
# in production replace "*" with your actual frontend domain
ALLOWED_ORIGINS = [
    "http://localhost:5173",   # Vite dev server
    "http://localhost:80",     # nginx in prod
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# all routers mounted under /api so frontend calls /api/expenses, /api/auth etc.
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(categories_router, prefix="/api")
app.include_router(expenses_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}