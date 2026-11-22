# OmniShop AI Agent — API Integration Contract

## 1. Purpose

This document defines the integration contract between the OmniShop main backend (FastAPI) and the standalone OmniShop AI Agent service (FastAPI).

The Agent provides conversational shopping assistance and supports three business functions:

1. Product catalog search.
2. Customer order status inquiries.
3. Owner sales analysis.

This contract documents the currently implemented Agent API. Integration with the main backend remains pending.

## 2. System Architecture

The intended communication flow is:

```text
OmniShop Frontend / Messaging Channel
                  |
                  v
          Main FastAPI Backend
                  |
          Trusted User Context
                  |
                  v
           AI Agent FastAPI
                  |
             Agent Service
                  |
           Authorized Tools
                  |
           Database Services
                  |
                Data
```

The main backend is responsible for authenticating users, determining their permissions, and forwarding authorized requests.

The AI Agent service processes messages using OpenRouter and retrieves business information through authorized tools.

The AI Agent must not accept untrusted user-provided roles or customer identifiers as proof of authorization.

## 3. Service Configuration

| Setting | Value |
|---|---|
| Framework | FastAPI |
| Application entry point | `app.main:app` |
| Local base URL | `http://127.0.0.1:8000` |
| Health endpoint | `GET /health` |
| Chat endpoint | `POST /agent/chat` |
| Content type | `application/json` |
| Authentication header | `X-Agent-Key` |

The local base URL is accessible only from the machine or network where the service is running.

The production or development deployment URL has not yet been assigned.

## 4. Internal API Authentication

The chat endpoint requires an internal API key.

**Required request header:**

```http
X-Agent-Key: YOUR_INTERNAL_API_KEY
```

The supplied key must match the `AGENT_INTERNAL_API_KEY` environment variable configured for the AI Agent service.

Requests with missing or invalid internal keys return HTTP 401.

The internal API key must remain in server-side configuration and must never be exposed to frontend applications or end users.

A shared internal API key authenticates the calling service. It does not independently authenticate the customer or store owner.

The main backend must derive `role` and `customer_id` from trusted authentication context rather than accepting these values directly from an end user.

## 5. Chat Endpoint

### Request

```http
POST /agent/chat
Content-Type: application/json
X-Agent-Key: YOUR_INTERNAL_API_KEY
```

### Customer Request Example

```json
{
  "message": "What is the price of Linen throw blanket?",
  "role": "customer",
  "customer_id": "CUST-001"
}
```

### Customer Order Status Example

```json
{
  "message": "Where is my order ORD-1001?",
  "role": "customer",
  "customer_id": "CUST-001"
}
```

### Owner Request Example

```json
{
  "message": "What is the best-selling product?",
  "role": "owner",
  "customer_id": null
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | Non-empty user message |
| `role` | string | Yes | `customer` or `owner` |
| `customer_id` | string or null | Conditional | Required when `role` is `customer` |

The current Agent API validates the supplied role and requires a customer identifier for customer requests.

The main backend must verify both values before forwarding the request.

## 6. Successful Response

**HTTP Status:** `200 OK`

The response contains a single `reply` field.

```json
{
  "reply": "The product price is $68."
}
```

This is an illustrative response using development data.

The actual reply is generated dynamically by the AI Agent.

A successful HTTP response does not guarantee that business data was available. If a tool cannot retrieve verified information, the Agent may return an explanatory message in `reply`.

## 7. Health Endpoint

### Request

```http
GET /health
```

### Response

```json
{
  "status": "ok"
}
```

The health endpoint does not require the internal API key.

It reports application availability and does not verify live OpenRouter connectivity or database readiness.

## 8. Supported Agent Tools

| Tool | Purpose | Authorized role |
|---|---|---|
| `search_catalog` | Retrieve product details, prices, and stock | Customer, Owner |
| `get_order_status` | Retrieve an authenticated customer's order status | Customer |
| `get_sales_summary` | Retrieve sales totals and best-/least-selling products | Owner |

### Product Search

The Agent calls `search_catalog` with a product name.

The tool obtains verified information from the database service.

### Order Status

The Agent calls `get_order_status` with an order identifier.

The associated customer identifier is supplied by the trusted calling backend, not generated by the AI model.

The database query filters by both the order identifier and customer identifier.

### Sales Summary

The Agent exposes `get_sales_summary` only to the owner role.

Customer requests must not be allowed to execute this tool.

The current implementation does not support order creation, payment processing, or modifications to business records.

## 9. Error Responses

| HTTP status | Meaning |
|---|---|
| `401 Unauthorized` | Missing or incorrect internal API key |
| `403 Forbidden` | Unsupported role or missing customer identity |
| `422 Unprocessable Entity` | Invalid request body |
| `502 Bad Gateway` | AI provider error or response-processing failure |
| `503 Service Unavailable` | AI provider connection failure |
| `504 Gateway Timeout` | AI provider timeout |

The API currently returns error details in FastAPI's standard format.

**Example:**

```json
{
  "detail": "Unauthorized API request"
}
```

Tool-level failures may instead return HTTP 200 with an explanatory `reply`, depending on the failure handled by the Agent service.

The calling backend should not assume every HTTP 200 contains verified product, order, or sales information.

## 10. Current Data Access

The AI Agent currently uses SQLAlchemy with a local SQLite database for development.

### Database Components

| File | Responsibility |
|---|---|
| `app/db/database.py` | Engine and session configuration |
| `app/db/models.py` | Product, Order, and Sale models |
| `app/db/schemas.py` | Pydantic schemas |
| `app/db/services.py` | Database queries |
| `app/tools/tools.py` | Agent tool interfaces |
| `scripts/seed.py` | Development database initialization |

Development JSON files are stored under `data/` and are used to populate the local development database.

### Current Data Flow

```text
AI Agent
   |
Authorized Tool
   |
Database Service
   |
SQLAlchemy
   |
Development Database
```

### Production Data Integration

The main backend has its own models and database layer.

The Agent's development tables must not be assumed to match the main backend database schema.

An approved integration mechanism and authoritative data source must be established with the main backend developer.

The development SQLite database must not be treated as production storage.

## 11. Integration Responsibilities

### AI Agent Component

- Maintain the AI Agent service.
- Expose the documented FastAPI endpoints.
- Implement and maintain authorized tool execution.
- Provide automated tests.
- Document configuration and error handling.
- Support integration testing.

### Main Backend

- Authenticate users.
- Determine trusted roles and customer identities.
- Protect the internal API key.
- Forward authorized messages to the Agent.
- Handle response and error conditions.
- Provide access to authoritative business data through an agreed integration mechanism.

### Data Preparation

The data preparation team coordinates sample datasets and final business data requirements with the backend implementation.

## 12. Security Considerations

The current API uses shared-key authentication.

Anyone possessing the internal key who can reach the endpoint may submit a role and customer identifier.

Consequently, the service must not be considered production-secure based on the shared key alone.

Required protections before production integration include:

- Trusted user authentication in the main backend.
- Server-side role and identity propagation.
- Restricted access to the AI Agent endpoint.
- Secure handling and rotation of API keys.
- Protected communication between services.
- Validation of database access permissions.
- Testing against unverified or unauthorized AI-generated responses.

Restricting tool execution prevents unauthorized database tool access but does not, by itself, guarantee that the AI model will never generate an incorrect or unverified claim.

## 13. Deployment Status

The AI Agent application entry point is:

```text
app.main:app
```

The service is designed to run with Uvicorn.

The current team `render.yaml` configures the main backend, not the standalone AI Agent.

Deployment of the AI Agent has not yet been completed or verified.

A deployment configuration must account for the Agent's dependencies, environment variables, HTTP port, authentication, and persistent business data access.

The local SQLite database is not a suitable persistent production data source on an ephemeral hosting filesystem.

## 14. Testing Status

The automated tests cover:

- General Agent responses.
- Product catalog tool calls.
- Owner sales-analysis tool calls.
- Customer access restrictions.
- Customer order ownership.
- Invalid tool arguments.
- API authentication and role validation.
- Basic database behavior.

**Latest confirmed local result: 17 tests passed on November 21, 2026.**

The result was obtained using a previously working Python environment and a seeded local development database.

The following still require verification:

- Clean environment installation and execution using uv.
- Live OpenRouter integration.
- End-to-end communication with the main backend.
- Production data access.
- Deployment security and runtime behavior.

## 15. Integration Status

### Implemented

- FastAPI service.
- Internal API key validation.
- Role-specific tool availability.
- Product catalog tool.
- Customer order status tool.
- Owner sales summary tool.
- SQLAlchemy development data access.
- Development seed script.
- Automated tests.
- uv dependency configuration.

### Pending

- Main backend integration.
- Trusted identity propagation.
- Approved production data access.
- Live AI provider validation.
- Additional security validation.
- Render deployment.
- End-to-end integration testing.

## 16. Contract Change Management

Changes to request fields, authorization rules, response formats, endpoints, or data-access behavior must be coordinated between the AI Agent and main backend developers.

This document describes the current standalone Agent API and does not imply that integration or deployment is already complete.
