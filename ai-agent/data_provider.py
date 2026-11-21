
import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent


def load_json(filename):
    file_path = BASE_DIR / filename

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def get_products():
    data = load_json("products.json")
    return data["products"]


def get_orders():
    data = load_json("orders.json")
    return data["orders"]


def get_sales():
    data = load_json("sales.json")
    return data["sales"]
