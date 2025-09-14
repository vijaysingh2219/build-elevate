# Turborepo Monorepo Template

This template is for creating a monorepo with

- [Turborepo](https://turborepo.com/) for monorepo management
- [Next.js](https://nextjs.org/) (with Turbopack) for the web application
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [ESLint](https://eslint.org/) for linting
- [Prettier](https://prettier.io/) for code formatting
- [pnpm](https://pnpm.io/) as the package manager

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
