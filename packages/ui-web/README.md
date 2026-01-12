# @workspace/ui-web

A shared UI component library for Tyna's web applications, built with [React](https://react.dev/), [TailwindCSS](https://tailwindcss.com/), and [Radix UI](https://www.radix-ui.com/).

## Installation

This package is intended for use within the workspace. Ensure it's added to your `package.json` dependencies:

```json
{
    "dependencies": {
        "@workspace/ui-web": "workspace:*"
    }
}
```

## Usage

Import components directly in your React code:

```tsx
import { Button } from '@workspace/ui-web/components/button';
```

## Structure

- **/src/components**: The core UI components (Button, Dialog, Sidebar, etc.).
- **/src/hooks**: Shared React hooks.
- **/src/lib**: Utility functions (e.g., `cn` for Tailwind merging).
- **/src/styles**: Global CSS and theme definitions.
