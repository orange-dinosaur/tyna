# Tyna - Web App

The primary frontend for the Tyna book tracking application, built with [Next.js](https://nextjs.org/) and [React](https://react.dev/).

## Getting Started

### Prerequisites

- Node.js & PNPM
- The `auth` server running (for authentication features)

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

3.  **Start the dev server**:
    ```bash
    pnpm dev
    ```
    The app will be available at `http://localhost:3000`.

## Scripts

- `pnpm dev`: Starts the Next.js development server with Turbopack.
- `pnpm build`: Creates an optimized production build.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for code quality issues.
- `pnpm typecheck`: Runs the TypeScript compiler to check for type errors.
