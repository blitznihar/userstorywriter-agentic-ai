import logging
import time
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api.routes import router as api_router
from app.logging_config import setup_logging
from fastapi.middleware.cors import CORSMiddleware

setup_logging("INFO")
logger = logging.getLogger("userstory-api")

app = FastAPI(
    title="My FastAPI App",
    version="0.1.0",
)

app.include_router(api_router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception:
        # Log exception with stack trace
        logger.exception(
            "Unhandled error",
            extra={
                "method": request.method,
                "path": request.url.path,
            },
        )
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error"},
        )

    duration_ms = (time.perf_counter() - start) * 1000

    logger.info(
        "request completed",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": round(duration_ms, 2),
        },
    )
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)