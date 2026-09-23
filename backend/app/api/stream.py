
import logging
from fastapi import APIRouter, HTTPException
from cachetools import TTLCache
from app.core.config import settings
from app.services.scraper_service import ScraperService

logger = logging.getLogger(__name__)

# Khởi tạo Router riêng cho mảng stream
router = APIRouter()

# Cache lưu trữ link
stream_cache = TTLCache(maxsize=settings.STREAM_CACHE_MAXSIZE, ttl=settings.STREAM_CACHE_TTL)

@router.get("/stream")
def get_stream_url(hash: str):
    if hash in stream_cache:
        logger.info(f"[CACHE HIT] {hash}")
        return {"status": "success", "source": "cache", "stream_url": stream_cache[hash]}

    try:
        logger.info(f"[CACHE MISS] Processing: {hash}")
        # Chuyển việc nặng cho Service xử lý
        extracted_url = ScraperService.extract_video_link(hash)
        
        if extracted_url:
            stream_cache[hash] = extracted_url
            source_type = "github" if ".mp4" in extracted_url else "hls"
            return {"status": "success", "source": f"playwright_worker_{source_type}", "stream_url": extracted_url}
        else:
            raise HTTPException(status_code=404, detail="Không bắt được link video.")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"System Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")