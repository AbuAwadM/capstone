# Omnishop Backend

This is the API server for Omnishop, written in **FastAPI** (Python 3.12, managed with **uv**). The React frontend in `../frontend` uses it.

Most files in this folder are still **empty placeholders**. This README explains what each folder and file is for, so new code goes in the right place.

---

## Running the server

First create a `.env` file (see [Environment variables](#environment-variables) below). Then use **one** of the two options.

### Option A: with uv (recommended)

[uv](https://docs.astral.sh/uv/) reads `pyproject.toml`, creates `.venv` and installs everything in one step.

```bash
cd backend
uv sync                    # first time, or after dependencies change
uv run fastapi dev main.py # start the dev server with auto-reload
```

`uv run` uses the project's `.venv` automatically, so you don't need to activate it.

### Option B: with pip

```bash
cd backend
python3 -m venv .venv              # create a virtual environment (first time only)
source .venv/bin/activate          # macOS / Linux
# .venv\Scripts\activate           # Windows

pip install "fastapi[standard]" pydantic-settings   # first time, or after dependencies change
fastapi dev main.py                                  # start the dev server with auto-reload
```

Activate the environment again (`source .venv/bin/activate`) each time you open a new terminal. Run `deactivate` to leave it.

> pip installs packages by name instead of reading `pyproject.toml`, so if a dependency is added there, add it to the `pip install` line above as well.

### Either way

You can also start the server with `python main.py` (or `uv run python main.py`). The server listens on port **8000**, and the interactive API docs are at:

- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

### Environment variables

Settings are read from a `.env` file in `backend/`. Git ignores this file, so each developer creates their own.

| Variable          | Required | Example                          | Purpose                                   |
| ----------------- | -------- | -------------------------------- | ----------------------------------------- |
| `DATABASE_URL`    | yes      | `sqlite:///./omnishop.db`        | Database connection string                |
| `ALLOWED_ORIGINS` | yes      | `http://localhost:5173`          | Comma-separated origins allowed by CORS (5173 is the Vite dev server) |
| `API_PREFIX`      | no       | `/api` (default)                 | URL prefix for all API routes             |
| `DEBUG`           | no       | `false` (default)                | Enables debug behaviour                   |

---

## Folder structure

```
backend/
├── main.py
├── pyproject.toml
├── core/
│   ├── config.py
│   ├── security.py
│   └── exceptions.py
├── db/
│   ├── database.py
│   └── base.py
├── api/
│   ├── router.py
│   └── deps.py
├── modules/
│   ├── auth/
│   ├── dashboard/
│   ├── conversations/
│   ├── customers/
│   ├── products/
│   ├── orders/
│   └── settings/
├── integrations/
│   ├── ai_agent.py
│   └── channels/
└── tests/
    ├── conftest.py
    └── modules/
```

Every folder is a Python package, so each one contains an `__init__.py`. Those files are left empty.

### Root files

- **`main.py`**: the entry point. It creates the FastAPI `app` and sets up CORS. It should also register the main router from `api/router.py`.
- **`pyproject.toml`**: the project's metadata and dependencies, managed with uv.

### `core/`: app-wide foundations

Code that the whole app shares and that doesn't belong to any one feature.

- **`config.py`**: loads the environment variables above into a `settings` object. Import `settings` from here; don't read `os.environ` directly.
- **`security.py`**: password hashing and creating/checking login tokens.
- **`exceptions.py`**: the app's own error types (for example "not found" or "not allowed") and how they become HTTP responses.

### `db/`: database

- **`database.py`**: creates the database engine and sessions.
- **`base.py`**: the base class that every model extends. Tables are defined in each module's `models.py`.

### `api/`: HTTP wiring

- **`router.py`**: collects the router from each module and mounts it under `API_PREFIX` (for example `/api/orders`). `main.py` includes this one router.
- **`deps.py`**: shared FastAPI dependencies used with `Depends(...)`, such as getting a database session or the logged-in user.

### `modules/`: features

Each module matches a page in the frontend, and each one has the same four files:

| File          | Responsibility                                                         |
| ------------- | ---------------------------------------------------------------------- |
| `router.py`   | The endpoints. Keep them thin: read the request, call the service, return a response. |
| `schemas.py`  | Pydantic models for request bodies and responses (what the frontend sends and receives). |
| `models.py`   | Database tables for this feature.                                      |
| `service.py`  | Business logic and database queries. Routers call services, not the database directly. |

Requests flow in one direction: **router → service → models/db**. A service may call another module's service (for example, the dashboard calls the orders service), but a router should never contain business logic.

| Module           | Frontend page   | What it handles |
| ---------------- | --------------- | --------------- |
| `auth`           | Login           | User accounts, login, logout. It will replace the `users.json` check the login page uses now. |
| `dashboard`      | Dashboard       | The 7 metric cards: total sales, current orders, inventory value, items in inventory, total products, customers today, successful purchase rate. It has **no `models.py`** because it only adds up data from orders, products and customers. |
| `conversations`  | Agent Console   | The inbox list and search, the messages in each conversation, sending replies, status (Open / Pending / Closed), the AI mode (Review First / Auto-Send), Pause AI, and Resolve. It also has **`webhooks.py`**, which receives incoming messages from the messaging platforms. |
| `customers`      | Customers       | Customer records: name, profile picture, and their identity on each platform. Conversations and orders belong to a customer. |
| `products`       | Products        | The product catalogue and stock. It supplies the dashboard's product and inventory figures. |
| `orders`         | Orders          | Orders and their status. It supplies the dashboard's sales, current orders and success rate figures. |
| `settings`       | Settings        | Settings for the store and account. The frontend page is still empty, so this module will take shape with it. |

### `integrations/`: outside services

Code that talks to services outside our app lives here, so the modules don't depend on any one provider's details.

- **`ai_agent.py`**: the AI assistant that drafts or sends replies in the Agent Console. "Review First" means the AI drafts and a person approves; "Auto-Send" means it sends directly; "Pause AI" turns it off for a conversation.
- **`channels/`**: one file per messaging platform shown in the inbox:
  - `base.py`: the interface every channel follows (for example: send a message, read an incoming one)
  - `whatsapp.py`, `instagram.py`, `facebook.py`, `telegram.py`: the code for each platform

  To support a new platform, add a file here that follows `base.py`. The conversations module doesn't need to change.

### `tests/`

- **`conftest.py`**: shared pytest fixtures, such as a test client and a test database.
- **`modules/test_<module>.py`**: one test file for each module.

---

## Adding a new feature

1. Create `modules/<feature>/` with `__init__.py`, `router.py`, `schemas.py`, `models.py` and `service.py`.
2. Register its router in `api/router.py`.
3. Add `tests/modules/test_<feature>.py`.

---

## Known leftovers

- `src/backend/__init__.py` was created by `uv init` and isn't part of the app. `main.py` imports from it (`from backend import main`); that import can be removed.
- `db/database.py` is still empty, so the database connection hasn't been set up yet.
