from datetime import UTC, datetime
from typing import Annotated, Literal

from pydantic import AfterValidator, BaseModel, ConfigDict, Field

# Allowed values for the string columns in models.py.
# The database stores plain strings; these types reject anything else
# before it reaches the database.
Platform = Literal["whatsapp", "instagram", "facebook", "telegram"]
ConversationStatus = Literal["open", "pending", "closed"]
AIMode = Literal["review_first", "auto_send"]
Sender = Literal["customer", "agent"]

# SQLite doesn't keep timezone info, so times come back "naive".
# They are always stored in UTC, so mark them as UTC; the JSON then ends
# with "+00:00" and the browser converts it to the user's local time.
UTCDateTime = Annotated[
    datetime,
    AfterValidator(lambda d: d.replace(tzinfo=UTC) if d.tzinfo is None else d),
]


class ORMModel(BaseModel):
    # Lets a schema be built straight from a database object,
    # e.g. ConversationOut.model_validate(conversation).
    model_config = ConfigDict(from_attributes=True)


# ---------- Messages ----------


class MessageCreate(BaseModel):
    """Body of a reply sent from the Agent Console.

    The sender isn't sent by the frontend: replies from the console
    are always from the agent, and the server sets it.
    """

    text: str = Field(min_length=1)


class MessageOut(ORMModel):
    id: int
    conversation_id: int
    sender: Sender
    text: str
    created_at: UTCDateTime


# ---------- Conversations ----------


class CustomerSummary(ORMModel):
    """The customer fields the inbox and conversation header show."""

    id: int
    name: str
    profile_picture_url: str | None = None


class ConversationCreate(BaseModel):
    customer_id: int
    title: str = Field(min_length=1, max_length=200)
    platform: Platform
    status: ConversationStatus = "open"
    ai_mode: AIMode = "review_first"


class ConversationUpdate(BaseModel):
    """Changes from the conversation header: status, AI mode, Pause AI and Resolve.

    Every field is optional, so the frontend only sends what changed
    (Resolve is just {"status": "closed"}).
    """

    title: str | None = Field(default=None, min_length=1, max_length=200)
    status: ConversationStatus | None = None
    ai_mode: AIMode | None = None
    ai_paused: bool | None = None


class ConversationOut(ORMModel):
    """One row in the inbox list."""

    id: int
    title: str
    platform: Platform
    status: ConversationStatus
    ai_mode: AIMode
    ai_paused: bool
    last_message_at: UTCDateTime
    customer: CustomerSummary


class ConversationDetail(ConversationOut):
    """An open conversation: everything in the inbox row plus its messages."""

    messages: list[MessageOut]
