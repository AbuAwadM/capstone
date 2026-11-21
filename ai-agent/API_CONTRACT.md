# OmniShop AI Agent — API Integration Contract

## 1. Purpose

This document defines the integration contract between the OmniShop main backend (NestJS) and the AI Agent service (Python/FastAPI).

The AI Agent supports product information retrieval, customer order status queries, and owner sales analysis.

## 2. System Architecture

The proposed communication flow is:

**OmniShop Frontend → NestJS Backend → FastAPI Agent → Agent Tools → Data Source**

The NestJS backend is responsible for authenticating users and determining their permissions.

FastAPI processes authorized requests and returns AI-generated responses based on the available business data.

## 3. API Configuration

**Framework:** FastAPI

**Development Base URL:** `http://127.0.0.1:8000`

**Endpoint:** `POST /agent/chat`

**Content Type:** `application/json`

**Authentication Header:** `X-Agent-Key`

The development URL is valid only when the service is running on the same machine as the caller.

## 4. Internal API Authentication

Each request must include:

```http
X-Agent-Key: YOUR_INTERNAL_API_KEY
```

The value must match the `AGENT_INTERNAL_API_KEY` configured in the Agent's `.env` file.

Requests without a valid key are rejected with HTTP 401.

The internal key must be stored securely on the backend and must never be exposed to the frontend or end users.

A shared API key authenticates the calling service, not the individual user. NestJS must independently verify user identity and permissions.

Production integration also requires protected network access and HTTPS or equivalent transport security.

## 5. Request Body

### Owner Request

```json
{
  "message": "What is the best-selling product?",
  "role": "owner",
  "customer_id": null
}
```

### Customer Request

```json
{
  "message": "Where is my order ORD-1001?",
  "role": "customer",
  "customer_id": "CUST-001"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| message | string | Yes | User question |
| role | string | Yes | Verified role: owner or customer |
| customer_id | string or null | Conditional | Required for customer requests |

**Important:** NestJS must obtain `role` and `customer_id` from its trusted authentication context, not directly from user-submitted JSON.

## 6. Successful Response

**HTTP Status:** 200 OK

```json
{
  "reply": "The best-selling product is Linen throw blanket, with 45 units sold."
}
```

The `reply` field contains the Agent's response.

The example above uses local development data.

## 7. Supported Agent Tools

| Tool | Description | Current authorized role |
|---|---|---|
| search_catalog | Search available products | Customer, Owner |
| get_order_status | Retrieve a customer's own order status | Customer |
| get_sales_summary | Retrieve sales totals and best-/least-selling products | Owner |

The permissions above reflect the current Agent implementation and must be checked against the approved OmniShop project specification.

## 8. Error Responses

| HTTP Status | Description |
|---|---|
| 401 | Missing or invalid internal API key |
| 403 | Invalid role or missing customer identity |
| 422 | Invalid request body |
| 502 | AI provider error or invalid AI response |
| 503 | AI provider connection failure |
| 504 | AI provider timeout |

A valid HTTP 200 response does not necessarily mean that the requested business information was found. The Agent may return a verification failure message in the `reply` field.

## 9. Current Data Source

The AI Agent uses SQLAlchemy ORM to access a local SQLite database during development.

**Database:** `omnishop.db`

**Database Components:**

| File | Responsibility |
|---|---|
| `database.py` | Database engine and session configuration |
| `models.py` | SQLAlchemy models for products, orders, and sales |
| `schemas.py` | Pydantic schemas for data validation and serialization |
| `services.py` | Database queries and business data retrieval |
| `tools.py` | Agent tool interfaces that call the service layer |
| `seed.py` | Inserts development data into the local database |

**Data Access Flow:**

AI Agent → Tools → Services → SQLAlchemy → Database

The JSON files (`products.json`, `orders.json`, and `sales.json`) are retained as development seed-data sources. They are no longer the primary data source for the Agent tools.

**Production Integration:**

SQLite is used for local development and testing only.

The final database connection, schema, and data-access permissions must be agreed upon with the NestJS backend developer before production integration.

The AI Agent must use approved business data and must not independently modify production orders, products, or sales records.

## 10. Integration Responsibilities

### AI Agent Developer

- Maintain the Python Agent service.
- Maintain the FastAPI endpoint and Agent tools.
- Validate the current Agent behavior using automated tests.
- Coordinate the replacement of development data access.
- Support integration testing.

### NestJS Backend Developer

- Authenticate users.
- Determine authorized user roles and customer identifiers.
- Keep the internal API key server-side.
- Send authorized requests to FastAPI.
- Return Agent responses to the appropriate OmniShop interface.
- Provide access to approved business data through the agreed integration mechanism.

### Data Preparation

The data team prepares the required dataset and database structure in coordination with backend development.

## 11. Integration Status

### Completed

- AI Agent tool implementation.
- FastAPI endpoint and internal API key validation.
- Basic role-based tool restrictions.
- SQLAlchemy models for products, orders, and sales.
- Pydantic schemas.
- Service layer for database access.
- Agent tools connected to the service layer.
- SQLite development database and seed script.
- Automated unit, API, and initial database tests.

**Latest verified test result:** 15 tests passed on November 19, 2026.

### Pending

- Verification that the complete product catalog has been imported.
- Confirmation of the final database schema with the backend developer.
- NestJS-to-FastAPI integration.
- Trusted user identity propagation.
- Production database integration.
- Additional database integration and end-to-end tests.
- Production security and deployment configuration.

## 12. Security Limitations

The current API uses a shared internal key. Anyone who possesses this key and can reach the endpoint may submit a role and customer identifier.

Therefore, the API must not be publicly exposed in its current configuration.

NestJS must act as the trusted entry point, and network access to FastAPI must be restricted.

## 13. Final Integration Note

This contract describes the current standalone Agent API and the proposed backend integration.

Any changes to endpoint fields, roles, or data access must be coordinated between the AI Agent and backend developers before integration.
