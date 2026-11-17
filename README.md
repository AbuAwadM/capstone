# OmniShop (capstone)

OmniShop is a dashboard for a small online shop. Its main page is the **Agent Console**, one inbox for customer messages from WhatsApp, Instagram, Facebook and Telegram. The other pages cover products, orders, customers and settings.

| Part | Stack | Hosted on |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite, Tailwind CSS v4, React Router, lucide-react icons | Vercel: https://capstone-gray-seven.vercel.app |
| Backend | FastAPI, SQLAlchemy 2, Pydantic Settings, uv, Python 3.12 | Render: https://omnishop-api.onrender.com |
| Database | PostgreSQL 17 | Neon in production, Docker locally |

## Project status

**Done**
- Login page, with a temporary check against `frontend/src/data/users.json`. There is no real auth yet.
- `MainLayout` with a collapsible sidebar, icons and active-link highlighting. The layout itself doesn't scroll; only the panels inside it do.
- Routing in `frontend/src/routes/` (`AppRouter`, `paths`, `ProtectedRoute`). Unknown URLs go to `/login`.
- Dashboard with insight cards built from `dummyInsightsData.json`.
- Agent Console with three columns (Inbox 25% | Conversation 50% | Info 25%). The Inbox has a search bar and **loads conversations from the backend** through `frontend/src/api/conversations.ts`.
- Backend: `GET /api/conversations` and `GET /health`, with `Customer`, `CustomerIdentity` and `Conversation` models. Tables are created on startup and `db/seed.py` adds sample data.
- CI/CD with GitHub Actions: Vercel + Render + Neon, deployed automatically on merge to `main`.

**Still dummy data or empty:** the chat body and messages, the Info panel, Products, Orders, Customers, Settings, the AI agent, the social media channel integrations and webhooks, and backend tests (the test files exist but are empty).

**Next:** Alembic migrations (see [Database](#database)), messages API, real auth, then the channel integrations.

## Repo layout

```
capstone/
├── frontend/            React app (Vite)
│   └── src/
│       ├── api/         fetch calls to the backend
│       ├── components/  layout/ (MainLayout, Sidebar, Navbar) and ui/ (Button, SearchBar, ...)
│       ├── pages/       one folder per page (AgentConsole/, Dashboard/, Login/, ...)
│       ├── routes/      AppRouter, paths, ProtectedRoute
│       ├── data/        dummy JSON still used by pages not yet on the backend
│       ├── context/ hooks/ types/ utils/ constants/ styles/
│   └── vercel.json      sends /api/* to Render, falls back to index.html for BrowserRouter
├── backend/             FastAPI app (uv project)
│   ├── main.py          app, CORS, lifespan (creates tables), /health
│   ├── core/            config (settings from .env), security, exceptions
│   ├── db/              engine/session (database.py), seed.py
│   ├── modules/         one folder per feature: models, schemas, service, router
│   ├── integrations/    AI agent and channels (whatsapp, instagram, facebook, telegram); placeholders for now
│   └── tests/
├── docker-compose.yml   local Postgres 17
├── render.yaml          Render Blueprint for the backend
└── .github/             ci.yml, deploy.yml, dependabot.yml
```

## Running locally

Needs Node 24, [uv](https://docs.astral.sh/uv/) and Docker.

**Database**
```bash
docker compose up -d          # from the repo root; Postgres on localhost:5432 (user/pass/db: omnishop)
```

**Backend** (terminal 1)
```bash
cd backend
cp .env.example .env          # first time only
uv sync                       # installs dependencies into backend/.venv
uv run python -m db.seed      # first time only: adds 8 sample conversations
uv run python main.py         # http://localhost:8000, API docs at /docs
```
With uv you don't activate the venv; `uv run` uses `backend/.venv` automatically.

**Frontend** (terminal 2)
```bash
cd frontend
npm install                   # first time, or after dependencies change
npm run dev                   # http://localhost:5173
```
In dev, Vite sends `/api` requests to the backend on port 8000.

**Checks** (CI runs the same ones)
```bash
cd frontend && npm run lint && npm run build
cd backend && uv run pytest
```

## Database

`DATABASE_URL` can be any Postgres URL. `postgres://` and `postgresql://` URLs from hosting providers are switched to the `psycopg` (v3) driver automatically. SQLAlchemy is still used as the ORM; Postgres only replaced SQLite as the database.

### Update the production database (Neon)

Run this from `backend/` on your own computer. It points the seed script at Neon for this one command and leaves your `.env` unchanged:

```bash
cd backend
DATABASE_URL="<Neon connection string>" uv run python -m db.seed
```

- Get the string in **Neon → your project → Connect**, with **Connection pooling off** (no `-pooler` in the host). It's the same value as `DATABASE_URL` in Render.
- **Keep the double quotes.** The string contains `?` and `&`, which break the command without them.
- Expected output: `Seeded 8 conversations.` If the database already has data, it prints `Database already has conversations; skipping seed.` and changes nothing.
- The command reads the other settings from `backend/.env`. Without a `.env`, add `ALLOWED_ORIGINS=x` before `uv run`.
- Never commit the connection string or paste it anywhere public; it contains the database password.

| Error | Fix |
|---|---|
| `password authentication failed` | The string was copied incompletely; copy it again |
| `zsh: no matches found` / `parse error` | The double quotes are missing |
| `could not translate host name` | Check your internet connection or the string |

### Schema changes (not automated yet)

On startup the backend runs `create_all`, which **only creates missing tables**. If you add, rename or remove a column on an existing table, Neon will **not** be updated. Setting up Alembic migrations is the planned fix; it was started and then stopped, so nothing is in place yet. Until then, a schema change on an existing table has to be applied to Neon by hand.

## Deployment (CI/CD)

Everything deploys through GitHub Actions. Vercel's Git deploys and Render's auto-deploy are both turned off.

| When you... | What happens |
|---|---|
| Open a pull request | **CI** (`ci.yml`): frontend lint and build; backend `uv sync --locked`, pytest, and a smoke test against a real Postgres 17 that seeds data and expects 8 conversations |
| Merge to `main` | **Deploy** (`deploy.yml`): CI first, then **only the apps that changed**, backend (Render) before frontend (Vercel), then checks against the live site |
| Want to redeploy with no code change | **Actions → Deploy → Run workflow** (deploys both) |
| Wait a month | Dependabot opens update PRs. Merge them when CI is green |

Everyday flow:
```bash
git switch -c my-feature
# ...code...
git push -u origin my-feature
# open a PR, wait for CI to pass, merge; the site updates in about 2–3 minutes
```

### Where settings and secrets live

| Value | Where |
|---|---|
| `DATABASE_URL` (Neon), `ALLOWED_ORIGINS` (Vercel URL) | Render → omnishop-api → Environment |
| `RENDER_API_KEY`, `VERCEL_TOKEN` | GitHub → Settings → Environments → `production` → **secrets** |
| `RENDER_SERVICE_ID`, `BACKEND_URL`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `FRONTEND_URL` | Same environment → **variables** (not secrets; the workflow reads them as `vars.`) |

If you add a new backend environment variable, add it in Render yourself and list it in `render.yaml`.

### Hosting notes
- Everything is on free tiers. Render's free service **sleeps after about 15 minutes idle**, so the first request takes about a minute. Open the site a minute before a demo.
- Don't create a Render database. Render's free Postgres is deleted after about 30 days, which is why the database is on Neon.
- Neon and Render are both in **AWS US West 2 (Oregon)**.
- Versions: Node **24.x** (also set in Vercel's project settings), Python **3.12**, Postgres **17**, Vercel CLI **65.17.0**.
- The Vercel project's Root Directory is `frontend`, so `deploy.yml` runs the Vercel CLI from the repo root.

## Decisions and gotchas

- **Created with** `npm create vite@latest frontend` (React → TypeScript → ESLint). The install failed with `ERESOLVE` because the template pins TypeScript 7, which `typescript-eslint` 8 doesn't support. TypeScript is pinned to `~6.0.3`, and Dependabot is set to skip TypeScript 7 and `@types/node` 26 for now.
- **Styling:** Bootstrap was tried and removed. The app uses Tailwind CSS v4 through `@tailwindcss/vite`. shadcn/ui was discussed but isn't installed.
- **One `.gitignore` per app** (`frontend/`, `backend/`), plus a root one for shared entries such as `.vercel`.
- **Same origin in production:** the browser only talks to Vercel, and `vercel.json` forwards `/api/*` to Render, so the frontend's relative `/api` calls work unchanged.
- **VS Code Python interpreter:** select `backend/.venv/bin/python`.
