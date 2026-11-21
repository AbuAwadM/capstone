
import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from tools import search_catalog, get_order_status, get_sales_summary

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    raise ValueError("OpenRouter API key not found!")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key
)

MODEL = "openrouter/free"

# Local demo identities only.
# In production, the backend must authenticate the user.
DEMO_ROLE = "owner"
DEMO_CUSTOMER_ID = "CUST-001"

tools = [
    {
        "type": "function",
        "function": {
            "name": "search_catalog",
            "description": "Search products by name, price, and stock.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_name": {
                        "type": "string"
                    }
                },
                "required": ["product_name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_order_status",
            "description": "Get the status of the current customer's order.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "string"
                    }
                },
                "required": ["order_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_sales_summary",
            "description": (
                "Analyze store sales and identify the best-selling "
                "and least-selling products."
            ),
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    }
]

messages = [
    {
        "role": "system",
        "content": (
            "You are the OmniShop AI Agent. "
            "Answer questions using system data. "
            "Use search_catalog for product information. "
            "Use get_order_status for customer order tracking. "
            "Use get_sales_summary for internal sales analysis. "
            "Never invent prices, inventory, order statuses, or sales. "
            "Do not reveal internal sales data to customers."
        )
    }
]

print("OmniShop AI Agent is running!")
print("Type 'exit' to stop.\n")

while True:
    user_input = input("You: ").strip()

    if user_input.lower() == "exit":
        print("Agent stopped.")
        break

    if not user_input:
        continue

    messages.append({
        "role": "user",
        "content": user_input
    })

    try:
        # Only expose internal analytics to authorized roles.
        available_tools = [
            tool for tool in tools
            if DEMO_ROLE == "owner"
            or tool["function"]["name"] != "get_sales_summary"
        ]

        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=available_tools,
            tool_choice="auto"
        )

        assistant_message = response.choices[0].message
        messages.append(assistant_message)

        if assistant_message.tool_calls:

            for tool_call in assistant_message.tool_calls:

                name = tool_call.function.name
                arguments = json.loads(
                    tool_call.function.arguments
                )

                if name == "search_catalog":
                    result = search_catalog(
                        arguments["product_name"]
                    )

                elif name == "get_order_status":
                    result = get_order_status(
                        arguments["order_id"],
                        DEMO_CUSTOMER_ID
                    )

                elif name == "get_sales_summary":
                    if DEMO_ROLE == "owner":
                        result = get_sales_summary()
                    else:
                        result = {"error": "Access denied"}

                else:
                    result = {"error": "Unknown tool"}

                print("Tool called:", name)

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result)
                })

            final_response = client.chat.completions.create(
                model=MODEL,
                messages=messages
            )

            answer = final_response.choices[0].message.content
            messages.append({
                "role": "assistant",
                "content": answer
            })

        else:
            answer = assistant_message.content

        print("\nAgent:", answer, "\n")

    except Exception as error:
        print("Error:", error)
        messages = [messages[0]]
