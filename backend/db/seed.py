"""Fill an empty database with sample customers and conversations.

Run from the backend folder:  python -m db.seed
It does nothing if there are already conversations in the database.
"""

from datetime import UTC, datetime, timedelta

import modules.customers.models  # noqa: F401  (registers Customer for relationships)
from modules.conversations.models import Conversation
from modules.customers.models import Customer, CustomerIdentity

from db.database import SessionLocal, create_tables

# (name, initials, platform, title, minutes since last message)
SAMPLES = [
    ("John Doe", "JD", "whatsapp", "Order #12345 delayed", 15),
    ("Sara Khalil", "SK", "instagram", "Size exchange", 40),
    ("Omar Haddad", "OH", "facebook", "Payment failed", 75),
    ("Lina Nasser", "LN", "telegram", "Product availability", 60 * 20),
    ("Adam Smith", "AS", "whatsapp", "Discount code", 60 * 26),
    ("Maya Haddad", "MH", "whatsapp", "Delivery address change", 60 * 30),
    ("Emily Carter", "EC", "facebook", "Refund status", 60 * 24 * 3),
    ("Khaled Saleh", "KS", "instagram", "Gift wrapping", 60 * 24 * 5),
]


def seed() -> None:
    create_tables()
    db = SessionLocal()
    try:
        if db.query(Conversation).first() is not None:
            print("Database already has conversations; skipping seed.")
            return

        now = datetime.now(UTC)
        for name, initials, platform, title, minutes_ago in SAMPLES:
            customer = Customer(
                name=name,
                profile_picture_url=f"https://placehold.co/64?text={initials}",
            )
            customer.identities.append(
                CustomerIdentity(
                    platform=platform,
                    platform_user_id=f"{platform}-{initials.lower()}",
                    username=name,
                )
            )

            conversation = Conversation(
                customer=customer,
                title=title,
                platform=platform,
                last_message_at=now - timedelta(minutes=minutes_ago),
            )
            db.add(conversation)

        db.commit()
        print(f"Seeded {len(SAMPLES)} conversations.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
