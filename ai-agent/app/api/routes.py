
import os
import secrets

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field
from openai import (
    APIConnectionError,
    APITimeoutError,
    APIStatusError
)

from app.agent.service import ask_agent

load_dotenv()

app = FastAPI(title="OmniShop AI Agent API")

INTERNAL_API_KEY = os.getenv("AGENT_INTERNAL_API_KEY")

if not INTERNAL_API_KEY:
    raise RuntimeError(
        "AGENT_INTERNAL_API_KEY is not configured"
    )


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    role: str
    customer_id: str | None = None


api_key_header = APIKeyHeader(
    name="X-Agent-Key",
    auto_error=False
)


def verify_internal_key(
    x_agent_key: str | None = Depends(api_key_header)
):
    if (
        not x_agent_key
        or not secrets.compare_digest(
            x_agent_key,
            INTERNAL_API_KEY
        )
    ):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized API request"
        )

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post(
    "/agent/chat",
    dependencies=[Depends(verify_internal_key)]
)
def agent_chat(request: ChatRequest):

    if request.role not in ("owner", "customer"):
        raise HTTPException(
            status_code=403,
            detail="Invalid role"
        )

    if request.role == "customer" and not request.customer_id:
        raise HTTPException(
            status_code=403,
            detail="Customer identity required"
        )

    try:
        answer = ask_agent(
            message=request.message,
            role=request.role,
            customer_id=request.customer_id
        )

        return {"reply": answer}

    except APITimeoutError:
        raise HTTPException(
            status_code=504,
            detail="AI service timed out"
        )

    except APIConnectionError:
        raise HTTPException(
            status_code=503,
            detail="AI service connection failed"
        )

    except APIStatusError:
        raise HTTPException(
            status_code=502,
            detail="AI provider returned an error"
        )

    except (ValueError, KeyError, TypeError):
        raise HTTPException(
            status_code=502,
            detail="AI response could not be processed"
        )
