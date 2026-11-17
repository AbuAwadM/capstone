from typing import Annotated

from db.database import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from modules.conversations.models import Conversation
from modules.conversations.schemas import ConversationOut

DbSession = Annotated[Session, Depends(get_db)]

router = APIRouter(
    prefix="/conversations",
    tags=["conversations"],
)


@router.get("", response_model=list[ConversationOut])
def list_conversations(db: DbSession):
    """Inbox list: every conversation with its customer, newest activity first."""
    return (
        db.query(Conversation)
        .options(joinedload(Conversation.customer))
        .order_by(Conversation.last_message_at.desc())
        .all()
    )

