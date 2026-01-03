# @workspace/utils

This package provides shared utility functions, schemas, and types for the monorepo, including:

- Helper functions for common operations (strings, numbers, dates)
- Validation schemas built with [Zod](https://zod.dev/)
- Shared TypeScript types
- Date formatting powered by [date-fns](https://date-fns.org/)

## Usage

Import and use utilities in your apps:

```ts
import { capitalize, truncate } from '@workspace/utils/helpers';
import { emailSchema, signInSchema } from '@workspace/utils/schemas';
import type { AuthUser } from '@workspace/utils/types';
```

## Features

- **Helper Functions**: String manipulation, number operations, date formatting
- **Validation Schemas**: Pre-built Zod schemas for authentication and common data
- **Type Definitions**: Shared TypeScript types for consistency across apps
- **Modular Exports**: Import only what you need with granular exports

## Available Exports

### Helpers (`@workspace/utils/helpers`)

- **String helpers**: `capitalize`, `truncate`, `isEmpty`
- **Number helpers**: `clamp`, `round`
- **Date helpers**: `formatDate`, `formatDistanceToNow`, `formatDuration`, `intervalToDuration`

### Schemas (`@workspace/utils/schemas`)

- **Auth schemas**: `emailSchema`, `passwordSchema`, `nameSchema`, `signInSchema`, `signUpSchema`

### Types (`@workspace/utils/types`)

- **Auth types**: Shared authentication type definitions

## Example

```ts
import { capitalize, truncate } from '@workspace/utils/helpers';
import { emailSchema } from '@workspace/utils/schemas';

// String helpers
const title = capitalize('hello world'); // "Hello world"
const short = truncate('Very long text...', 10); // "Very long…"

// Validation
const result = emailSchema.safeParse('user@example.com');
if (result.success) {
  console.log('Valid email:', result.data);
}
```
