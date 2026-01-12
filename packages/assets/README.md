# @workspace/assets

Centralized static assets for the Tyna ecosystem, providing icons, images, and type definitions.

## Contents

- **/icons**: Static icons used across apps.
- **/images**: Brand images and logos.
- **index.ts**: Main entry point for asset exports.
- **types.d.ts**: Type definitions for assets.

## Usage

Assets from this package can be imported into other apps/packages via the workspace protocol.

```typescript
import { logo } from '@workspace/assets';
```

## Maintenance

To add new assets, place them in the appropriate directory in `src/` and ensure they are exported correctly from `index.ts`.
