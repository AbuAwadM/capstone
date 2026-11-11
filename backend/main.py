from backend import main
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings

app = FastAPI(
    title="Omnishop",
    description="An e-commerce platform for buying and selling products online.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # List of allowed origins for CORS
    allow_credentials=True,  # Alloe credentials to be included
    allow_methods=["*"],  # Get, Post, Put, Delete, etc.
    allow_headers=[
        "*"
    ],  # Addition information about the request, such as content type, authorization, etc.
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
