
import json
from pathlib import Path

from sqlalchemy import select

from app.db.database import Base, engine, SessionLocal
from app.db.models import Product, Order, Sale


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "data"


def load_json(filename, key):
    file_path = DATA_DIR / filename

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)[key]


def seed_database():
    Base.metadata.create_all(bind=engine)

    products = load_json("products.json", "products")
    orders = load_json("orders.json", "orders")
    sales = load_json("sales.json", "sales")

    with SessionLocal() as session:

        # Insert products
        for item in products:
            existing_product = session.scalar(
                select(Product).where(
                    Product.name == item["name"]
                )
            )

            if existing_product is None:
                session.add(
                    Product(
                        name=item["name"],
                        price=item["price"],
                        stock=item["stock"],
                    )
                )

        # Insert orders
        for item in orders:
            existing_order = session.get(
                Order,
                item["order_id"],
            )

            if existing_order is None:
                session.add(Order(**item))

        # Insert sales
        for item in sales:
            existing_sale = session.get(
                Sale,
                item["product_id"],
            )

            if existing_sale is None:
                session.add(Sale(**item))

        session.commit()

    print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()
