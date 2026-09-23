import time
import logging
from playwright.sync_api import sync_playwright
from app.core.config import settings

logger = logging.getLogger(__name__)

class ScraperService:
    @staticmethod
    def extract_video_link(hash_code: str) -> str:
        """Hàm đồng bộ chạy trong Worker Thread để bóc tách link video"""
        embed_url = f"{settings.EMBED_STREAM_URL}?hash={hash_code}"
        
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,  # Đang để chạy ngầm, bạn có thể đổi thành False nếu muốn xem nó tự click
                args=[
                    '--disable-blink-features=AutomationControlled', 
                    '--no-sandbox', 
                    '--disable-gpu'
                ]
            )
            
            # [QUAN TRỌNG]: Khôi phục cấu hình Viewport để tính tọa độ Click
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                viewport={"width": 1920, "height": 1080}
            )
            page = context.new_page()
            extracted_url = None
            
            # Bộ lọc Network Request nghiêm ngặt
            def handle_request(request):
                nonlocal extracted_url
                url = request.url
                if "ping.gif" in url or "jwpltx.com" in url:
                    return
                if url.startswith("https://raw.githubusercontent.com/") and ".mp4" in url:
                    extracted_url = url
                elif ".m3u8" in url:
                    extracted_url = url
            
            page.on("request", handle_request)
            
            logger.info(f"Đang tải trang embed: {embed_url}")
            page.goto(embed_url, wait_until="domcontentloaded")
            
            # [QUAN TRỌNG]: Khôi phục Simulated Interaction (Giả lập tương tác)
            try:
                logger.info("Chờ 3 giây để hệ thống qua mặt Cloudflare & Load JW Player...")
                time.sleep(3)
                
                logger.info("Thực hiện Click giả lập vào giữa màn hình để đánh thức luồng video...")
                page.mouse.click(960, 540)
            except Exception as click_err:
                logger.warning(f"Cảnh báo khi click giả lập: {click_err}")
            
            # Vòng lặp chờ (Polling) liên tục
            for _ in range(30):
                if extracted_url:
                    logger.info(f"Đã tóm gọn luồng video: {extracted_url}")
                    break
                time.sleep(0.5)
            
            browser.close()
            return extracted_url