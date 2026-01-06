# build-elevate

A modern full-stack monorepo starter with Next.js, Express, and Better Auth

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![downloads](https://img.shields.io/npm/dy/build-elevate)](https://www.npmjs.com/package/build-elevate)
[![npm](https://img.shields.io/npm/v/build-elevate)](https://www.npmjs.com/package/build-elevate)

## Overview

[build-elevate](https://github.com/vijaysingh2219/build-elevate) is a full-stack monorepo starter that gets you from idea to production faster. Built with [Turborepo](https://turborepo.org/), it combines a Next.js frontend, Express backend, and shared packages into one cohesive development experience.

Perfect for SaaS applications, web platforms, or any project that needs authentication, database integration, and a professional UI out of the box.

### Why build-elevate?

- **Ready to Ship** — Pre-configured authentication, database, email, and UI components
- **Developer Experience** — Hot reload, type safety, and monorepo benefits from day one
- **Modular Design** — Shared packages make code reuse effortless across frontend and backend
- **Security First** — Better Auth integration with session management and OAuth providers
- **Production Ready** — Docker setup, CI/CD workflows, and deployment best practices included

## Features

### Applications

- **apps/web** — Next.js 16 app with Turbopack, authentication, and modern UI
- **apps/api** — Express server with RESTful API endpoints and health monitoring
- **apps/email** — React Email templates with hot reload preview
- **apps/studio** — Prisma Studio for database management

### Shared Packages

| Package                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| **@workspace/auth**       | Better Auth setup with session management and OAuth |
| **@workspace/db**         | Prisma schema and database client for PostgreSQL    |
| **@workspace/ui**         | shadcn/ui components with Tailwind CSS              |
| **@workspace/email**      | React Email templates and Resend integration        |
| **@workspace/utils**      | Shared utilities and TypeScript types               |
| **@workspace/rate-limit** | API rate limiting utilities                         |

### Configuration Packages

- **eslint-config** — Unified linting rules for all workspaces
- **prettier-config** — Consistent code formatting
- **typescript-config** — Shared TypeScript compiler options
- **jest-presets** — Testing configuration for Node and React

### Built With

[Turborepo](https://turborepo.com/) · [Next.js 16](https://nextjs.org/) · [Express](https://expressjs.com/) · [TypeScript](https://www.typescriptlang.org/) · [Docker](https://www.docker.com/) · [Prisma](https://www.prisma.io/) · [PostgreSQL](https://www.postgresql.org/) · [shadcn/ui](https://ui.shadcn.com/) · [Tailwind CSS](https://tailwindcss.com/) · [Better Auth](https://www.better-auth.com/) · [React Email](https://react.email/) · [Resend](https://resend.com/) · [Tanstack Query](https://tanstack.com/query/latest) · [ESLint](https://eslint.org/) · [Prettier](https://prettier.io/) · [Jest](https://jestjs.io/) · [GitHub Actions](https://github.com/features/actions) · [pnpm](https://pnpm.io/)

## Getting Started

### Requirements

Make sure you have these installed:

- **Node.js** 20 or higher
- **pnpm** 10+ (recommended)
- **PostgreSQL** database

### Quick Start

1. **Create a new project**

   ```bash
   pnpm dlx build-elevate@latest init
   ```

2. **Configure environment variables**

   Configure files in these directories and fill in your values:
   - `apps/web/.env.local`
   - `apps/api/.env`
   - `packages/db/.env`

3. **Initialize the database**

   ```bash
   cd packages/db
   pnpm db:migrate
   cd ../..
   ```

4. **Start development servers**

   ```bash
   pnpm dev
   ```

**You're ready!** Open:

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:4000](http://localhost:4000)

## Structure

```plaintext
build-elevate/
├── apps/
│   ├── web/             # Next.js frontend (localhost:3000)
│   ├── api/             # Express backend (localhost:4000)
│   ├── email/           # Email preview server
│   └── studio/          # Database UI
├── packages/
│   ├── auth/            # Authentication logic
│   ├── db/              # Prisma schema & client
│   ├── ui/              # React components
│   ├── email/           # Email templates
│   ├── utils/           # Shared helpers
│   └── rate-limit/      # API protection
└── turbo.json           # Turborepo pipeline config
```

Packages are shared across apps for consistency and maintainability.

## Available Scripts

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Start development servers for all apps     |
| `pnpm build`       | Build all apps and packages                |
| `pnpm start`       | Start production servers                   |
| `pnpm lint`        | Lint all workspaces                        |
| `pnpm format`      | Format code with Prettier                  |
| `pnpm check-types` | Type-check all workspaces                  |
| `pnpm test`        | Run tests across all workspaces            |
| `pnpm clean`       | Clear Turborepo cache                      |
| `pnpm docker:prod` | Build and run production Docker containers |

## Docker Deployment

Production-ready Docker setup with docker-compose:

```bash
pnpm docker:prod
```

This spins up:

- **Web app** → `localhost:3000`
- **API server** → `localhost:4000`
- **PostgreSQL** → `localhost:5432`

Features:

- Multi-stage builds for minimal image size
- Non-root user execution for security
- Turbo pruning for optimized workspace dependencies

## Documentation

For detailed documentation, see:

- [Web App Documentation](apps/web/README.md) - Next.js application
- [API Documentation](apps/api/README.md) - Express server
- [UI Components Guide](packages/ui/README.md) - shadcn/ui components
- [Screenshots](SCREENSHOTS.md) - Visual overview of the UI

## License

MIT License. See the [LICENSE](LICENSE) file for details.
