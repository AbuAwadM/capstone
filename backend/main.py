from contextlib import asynccontextmanager

from core.config import settings
from db.database import create_tables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import every module's models so SQLAlchemy knows all tables and
# relationships (e.g. Conversation.customer -> Customer) before the first query.
import modules.conversations.models  # noqa: F401
import modules.customers.models  # noqa: F401
from modules.conversations.router import router as conversations_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="Omnishop",
    description="An e-commerce platform for buying and selling products online.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # List of allowed origins for CORS
    allow_credentials=True,  # Allow credentials to be included
    allow_methods=["*"],  # Get, Post, Put, Delete, etc.
    allow_headers=[
        "*"
    ],  # Addition information about the request, such as content type, authorization, etc.
)

# All routes live under /api (e.g. /api/conversations), which is what the
# Vite dev server proxies to this backend.
app.include_router(conversations_router, prefix=settings.API_PREFIX)


@app.get("/health", include_in_schema=False)
def health():
    """Liveness check used by Render and the CI/CD smoke tests."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
