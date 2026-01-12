# Tyna - Auth Server

A standalone authentication server for the Tyna ecosystem, powered by [Hono](https://hono.dev/) and [Better Auth](https://www.better-auth.com/).

## Getting Started

### Prerequisites

- Node.js & PNPM
- A running PostgreSQL instance

### Local Development

1.  **Install dependencies**:

    ```bash
    pnpm install
    ```

2.  **Environment Variables**:
    Create a `.env` file based on `.env.example`:

    ```bash
    cp .env.example .env
    ```

3.  **Run migrations**:

    ```bash
    pnpm db:migrate
    ```

4.  **Start the dev server**:
    ```bash
    pnpm dev
    ```
    The server will be available at `http://localhost:3001`.

## Scripts

- `pnpm dev`: Starts the server with hot-reload using `tsx`.
- `pnpm build`: Compiles TypeScript to JavaScript.
- `pnpm start`: Runs the compiled server from `dist/`.
- `pnpm db:generate:migration`: Generates Drizzle migrations.
- `pnpm db:migrate`: Applies migrations to the database.
- `pnpm db:studio`: Opens Drizzle Studio for database exploration.
- `pnpm api:reference`: Opens the API documentation in your browser.
