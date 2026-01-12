# Tyna

A monorepo for `tyna`, a book tracking application

## Project Structure

This project is a monorepo managed with [Turbo](https://turbo.build/repo).

### Apps

- [**web**](file:///mnt/storage/storage/Projects/tyna/apps/web): The main web application built with Next.js 15, React 19, and TailwindCSS.
- [**auth**](file:///mnt/storage/storage/Projects/tyna/apps/auth): A high-performance authentication server powered by Hono and Better Auth.

### Packages

- [**ui-web**](file:///mnt/storage/storage/Projects/tyna/packages/ui-web): Shared React components built on top of [Shadcn UI](https://ui.shadcn.com/) and TailwindCSS.
- [**assets**](file:///mnt/storage/storage/Projects/tyna/packages/assets): Centralized static assets including icons and images.
- [**eslint-config**](file:///mnt/storage/storage/Projects/tyna/packages/eslint-config): Shared ESLint configurations used across the workspace.
- [**typescript-config**](file:///mnt/storage/storage/Projects/tyna/packages/typescript-config): Shared TypeScript configurations for consistency.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **Authentication**: Better Auth + Hono
- **Database**: Drizzle ORM + PostgreSQL
- **Build Tool**: Turborepo
- **Package Manager**: PNPM

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- PNPM installed globally (`npm install -g pnpm`)

### Installation

```bash
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env` in the root and in the respective apps:

```bash
cp .env.example .env
# Follow instructions in apps/auth and apps/web for their specific env needs
```

### Database & Auth Setup

To generate the database schema for authentication:

```bash
pnpm dlx @better-auth/cli generate --config packages/auth/src/index.ts --output packages/db/src/auth-schema.ts
```

### Development

Run all apps and packages in development mode:

```bash
pnpm dev
```
