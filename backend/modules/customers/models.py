from datetime import UTC, datetime

from db.database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship


def utc_now() -> datetime:
    return datetime.now(UTC)


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    profile_picture_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    # Relationships let you write `customer.identities` and `customer.conversations`.
    identities = relationship(
        "CustomerIdentity",
        back_populates="customer",
        cascade="all, delete-orphan",
    )
    conversations = relationship("Conversation", back_populates="customer")


class CustomerIdentity(Base):
    """Who the customer is on one messaging platform.

    One customer can message us from several platforms, so each platform
    account gets its own row. Webhooks use it to find the customer.
    """

    __tablename__ = "customer_identities"
    # The same platform account can't belong to two customers.
    __table_args__ = (UniqueConstraint("platform", "platform_user_id"),)

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    # The allowed values are listed in schemas.py (same as Conversation.platform).
    platform = Column(String(20), nullable=False)
    # The customer's ID on that platform, e.g. a WhatsApp phone number or Telegram chat ID.
    platform_user_id = Column(String(100), nullable=False)
    # The name they use on that platform, which can differ from Customer.name.
    username = Column(String(100), nullable=True)

    customer = relationship("Customer", back_populates="identities")
