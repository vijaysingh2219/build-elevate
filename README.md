# Turborepo Monorepo Template

This template is for creating a monorepo with

- [Turborepo](https://turborepo.com/) for monorepo management
- [Next.js](https://nextjs.org/) (with Turbopack) for the web application
- [Express](https://expressjs.com/) for the API server
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Auth.js](https://authjs.dev/) for authentication
- [Tanstack Query](https://tanstack.com/query/latest) for data fetching and state management
- [ESLint](https://eslint.org/) for linting
- [Prettier](https://prettier.io/) for code formatting
- [pnpm](https://pnpm.io/) as the package manager

---

## Project Structure

This monorepo is structured into the following applications and packages:

### Applications

- `apps/web`: Next.js web application.
- `apps/api`: Express API server.

### Packages

- `packages/eslint-config`: Centralized ESLint config.
- `packages/prettier-config`: Shared Prettier formatting rules.
- `packages/typescript-config`: Base TypeScript configuration.
- `packages/db`: Shared Prisma-based database access layer.
- `packages/ui`: Reusable UI components built with `shadcn/ui`.
- `packages/utils`: Common utilities and shared TypeScript types.

---

## Getting Started

### Setting up `apps/web`

To set up and run the web application (`apps/web`), follow the instructions in [apps/web/README.md](apps/web/README.md).

### Setting up `apps/api`

To set up and run the API server (`apps/api`), follow the instructions in [apps/api/README.md](apps/api/README.md).

---

## Root-Level Scripts

The following scripts are available at the root of the monorepo:

| Script             | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `pnpm build`       | Runs `turbo build` to build all apps and packages.          |
| `pnpm clean`       | Clears the Turborepo cache and outputs.                     |
| `pnpm dev`         | Runs `turbo dev` to start development servers concurrently. |
| `pnpm lint`        | Lints all workspaces using the shared ESLint config.        |
| `pnpm format`      | Formats code using Prettier across the monorepo.            |
| `pnpm check-types` | Checks types across all workspaces using TypeScript.        |
| `pnpm start`       | Starts the production server for all apps.                  |

---

## UI Components (shadcn/ui)

### Usage

```bash
pnpm dlx shadcn@latest init
```

### Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

### Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

### Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
