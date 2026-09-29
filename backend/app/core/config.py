import json
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    # App Configuration
    APP_NAME: str = "GHOST TV"
    PORT: int = 8000
    DEBUG: bool = True

    # External API Providers 
    EXTERNAL_CONTENT_API_URL: str
    EMBED_STREAM_URL: str
    RAW_VIDEO_URL_PREFIX: str = ""
    API_TIMEOUT: float = 10.0

    # Stream Scraper Cache Settings
    STREAM_CACHE_TTL: int = 14400
    STREAM_CACHE_MAXSIZE: int = 200

    # Security & Database
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    CORS_ORIGINS: List[str] = ["*"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=(str(BASE_DIR / ".env"), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
