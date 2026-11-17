# capstone

## Frontend setup

Created with:

```bash
npm create vite@latest frontend
```

Options: **React** → **TypeScript** → **ESLint** → install with npm: **Yes**

**Dependency fix:** the install failed with `ERESOLVE` because the template pins `typescript@~7.0.2`, but `typescript-eslint@8.72.x` only supports `typescript >=4.8.4 <6.1.0`. We changed `typescript` to `~6.0.3` in `frontend/package.json`, then ran `npm install`. Switch back to TS 7 once typescript-eslint supports it.

## Running the frontend (dev)

```bash
cd frontend
npm install   # first time only, or after dependencies change
npm run dev
```

Vite starts a dev server with hot reload, by default at http://localhost:5173.

## Styling

Bootstrap has been removed. We plan to style the app with **Tailwind CSS** (`tailwindcss` and `@tailwindcss/vite` are already installed and the plugin is registered in `frontend/vite.config.ts`).

## Running the backend (dev)

The backend uses **PostgreSQL**. A local database is defined in `docker-compose.yml`:

```bash
docker compose up -d          # from the repo root; starts Postgres on localhost:5432
cd backend
cp .env.example .env          # first time only
uv sync                       # install dependencies
uv run python -m db.seed      # optional: add sample data
uv run python main.py         # API at http://localhost:8000 (docs at /docs)
```

Tables are created automatically on startup. `DATABASE_URL` can be any Postgres URL; `postgres://` and `postgresql://` URLs from hosting providers are switched to the `psycopg` driver automatically.
