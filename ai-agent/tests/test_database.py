
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.db.database import Base
from app.db.models import Order


def test_order_belongs_to_correct_customer():
    # Temporary database for this test only
    engine = create_engine("sqlite:///:memory:")

    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        session.add(
            Order(
                order_id="ORD-TEST-1",
                customer_id="CUST-001",
                customer_name="Test Customer",
                product="Linen throw blanket",
                quantity=1,
                total=68.0,
                currency="USD",
                status="Shipped",
            )
        )
        session.commit()

        correct_customer_order = session.get(
            Order,
            "ORD-TEST-1",
        )

        assert correct_customer_order.customer_id == "CUST-001"

        wrong_customer_orders = session.query(Order).filter_by(
            order_id="ORD-TEST-1",
            customer_id="CUST-002",
        ).all()

        assert wrong_customer_orders == []

    engine.dispose()
