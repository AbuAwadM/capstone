
from pydantic import BaseModel, ConfigDict


class ProductSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: float
    stock: int


class OrderStatusSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    order_id: str
    product: str
    status: str


class SalesSummarySchema(BaseModel):
    total_revenue: float
    currency: str
    total_units_sold: int
    best_selling_product: str
    best_selling_quantity: int
    least_selling_product: str
    least_selling_quantity: int
