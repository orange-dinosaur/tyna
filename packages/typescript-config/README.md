# @workspace/typescript-config

Shared TypeScript configurations for the Tyna monorepo, ensuring consistent compiler settings.

## Configs

- `base.json`: Base configuration with common compiler options.
- `nextjs.json`: Optimized configuration for Next.js projects.
- `react-library.json`: Configuration for React-based workspace packages.

## Usage

Extend these configurations in your package's `tsconfig.json`:

```json
{
    "extends": "@workspace/typescript-config/nextjs.json",
    "compilerOptions": {
        "outDir": "dist"
    }
}
```
