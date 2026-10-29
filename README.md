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

We are using **Bootstrap** for now as a temporary styling solution. We plan to switch to **Tailwind CSS** later (`tailwindcss` and `@tailwindcss/vite` are already installed and the plugin is registered in `frontend/vite.config.ts`). Once the switch happens, Bootstrap will be removed.
