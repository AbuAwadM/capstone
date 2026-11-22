
import json
import os

from dotenv import load_dotenv
from openai import OpenAI

from app.tools.tools import (
    search_catalog,
    get_order_status,
    get_sales_summary,
)

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise ValueError("OPENROUTER_API_KEY is not configured")


client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
    timeout=30.0,
)

MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")


PRODUCT_TOOL = {
    "type": "function",
    "function": {
        "name": "search_catalog",
        "description": (
            "Search the OmniShop product catalog and retrieve "
            "verified product information, prices, and stock."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "product_name": {
                    "type": "string"
                }
            },
            "required": ["product_name"],
        },
    },
}


ORDER_TOOL = {
    "type": "function",
    "function": {
        "name": "get_order_status",
        "description": (
            "Retrieve the authenticated customer's order status."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string"
                }
            },
            "required": ["order_id"],
        },
    },
}


SALES_TOOL = {
    "type": "function",
    "function": {
        "name": "get_sales_summary",
        "description": (
            "Retrieve private sales statistics for the "
            "authenticated store owner only."
        ),
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
}


SYSTEM_PROMPT = """
You are OmniShop's professional AI sales assistant.

Your responsibilities:
- Welcome customers naturally.
- Answer general shopping questions.
- Help customers identify suitable products.
- Ask useful questions about preferences and budget.
- Explain verified product details clearly.
- Help authenticated customers check their own orders.
- Provide sales summaries only to authorized owners.

Rules:
- Be friendly, helpful, and professional.
- Respond in the same language as the user.
- Never invent products, prices, stock, discounts, or policies.
- Use authorized tools for store-specific information.
- Never reveal private sales information to customers.
- Never reveal another customer's order information.
- Never create orders or process payments.
- Never promise discounts or delivery dates.
- If information cannot be verified, explain that clearly.
"""


VERIFICATION_FAILURE = (
    "I couldn't retrieve verified information "
    "from OmniShop for this request."
)

ACCESS_DENIED = (
    "Sorry, this information is not available "
    "for your account."
)


def execute_tool(name, arguments, role, customer_id):
    """
    Execute an authorized tool using server-side role checks.
    """

    if name == "search_catalog":
        product_name = arguments.get("product_name")

        if (
            not isinstance(product_name, str)
            or not product_name.strip()
        ):
            return {"error": "Invalid product name"}

        return search_catalog(product_name.strip())

    if name == "get_order_status":
        if role != "customer" or not customer_id:
            return {"error": "Access denied"}

        order_id = arguments.get("order_id")

        if (
            not isinstance(order_id, str)
            or not order_id.strip()
        ):
            return {"error": "Invalid order ID"}

        return get_order_status(
            order_id.strip(),
            customer_id,
        )

    if name == "get_sales_summary":
        if role != "owner":
            return {"error": "Access denied"}

        return get_sales_summary()

    return {"error": "Unknown or unauthorized tool"}


def ask_agent(message, role, customer_id=None):
    """
    Process a customer or owner message securely.
    """

    if role not in ("customer", "owner"):
        raise ValueError("Invalid role")

    if not isinstance(message, str) or not message.strip():
        raise ValueError("Invalid message")

    if role == "customer" and not customer_id:
        raise ValueError("Customer identity required")

    available_tools = [PRODUCT_TOOL]

    if role == "customer":
        available_tools.append(ORDER_TOOL)
    else:
        available_tools.append(SALES_TOOL)

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": message.strip(),
        },
    ]

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        tools=available_tools,
        tool_choice="auto",
    )

    if not response.choices:
        return VERIFICATION_FAILURE

    assistant_message = response.choices[0].message
    tool_calls = assistant_message.tool_calls or []

    if not tool_calls:
        answer = assistant_message.content

        if not isinstance(answer, str) or not answer.strip():
            return VERIFICATION_FAILURE

        return answer.strip()

    messages.append(assistant_message)

    for tool_call in tool_calls:
        try:
            arguments = json.loads(
                tool_call.function.arguments
            )

            if not isinstance(arguments, dict):
                return VERIFICATION_FAILURE

        except (json.JSONDecodeError, TypeError, ValueError):
            return VERIFICATION_FAILURE

        result = execute_tool(
            tool_call.function.name,
            arguments,
            role,
            customer_id,
        )

        if isinstance(result, dict) and "error" in result:
            return VERIFICATION_FAILURE

        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result),
        })

    final_response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
    )

    if not final_response.choices:
        return VERIFICATION_FAILURE

    answer = final_response.choices[0].message.content

    if not isinstance(answer, str) or not answer.strip():
        return VERIFICATION_FAILURE

    return answer.strip()
