# backend/app/main.py
import sys
import asyncio
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. OS Policy Configuration cho Windows
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# 2. Router Imports
from app.core.config import settings
from app.api import stream, media

# 3. Logging & App Init
logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s")
app = FastAPI(title=settings.APP_NAME, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include Routers (Đăng ký các tuyến đường API)
app.include_router(stream.router, prefix="/api", tags=["Streaming"])
app.include_router(media.router, prefix="/api", tags=["Media"])

@app.get("/")
def root_health_check():
    return {"status": "online", "message": "TV Backend Ecosystem is running!"}