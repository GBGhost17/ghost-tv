# backend/app/api/media.py
import httpx
import logging
from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/movies")
async def get_movies(page: int = 1):
    url = f"{settings.EXTERNAL_CONTENT_API_URL}/phim-moi-cap-nhat?page={page}"
    try:
        async with httpx.AsyncClient(timeout=settings.API_TIMEOUT) as client:
            response = await client.get(url)
            if response.status_code == 200:
                return response.json()
            raise HTTPException(status_code=response.status_code, detail="Lỗi từ nguồn phim ngoài.")
    except Exception as e:
        logger.error(f"Lỗi lấy danh sách phim: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/movies/genre/{slug}")
async def get_movies_by_genre(slug: str, page: int = Query(1, ge=1)):
    url = f"{settings.EXTERNAL_CONTENT_API_URL}/the-loai/{slug}?page={page}"
    try:
        async with httpx.AsyncClient(timeout=settings.API_TIMEOUT) as client:
            response = await client.get(url)
            # Nếu nguồn trả về 200 thì lấy data, ngược lại trả về items rỗng để app không crash
            if response.status_code == 200:
                return response.json()
            return {"items": []}
    except Exception:
        return {"items": []}

@router.get("/movies/country/{slug}")
async def get_movies_by_country(slug: str, page: int = Query(1, ge=1)):
    url = f"{settings.EXTERNAL_CONTENT_API_URL}/quoc-gia/{slug}?page={page}"
    try:
        async with httpx.AsyncClient(timeout=settings.API_TIMEOUT) as client:
            response = await client.get(url)
            if response.status_code == 200:
                return response.json()
            return {"items": []}
    except Exception:
        return {"items": []}