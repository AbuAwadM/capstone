# OmniShop AI Agent

## 1. Project Overview

OmniShop AI Agent is the AI-powered sales assistant component of the OmniShop graduation project.

The service uses Python, FastAPI, OpenRouter, and tool calling to process user inquiries and retrieve verified business information.

The Agent supports three core business functions:

- Product catalog search.
- Customer order status inquiries.
- Owner sales analysis.

The Agent also supports general conversational shopping assistance, including greetings and questions about customer preferences.

The service is maintained independently under `capstone/ai-agent/` and is intended to integrate with the main OmniShop FastAPI backend.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| FastAPI | REST API framework |
| OpenRouter | AI model provider |
| OpenAI Python SDK | OpenRouter-compatible client |
| SQLAlchemy | Database ORM |
| Pydantic | Data validation |
| SQLite | Local development database |
| uv | Python dependency and environment management |
| Pytest | Automated testing |
| JSON | Development seed data |

## 3. Project Structure

```text
capstone/
├── backend/
├── frontend/
└── ai-agent/
    ├── app/
    │   ├── __init__.py
    │   ├── main.py
    │   ├── core/
    │   │   └── __init__.py
    │   ├── agent/
    │   │   ├── __init__.py
    │   │   └── service.py
    │   ├── api/
    │   │   ├── __init__.py
    │   │   └── routes.py
    │   ├── tools/
    │   │   ├── __init__.py
    │   │   └── tools.py
    │   └── db/
    │       ├── __init__.py
    │       ├── database.py
    │       ├── models.py
    │       ├── schemas.py
    │       └── services.py
    ├── data/
    │   ├── products.json
    │   ├── orders.json
    │   └── sales.json
    ├── scripts/
    │   ├── __init__.py
    │   └── seed.py
    ├── tests/
    │   ├── __init__.py
    │   ├── conftest.py
    │   ├── test_agent_service.py
    │   ├── test_api.py
    │   └── test_database.py
    ├── .env.example
    ├── .gitignore
    ├── .python-version
    ├── pyproject.toml
    ├── uv.lock
    ├── requirements.txt
    ├── API_CONTRACT.md
    └── README.md
```

### Component Responsibilities

| Component | Responsibility |
|---|---|
| `app/main.py` | FastAPI application entry point |
| `app/agent/service.py` | Agent behavior, OpenRouter communication, and tool orchestration |
| `app/api/routes.py` | HTTP endpoints, API-key authentication, and error handling |
| `app/tools/tools.py` | Interfaces for retrieving authorized business information |
| `app/db/database.py` | Database engine and session management |
| `app/db/models.py` | SQLAlchemy database models |
| `app/db/schemas.py` | Pydantic schemas |
| `app/db/services.py` | Business data queries |
| `scripts/seed.py` | Development database initialization |
| `data/` | Sample product, order, and sales datasets |
| `tests/` | Automated tests |

## 4. Installation and Setup

### Prerequisites

- Python compatible with `pyproject.toml`.
- uv package manager.
- OpenRouter API key.
- Git.

The project declares support for Python versions `>=3.11,<3.14` and selects Python 3.12 through `.python-version`.

### Step 1 — Open the AI Agent Directory

From the team repository:

```powershell
cd ai-agent
```

### Step 2 — Install Dependencies

Use uv to install dependencies from the lockfile:

```powershell
uv sync --locked --group dev
```

This command creates or updates the local `.venv` environment.

The project includes `pytest` as a development dependency.

For application-only installation:

```powershell
uv sync --locked --no-dev
```

### Step 3 — Configure Environment Variables

Create a `.env` file based on `.env.example`.

Required variables:

```dotenv
OPENROUTER_API_KEY=your_openrouter_api_key
AGENT_INTERNAL_API_KEY=your_secure_internal_key
```

The database configuration is optional:

```dotenv
DATABASE_URL=sqlite:///omnishop.db
```

If `DATABASE_URL` is omitted, the application uses the local `omnishop.db` file in the AI Agent project directory.

Generate an internal API key:

```powershell
uv run python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Never commit `.env` or expose actual API keys in source code, screenshots, or documentation.

## 5. Development Database

The project uses SQLAlchemy ORM with three development models:

| Model | Description |
|---|---|
| `Product` | Product information, prices, and stock |
| `Order` | Customer orders and their statuses |
| `Sale` | Sales quantities and revenue data |

Sample data is stored in `data/`.

### Initialize the Database

Run from the AI Agent project root:

```powershell
uv run python -m scripts.seed
```

Expected output:

```text
Database seeded successfully!
```

The seed script creates the required tables and inserts development data while checking for existing records.

The generated SQLite database is excluded from Git.

The development seed script must not be executed against a production database.

## 6. Running the API

Start the FastAPI application:

```powershell
uv run python -m uvicorn app.main:app --reload
```

The default local address is:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

The application entry point is `app.main:app`.

### Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Service health check |
| POST | `/agent/chat` | Process an AI Agent request |

## 7. API Usage

### Authentication

The chat endpoint requires an internal API key.

```http
X-Agent-Key: YOUR_INTERNAL_API_KEY
```

### Customer Request

```json
{
  "message": "What is the price of Linen throw blanket?",
  "role": "customer",
  "customer_id": "CUST-001"
}
```

### Order Status Request

```json
{
  "message": "Where is my order ORD-1001?",
  "role": "customer",
  "customer_id": "CUST-001"
}
```

### Owner Request

```json
{
  "message": "What is the best-selling product?",
  "role": "owner",
  "customer_id": null
}
```

### Response Format

```json
{
  "reply": "The requested information is returned here."
}
```

Responses are generated dynamically. Business-specific responses depend on the available data and authorized tool calls.

For complete API documentation, see `API_CONTRACT.md`.

## 8. Agent Tools and Authorization

| Tool | Purpose | Authorized Role |
|---|---|---|
| `search_catalog` | Retrieve verified product information | Customer, Owner |
| `get_order_status` | Retrieve the current customer's order status | Customer |
| `get_sales_summary` | Retrieve store sales information | Owner |

### Catalog Search

Searches the development product database for a matching product and returns available product details.

### Order Status

Retrieves an order only when its identifier and the supplied customer identifier match.

### Sales Analysis

Provides an owner-accessible sales summary, including total revenue, units sold, and best-/least-selling products.

### Agent Restrictions

The Agent does not:

- Create or modify orders.
- Process payments.
- Modify product inventory.
- Generate unsupported promotions or discounts.
- Intentionally disclose private order or sales information to unauthorized roles.

Tool permissions are enforced in the application. Additional safeguards are still required to prevent unverified model-generated claims.

## 9. Data Access Architecture

```text
User Request
     |
FastAPI Application
     |
AI Agent Service
     |
Authorized Tool
     |
Database Service
     |
SQLAlchemy
     |
Database
```

The Agent uses SQLAlchemy-based services for business data retrieval.

JSON files are used for development database initialization, not as the primary runtime data source.

The main backend database integration has not yet been finalized.

## 10. Security

The AI Agent implements:

- Internal API-key validation.
- Role validation.
- Customer identifier requirements.
- Role-specific tool availability.
- Order ownership filtering.
- API provider error handling.
- Environment-based secret configuration.

### Security Boundaries

The internal API key authenticates the calling service, not the individual end user.

The main backend must authenticate users and derive trusted `role` and `customer_id` values before forwarding requests.

The current shared-key mechanism must not be treated as sufficient protection for an unrestricted public production endpoint.

The selected AI model may produce incorrect or unverified responses, particularly when responding without a tool call. Further response-validation and authorization testing is required before production use.

Previously exposed API keys must be revoked and replaced.

## 11. Automated Testing

The project includes tests for:

- Conversational responses.
- Product tool calls.
- Owner sales analysis.
- Customer access restrictions.
- Order ownership.
- Invalid tool arguments.
- API authentication.
- Invalid user roles.
- Database behavior.

### Run Tests

From the AI Agent project root:

```powershell
uv run python -m pytest -q
```

The test configuration includes placeholder credentials for mocked Agent requests.

Some existing tests rely on seeded development data.

### Latest Verified Result

**17 tests passed on November 21, 2026**, after the folder restructuring, using the previously working Python environment and the prepared development database.

A clean uv-managed environment and live provider integration still require independent validation.

## 12. Integration with the Main Backend

The main OmniShop backend uses FastAPI and is maintained under `capstone/backend/`.

The AI Agent remains an independent Python service under `capstone/ai-agent/`.

The main backend must:

1. Authenticate users.
2. Determine their authorized roles.
3. Supply trusted customer identifiers.
4. Forward requests to the Agent through an agreed integration mechanism.
5. Handle responses and errors.
6. Coordinate access to authoritative store data.

The main backend integration file has been created but was empty at the time of review.

The integration contract is documented in `API_CONTRACT.md`.

This AI Agent component does not modify the team's backend or frontend implementations.

## 13. Deployment

The AI Agent is intended to be deployed through Render using GitHub and uv.

Deployment configuration must account for:

- Project root: `ai-agent/`.
- Python 3.12.
- Locked dependencies.
- FastAPI entry point: `app.main:app`.
- Render's assigned listening port.
- Required environment variables.
- Access restrictions.
- Reliable business data storage.

The existing team `render.yaml` configures the main backend, not the standalone AI Agent.

The AI Agent has not yet been deployed or verified on Render.

Local SQLite data must not be treated as persistent production data on an ephemeral deployment filesystem.

## 14. Development Environment Notes

The original development environment used Python 3.15.2 and successfully executed the automated tests.

During migration to uv, a Python 3.13 environment was created, but Windows Code Integrity prevented loading the native `jiter` dependency.

The issue was associated with an enforced Windows application-control policy.

The project now selects Python 3.12 in `.python-version`, but a clean installation and test run using Python 3.12 remain pending.

Windows security controls must not be disabled as a workaround.

## 15. Current Limitations

- Live OpenRouter integration has not been fully verified.
- Main backend integration is pending.
- Production data access has not been finalized.
- Local SQLite is used for development.
- Clean uv installation and execution require verification.
- Some tests depend on seeded data.
- Complete security validation is pending.
- Render deployment is pending.
- Model availability and tool-calling support depend on the configured provider and model.

## 16. Project Status

The OmniShop AI Agent currently includes:

- A structured Python application.
- FastAPI endpoints.
- OpenRouter integration code.
- Conversational sales assistance.
- Three authorized business tools.
- SQLAlchemy data access.
- Development seed data.
- Automated tests.
- uv dependency configuration.
- API integration documentation.

The project has passed its existing local test suite but is not yet considered production-ready.

Further live integration testing, deployment validation, and security review are required.
