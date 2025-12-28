# Tyna

A monorepo for `tyna`, an app to track the books you read.

## Apps

- `web`: The web app (Next.js)
- `auth`: Authentication server (Hono)

## Packages

- `ui-web`: Web UI components (Shadcn + TailwindCSS)
- `assets`: Static assets (Images/Icons)
- `db`: Manage database
- `auth`: Authentication

## Setup

### Database

```bash
pnpm dlx @better-auth/cli generate --config packages/auth/src/index.ts --output packages/db/src/auth-schema.ts
```
