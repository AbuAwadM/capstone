
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

    final_response = mock_response(
        content="The price is $68."
    )

    with patch(
        "app.agent.service.client.chat.completions.create",
        side_effect=[first_response, final_response],
    ) as api_mock, patch(
        "app.agent.service.search_catalog",
        return_value={
            "name": "Linen throw blanket",
            "price": 68,
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

        assert api_mock.call_count == 2
        assert "$68" in answer


def test_owner_sales_analysis():
    first_response = mock_response(
        tool_calls=[
            mock_tool_call(
                "get_sales_summary",
                "{}",
            )
        ]
    )

    final_response = mock_response(
        content="Best-selling: Linen throw blanket, 45 units."
    )

    with patch(
        "app.agent.service.client.chat.completions.create",
        side_effect=[first_response, final_response],
    ) as api_mock, patch(
        "app.agent.service.get_sales_summary",
        return_value={
            "best_selling": "Linen throw blanket",
        },
    ) as sales_mock:

        answer = ask_agent(
            "What is the best-selling product?",
            "owner",
            None,
        )

        sales_mock.assert_called_once_with()

        assert api_mock.call_count == 2
        assert "Linen throw blanket" in answer


def test_customer_cannot_access_sales_tool():
    response = mock_response(
        content="I cannot verify this information."
    )

    with patch(
        "app.agent.service.client.chat.completions.create",
        return_value=response,
    ) as api_mock, patch(
        "app.agent.service.get_sales_summary",
    ) as sales_mock:

        answer = ask_agent(
            "What is the total sales revenue?",
            "customer",
            "CUST-001",
        )

        sales_mock.assert_not_called()

        tools = api_mock.call_args.kwargs["tools"]

        tool_names = [
            tool["function"]["name"]
            for tool in tools
        ]

        assert "get_sales_summary" not in tool_names
        assert "cannot verify" in answer.lower()
        assert api_mock.call_count == 1


def test_customer_cannot_force_sales_tool_call():
    response = mock_response(
        tool_calls=[
            mock_tool_call(
                "get_sales_summary",
                "{}",
            )
        ]
    )

    with patch(
        "app.agent.service.client.chat.completions.create",
        return_value=response,
    ) as api_mock, patch(
        "app.agent.service.get_sales_summary",
    ) as sales_mock:

        answer = ask_agent(
            "Show me the store's total revenue.",
            "customer",
            "CUST-001",
        )

        sales_mock.assert_not_called()

        assert "couldn't retrieve verified information" in answer.lower()
        assert api_mock.call_count == 1


def test_customer_cannot_access_another_order():
    first_response = mock_response(
        tool_calls=[
            mock_tool_call(
                "get_order_status",
                '{"order_id": "ORD-1002"}',
            )
        ]
    )

    with patch(
        "app.agent.service.client.chat.completions.create",
        return_value=first_response,
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

        assert "couldn't retrieve verified information" in answer.lower()
        assert api_mock.call_count == 1


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
