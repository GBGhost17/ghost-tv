import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "TV Home Ecosystem API"
    PORT: int = 8000
    DEBUG: bool = True

    EXTERNAL_CONTENT_API_URL: str = "https://phim.nguonc.com/api/films"
    EMBED_STREAM_URL: str = "https://embed.streamc.xyz/embed.php"
    API_TIMEOUT: float = 10.0

    STREAM_CACHE_TTL: int = 14400
    STREAM_CACHE_MAXSIZE: int = 200

    DATABASE_URL: str = "postgresql://user:password@localhost:5432/ghost_tv"
    JWT_SECRET_KEY: str = "supper_secret_key_do_not_share"
    CORS_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
