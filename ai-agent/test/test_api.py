
import os
from unittest.mock import patch

from fastapi.testclient import TestClient
from api import app


client = TestClient(app)


from api import INTERNAL_API_KEY


def valid_headers():
    return {"X-Agent-Key": INTERNAL_API_KEY}


def test_request_without_api_key():
    response = client.post(
        "/agent/chat",
        json={
            "message": "What is the best-selling product?",
            "role": "owner",
            "customer_id": None
        }
    )

    assert response.status_code == 401


def test_request_with_wrong_api_key():
    response = client.post(
        "/agent/chat",
        headers={"X-Agent-Key": "wrong-key"},
        json={
            "message": "What is the best-selling product?",
            "role": "owner",
            "customer_id": None
        }
    )

    assert response.status_code == 401


def test_invalid_role():
    response = client.post(
        "/agent/chat",
        headers=valid_headers(),
        json={
            "message": "What is the best-selling product?",
            "role": "admin",
            "customer_id": None
        }
    )

    assert response.status_code == 403


def test_customer_without_identity():
    response = client.post(
        "/agent/chat",
        headers=valid_headers(),
        json={
            "message": "Where is my order?",
            "role": "customer",
            "customer_id": None
        }
    )

    assert response.status_code == 403


def test_authorized_owner_request():
    with patch(
        "api.ask_agent",
        return_value="Best-selling: Linen throw blanket."
    ) as agent_mock:

        response = client.post(
            "/agent/chat",
            headers=valid_headers(),
            json={
                "message": "What is the best-selling product?",
                "role": "owner",
                "customer_id": None
            }
        )

        assert response.status_code == 200

        assert response.json() == {
            "reply": "Best-selling: Linen throw blanket."
        }

        agent_mock.assert_called_once_with(
            message="What is the best-selling product?",
            role="owner",
            customer_id=None
        )
