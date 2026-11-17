from datetime import UTC, datetime

from db.database import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


def utc_now() -> datetime:
    return datetime.now(UTC)


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    title = Column(String(200), nullable=False)
    # The allowed values for these string columns are listed in schemas.py.
    platform = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False, default="open")
    ai_mode = Column(String(20), nullable=False, default="review_first")
    ai_paused = Column(Boolean, nullable=False, default=False)
    # Stored on the conversation so the inbox can sort without reading every message.
    last_message_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    # Relationships let you write `conversation.customer` and `conversation.messages`.
    customer = relationship("Customer", back_populates="conversations")
    messages = relationship(
        "Message",
        back_populates="conversation",
        order_by="Message.id",
        cascade="all, delete-orphan",
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender = Column(String(20), nullable=False)  # "customer" or "agent"
    text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    conversation = relationship("Conversation", back_populates="messages")
