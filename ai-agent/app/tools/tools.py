
from app.db.services import (
    find_product,
    find_order_status,
    get_sales_summary_service,
)


def search_catalog(product_name):
    product = find_product(product_name)

    if product is None:
        return {"error": "Product not found"}

    return {
        "name": product.name,
        "price": product.price,
        "stock": product.stock,
    }


def get_order_status(order_id, customer_id):
    order = find_order_status(order_id, customer_id)

    if order is None:
        return {"error": "Order not found or access denied"}

    return order.model_dump()


def get_sales_summary():
    summary = get_sales_summary_service()

    if summary is None:
        return {"error": "No sales data available"}

    return summary.model_dump()
