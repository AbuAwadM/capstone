
from sqlalchemy import select

from app.db.database import SessionLocal
from app.db.models import Product, Order, Sale
from app.db.schemas import (
    ProductSchema,
    OrderStatusSchema,
    SalesSummarySchema,
)


def find_product(product_name: str):
    if not isinstance(product_name, str) or not product_name.strip():
        return None

    with SessionLocal() as session:
        product = session.scalar(
            select(Product).where(
                Product.name.ilike(f"%{product_name}%")
            )
        )

        if product is None:
            return None

        return ProductSchema.model_validate(product)


def find_order_status(order_id: str, customer_id: str):
    if not isinstance(order_id, str) or not order_id.strip():
        return None

    if not isinstance(customer_id, str) or not customer_id.strip():
        return None

    with SessionLocal() as session:
        order = session.scalar(
            select(Order).where(
                Order.order_id == order_id,
                Order.customer_id == customer_id
            )
        )

        if order is None:
            return None

        return OrderStatusSchema.model_validate(order)


def get_sales_summary_service():
    with SessionLocal() as session:
        sales = session.scalars(
            select(Sale)
        ).all()

        if not sales:
            return None

        total_revenue = sum(
            item.quantity_sold * item.unit_price
            for item in sales
        )

        total_units_sold = sum(
            item.quantity_sold
            for item in sales
        )

        best_selling = max(
            sales,
            key=lambda item: item.quantity_sold
        )

        least_selling = min(
            sales,
            key=lambda item: item.quantity_sold
        )

        return SalesSummarySchema(
            total_revenue=round(total_revenue, 2),
            currency="USD",
            total_units_sold=total_units_sold,
            best_selling_product=best_selling.product_name,
            best_selling_quantity=best_selling.quantity_sold,
            least_selling_product=least_selling.product_name,
            least_selling_quantity=least_selling.quantity_sold
        )
