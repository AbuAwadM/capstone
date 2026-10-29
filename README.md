# capstone

## Frontend setup

Created with:

```bash
npm create vite@latest frontend
```

Options: **React** → **TypeScript** → **ESLint** → install with npm: **Yes**

**Dependency fix:** the install failed with `ERESOLVE` because the template pins `typescript@~7.0.2`, but `typescript-eslint@8.72.x` only supports `typescript >=4.8.4 <6.1.0`. We changed `typescript` to `~6.0.3` in `frontend/package.json`, then ran `npm install`. Switch back to TS 7 once typescript-eslint supports it.
