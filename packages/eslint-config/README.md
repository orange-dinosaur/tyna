# @workspace/eslint-config

Shared ESLint configurations to maintain code quality and consistency across the Tyna monorepo.

## Configs

- `base.js`: The foundation configuration for all packages.
- `next.js`: Specific rules for Next.js applications.
- `react-internal.js`: Configuration for internal React libraries.

## Usage

Extend these configurations in your package's `eslint.config.js` or `.eslintrc.js`:

```javascript
module.exports = {
    extends: ['@workspace/eslint-config/next'],
};
```
