from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database 
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    DB_HOST: str = "db"        # "db" matches the docker-compose service name
    DB_PORT: int = 5432

    # Admin credentials (hardcoded login)
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str        # plain text in .env, compared against hash at runtime

    # JWT 
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8    # 8 hours — full workday session

    # App 
    ENVIRONMENT: str = "development"

    # Assembled from individual parts so each piece stays independently readable
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    model_config = SettingsConfigDict(
        env_file=".env",           # loads .env automatically when running locally
        env_file_encoding="utf-8",
        case_sensitive=True,       # DB_USER ≠ db_user — be explicit
    )


# Single instance imported everywhere — never instantiate Settings() again
settings = Settings()