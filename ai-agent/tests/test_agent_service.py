
from types import SimpleNamespace
from unittest.mock import patch

from app.agent.service import ask_agent
from app.tools.tools import get_order_status


def mock_tool_call(name, arguments):
    return SimpleNamespace(
        id="call_123",
        function=SimpleNamespace(
            name=name,
            arguments=arguments,
        ),
    )


def mock_response(content=None, tool_calls=None):
    message = SimpleNamespace(
        content=content,
        tool_calls=tool_calls,
    )

    return SimpleNamespace(
        choices=[
            SimpleNamespace(message=message)
        ]
    )


def test_general_greeting():
    response = mock_response(
        content="Hello! How can I help you today?"
    )

    with patch(
        "app.agent.service.client.chat.completions.create",
        return_value=response,
    ) as api_mock:

        answer = ask_agent(
            "Hello",
            "customer",
            "CUST-001",
        )

        assert "Hello!" in answer
        assert api_mock.call_count == 1


def test_product_search():
    first_response = mock_response(
        tool_calls=[
            mock_tool_call(
                "search_catalog",
                '{"product_name": "Linen throw blanket"}',
            )
        ]
    )

    with patch(
        "app.agent.service.client.chat.completions.create",
        return_value=first_response,
    ) as api_mock, patch(
        "app.agent.service.search_catalog",
        return_value={
            "name": "Linen throw blanket",
            "price": 68,
            "stock": 14,
        },
    ) as search_mock:

        answer = ask_agent(
            "What is the price of Linen throw blanket?",
            "customer",
            "CUST-001",
        )

        search_mock.assert_called_once_with(
            "Linen throw blanket"
        )

        assert api_mock.call_count == 1
        assert "Linen throw blanket" in answer
        assert "$68.00" in answer
        assert "14 units" in answer

def test_owner_sales_analysis():
    with patch(
        "app.agent.service.client.chat.completions.create",
    ) as api_mock, patch(
        "app.agent.service.get_sales_summary",
        return_value={
            "total_revenue": 4320.0,
            "currency": "USD",
            "total_units_sold": 85,
            "best_selling_product": "Linen throw blanket",
            "best_selling_quantity": 45,
            "least_selling_product": "Leather card wallet",
        },
    ) as sales_mock:

        answer = ask_agent(
            "Give me a sales summary including total revenue.",
            "owner",
        )

        sales_mock.assert_called_once_with()
        api_mock.assert_not_called()

        assert "4,320.00 USD" in answer
        assert "85" in answer
        assert "Linen throw blanket" in answer

def test_customer_cannot_access_sales_tool():
    with patch(
        "app.agent.service.client.chat.completions.create",
    ) as api_mock, patch(
        "app.agent.service.get_sales_summary",
    ) as sales_mock:

        answer = ask_agent(
            "What is the total sales revenue?",
            "customer",
            "CUST-001",
        )

        sales_mock.assert_not_called()
        api_mock.assert_not_called()

        assert "not available" in answer.lower()

def test_customer_cannot_force_sales_tool_call():
    from app.agent.service import execute_tool

    with patch(
        "app.agent.service.get_sales_summary",
    ) as sales_mock:

        result = execute_tool(
            "get_sales_summary",
            {},
            "customer",
            "CUST-001",
        )

        sales_mock.assert_not_called()

        assert result == {
            "error": "Access denied"
        }

def test_customer_cannot_access_another_order():
    with patch(
        "app.agent.service.client.chat.completions.create",
    ) as api_mock, patch(
        "app.agent.service.get_order_status",
        return_value={
            "error": "Order not found or access denied",
        },
    ) as order_mock:

        answer = ask_agent(
            "Where is order ORD-1002?",
            "customer",
            "CUST-001",
        )

        order_mock.assert_called_once_with(
            "ORD-1002",
            "CUST-001",
        )

        api_mock.assert_not_called()

        assert "couldn't retrieve verified information" in answer.lower()

def test_customer_can_access_own_order():
    result = get_order_status(
        "ORD-1001",
        "CUST-001",
    )

    assert result["order_id"] == "ORD-1001"
    assert result["status"] == "Shipped"


def test_customer_cannot_access_other_customer_order():
    result = get_order_status(
        "ORD-1002",
        "CUST-001",
    )

    assert result == {
        "error": "Order not found or access denied"
    }


def test_customer_cannot_access_nonexistent_order():
    result = get_order_status(
        "ORD-9999",
        "CUST-001",
    )

    assert result == {
        "error": "Order not found or access denied"
    }


def test_invalid_tool_json():
    first_response = mock_response(
        tool_calls=[
            mock_tool_call(
                "search_catalog",
                "{invalid json",
            )
        ]
    )

    with patch(
        "app.agent.service.client.chat.completions.create",
        return_value=first_response,
    ) as api_mock, patch(
        "app.agent.service.search_catalog",
    ) as search_mock:

        answer = ask_agent(
            "What is the product price?",
            "customer",
            "CUST-001",
        )

        search_mock.assert_not_called()

        assert "couldn't retrieve verified information" in answer.lower()
        assert api_mock.call_count == 1


def test_missing_product_name():
    first_response = mock_response(
        tool_calls=[
            mock_tool_call(
                "search_catalog",
                "{}",
            )
        ]
    )

    with patch(
        "app.agent.service.client.chat.completions.create",
        return_value=first_response,
    ) as api_mock, patch(
        "app.agent.service.search_catalog",
    ) as search_mock:

        answer = ask_agent(
            "What is the product price?",
            "customer",
            "CUST-001",
        )

        search_mock.assert_not_called()

        assert "couldn't retrieve verified information" in answer.lower()
        assert api_mock.call_count == 1

def test_owner_can_access_sales_summary():
    with patch(
        "app.agent.service.client.chat.completions.create",
    ) as api_mock, patch(
        "app.agent.service.get_sales_summary",
        return_value={
            "total_revenue": 4320.0,
            "currency": "USD",
            "total_units_sold": 85,
            "best_selling_product": "Linen throw blanket",
        },
    ) as sales_mock:

        answer = ask_agent(
            "Give me total revenue and total units sold.",
            "owner",
        )

        sales_mock.assert_called_once_with()
        api_mock.assert_not_called()

        assert "4,320.00" in answer
        assert "85" in answer
