# OmniShop AI Agent

## 1. Project Overview

OmniShop AI Agent is the AI component of the OmniShop graduation project.

The Agent uses Python, OpenRouter, and tool calling to understand user questions and retrieve relevant business information.

The Agent supports three main functions:

- Product catalog search.
- Customer order status inquiries.
- Owner sales analysis.

The current implementation uses SQLAlchemy ORM with a local SQLite database for development and testing.

Integration with the main OmniShop NestJS backend and its production database is pending.

## 2. Technologies

- Python
- FastAPI
- OpenRouter
- OpenAI Python SDK
- SQLAlchemy ORM
- Pydantic
- SQLite (local development)
- Pytest
- JSON (seed data only)

## 3. Project Structure

```text
omnishop-agent/
├── agent.py
├── agent_service.py
├── api.py
├── database.py
├── models.py
├── schemas.py
├── services.py
├── tools.py
├── data_provider.py
├── seed.py
├── products.json
├── orders.json
├── sales.json
├── API_CONTRACT.md
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
└── test/
    ├── test_agent_service.py
    ├── test_api.py
    └── test_database.py
```

The local SQLite database file, `.env`, and `.venv` are excluded from the handoff package.

## 4. Installation

**Step 1: Open the project folder**

```powershell
cd omnishop-agent
```

**Step 2: Create a virtual environment**

```powershell
python -m venv .venv
```

**Step 3: Activate the virtual environment (Windows PowerShell)**

```powershell
.\.venv\Scripts\Activate.ps1
```

**Step 4: Install dependencies**

```powershell
python -m pip install -r requirements.txt
```

## 5. Environment Configuration

Create a `.env` file in the project root using `.env.example` as a reference.

```dotenv
OPENROUTER_API_KEY=your_openrouter_api_key
AGENT_INTERNAL_API_KEY=your_secure_internal_key
DATABASE_URL=sqlite:///omnishop.db
```

The `DATABASE_URL` variable is optional for local development. If omitted, `database.py` uses the default local SQLite database.

Generate a secure internal API key:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Never commit `.env` or expose API keys to frontend applications.

## 6. Database Setup

The project uses SQLAlchemy ORM.

**Database components:**

| File | Responsibility |
|---|---|
| `database.py` | Database engine and session configuration |
| `models.py` | Product, Order, and Sale models |
| `schemas.py` | Pydantic schemas |
| `services.py` | Database queries and data retrieval |
| `tools.py` | Agent tool interfaces |
| `seed.py` | Development database initialization |

**Initialize and seed the development database:**

```powershell
python seed.py
```

The seed script creates the required tables and inserts development data from the JSON files.

The JSON files are retained for local testing and are not the Agent's primary runtime data source.

The production database schema and connection mechanism must be agreed upon with the NestJS backend developer.

## 7. Run the API

Start FastAPI:

```powershell
python -m uvicorn api:app --reload
```

Development API documentation:

http://127.0.0.1:8000/docs

**Available endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Service health check |
| POST | `/agent/chat` | Send a question to the AI Agent |

## 8. API Request and Response

**Endpoint:** `POST /agent/chat`

**Required header:**

```http
X-Agent-Key: YOUR_INTERNAL_API_KEY
```

**Example owner request:**

```json
{
  "message": "What is the best-selling product?",
  "role": "owner",
  "customer_id": null
}
```

**Example customer request:**

```json
{
  "message": "Where is my order ORD-1001?",
  "role": "customer",
  "customer_id": "CUST-001"
}
```

**Example response:**

```json
{
  "reply": "The best-selling product is Linen throw blanket, with 45 units sold."
}
```

The response example uses development data.

## 9. Supported Agent Functions

| Tool | Description | Authorized Role |
|---|---|---|
| `search_catalog` | Retrieve product information | Customer, Owner |
| `get_order_status` | Retrieve a customer's own order status | Customer |
| `get_sales_summary` | Retrieve sales totals and best-/least-selling products | Owner |

The Agent tools access business information through the service layer.

**Data Access Flow:**

AI Agent → Tools → Services → SQLAlchemy → Database

The Agent does not independently create, modify, or delete customer orders.

## 10. Security

- The Agent API requires the internal `X-Agent-Key`.
- The NestJS backend must authenticate users.
- User roles must be determined by the trusted backend.
- Customer identifiers must come from the authenticated user context.
- The Agent restricts tool availability based on the supplied role.
- The Agent API must not be publicly exposed with only the current shared-key authentication.
- Production communication requires protected network access and secure transport.

The shared internal key authenticates the calling service, not the individual customer or owner.

## 11. Testing

Run the automated tests:

```powershell
python -m pytest -v
```

**Latest verified result:** 15 tests passed on November 19, 2026.

The test suite covers Agent behavior, API behavior, and an initial SQLAlchemy database test.

Additional integration tests are required before production deployment.

## 12. Backend Integration

The NestJS backend developer is responsible for:

1. Authenticating users.
2. Determining their authorized roles and customer identities.
3. Sending authorized requests to the protected FastAPI endpoint.
4. Returning Agent responses to the appropriate frontend interface.
5. Coordinating production database access and schema compatibility.

The final database architecture must be agreed upon before integration.

See `API_CONTRACT.md` for the API integration contract.

## 13. Current Limitations

- SQLite is used for local development only.
- Production database integration is pending.
- The final database schema has not been confirmed with the backend developer.
- NestJS authentication and identity propagation are not integrated.
- End-to-end testing with the main backend is pending.
- OpenRouter model availability and tool-calling reliability depend on the selected model/provider.
- Complete product catalog migration must be verified before handoff.

## 14. Project Status

The standalone AI Agent, FastAPI endpoint, SQLAlchemy data-access layer, and automated tests are available.

The project is prepared for backend integration testing but is not yet production-ready.