export type ChangeCategory =
  | "added"
  | "changed"
  | "fixed"
  | "deprecated"
  | "removed"
  | "security"
  | "performance";

export interface ChangeEntry {
  category: ChangeCategory;
  text: string;
}

export interface ChangelogEntry {
  version: string;
  date: string; // ISO date string (YYYY-MM-DD)
  tag: ReleaseTag;
  title: string;
  summary?: string;
  changes: ChangeEntry[];
}

export const categoryMeta: Record<
  ChangeCategory,
  { label: string; text: string; dot: string }
> = {
  added: {
    label: "Added",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  changed: {
    label: "Changed",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500 dark:bg-blue-400",
  },
  fixed: {
    label: "Fixed",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  deprecated: {
    label: "Deprecated",
    text: "text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-500 dark:bg-yellow-400",
  },
  removed: {
    label: "Removed",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500 dark:bg-red-400",
  },
  security: {
    label: "Security",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500 dark:bg-orange-400",
  },
  performance: {
    label: "Performance",
    text: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-500 dark:bg-cyan-400",
  },
};

/** Categories in the order they should be displayed within a release. */
export const CATEGORY_ORDER: ChangeCategory[] = [
  "added",
  "changed",
  "fixed",
  "removed",
  "deprecated",
  "security",
  "performance",
];

/** Canonical site origin, used for changelog metadata and the RSS feed. */
export const SITE_URL = "https://build-elevate.vercel.app";

/** Stable anchor id for a release version (e.g. "1.3.0" → "v1-3-0"). */
export function versionAnchor(version: string): string {
  return `v${version.replace(/\./g, "-")}`;
}

/** Formats an ISO date string as a human-readable date (e.g. "June 6, 2026"). */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export type ReleaseTag =
  | "latest"
  | "major"
  | "minor"
  | "patch"
  | "yanked"
  | "security";

/**
 * Changelog entries in reverse chronological order.
 */
export const changelog: ChangelogEntry[] = [
  {
    version: "1.4.0",
    date: "2026-06-07",
    tag: "latest",
    title: "Structured Logging, RSC Pages & Changelog Site",
    summary:
      "Adds a shared structured logging package adopted across the API, converts the authenticated web pages to React Server Components for a faster first paint, and rebuilds the documentation changelog with an RSS feed and refreshed navigation.",
    changes: [
      {
        category: "added",
        text: "New `@workspace/logger` package wrapping pino with env-based log level (`LOG_LEVEL`), sensitive-key redaction, and pino-pretty for local development — adopted across the API with pino-http per-request logging (health-check routes skipped, child logger on `req.log`) replacing morgan and ad-hoc console calls",
      },
      {
        category: "added",
        text: "Rebuilt changelog page with color-coded entries grouped by change type, a `/changelog/rss.xml` feed, a reusable `CopyButton` and NPM brand icon, and Documentation/Changelog/NPM links in the shared nav",
      },
      {
        category: "added",
        text: "`.markdownlint.yaml` config for linting Markdown content",
      },
      {
        category: "changed",
        text: "Converted the profile, dashboard, and settings (general/security/activity) pages to React Server Components that fetch the session server-side and pass data into client children — eliminating skeleton flash, `useEffect` form resets, and the activity data waterfall; added route-level loading/error boundaries and a shared `requireUser()` server guard",
      },
      {
        category: "changed",
        text: "Trust the first proxy hop in production so the real client IP is resolved for request logs",
      },
      {
        category: "removed",
        text: "Dropped the now-unused `/api/sessions` route; sessions are fetched server-side via `auth.api.listSessions`",
      },
    ],
  },
  {
    version: "1.3.0",
    date: "2026-06-06",
    tag: "minor",
    title: "Kubernetes Deployments & CI Upgrades",
    summary:
      "Adds first-class Kubernetes support with deployment manifests, deploy/verify scripts, and an opt-in scaffolding flow, plus health probe endpoints. Also upgrades the GitHub Actions workflow and adds Turborepo caching across CI jobs.",
    changes: [
      {
        category: "added",
        text: "Kubernetes deployment manifests for the API and web apps — Namespace, ConfigMap, Deployments, ClusterIP Services, nginx Ingress with `/api/v1/*` rewrite, and HPAs (2–10 replicas)",
      },
      {
        category: "added",
        text: "`deploy.sh` to build/push images and apply all manifests, plus a CI-friendly `k8s/verify.sh` that health-checks pods, endpoints, in-cluster HTTP, ingress, and HPA metrics — exposed as `k8s:deploy` and `k8s:verify` pnpm scripts",
      },
      {
        category: "added",
        text: "`/readyz` and `/healthz` probe endpoints on the API server for Kubernetes liveness and readiness checks",
      },
      {
        category: "added",
        text: "Opt-in Kubernetes prompt during scaffolding (Docker-gated, defaults to No) with per-template manifest pruning and full upgrader integration",
      },
      {
        category: "added",
        text: "Kubernetes deployment guide added to the documentation site",
      },
      {
        category: "changed",
        text: "Bake `API_INTERNAL_URL` into the web Docker image at build time so server-side rendering can reach the API in-cluster",
      },
      {
        category: "changed",
        text: "Upgraded the GitHub Actions workflow — actions/checkout, setup-node, and pnpm/action-setup to v6, Node.js 20 → 24, pnpm 10 → 11.1.1, and switched to the native setup-node pnpm cache",
      },
      {
        category: "performance",
        text: "Added Turborepo cache restoration to the lint, type-check, test, and build CI jobs for faster pipeline runs",
      },
      {
        category: "fixed",
        text: "Stripped unnecessary quotes from `DATABASE_URL` values in `.env.example` files",
      },
    ],
  },
  {
    version: "1.2.6",
    date: "2026-05-26",
    tag: "minor",
    title: "Vitest Migration Complete & Jest Removal",
    summary:
      "Completes the monorepo migration to Vitest, removes Jest dependencies and presets, and updates docs and workspace configuration to match the new test stack.",
    changes: [
      {
        category: "changed",
        text: "Migrated the API app from Jest to Vitest and aligned test scripts, config, and setup with the shared workspace preset",
      },
      {
        category: "removed",
        text: "Removed Jest dependencies, presets, and config files now that the workspace test suite runs on Vitest",
      },
      {
        category: "changed",
        text: "Updated docs, package metadata, and workspace configuration to remove Jest references and reflect the Vitest-based test setup",
      },
    ],
  },
  {
    version: "1.2.5",
    date: "2026-05-25",
    tag: "latest",
    title: "Contracts Package Split & Workspace Config Updates",
    summary:
      "Adds a new shared contracts package for validation schemas and refreshes workspace package configuration to match the updated monorepo layout.",
    changes: [
      {
        category: "changed",
        text: "Introduced `@workspace/contracts` for shared Zod schemas and moved auth validation out of `@workspace/utils`",
      },
      {
        category: "changed",
        text: "Updated web auth and security flows to import schemas from `@workspace/contracts`",
      },
      {
        category: "changed",
        text: "Refreshed workspace package configs, dependencies, and lockfile entries.",
      },
      {
        category: "changed",
        text: "Updated docs content for the utils and contracts packages to describe the new split",
      },
    ],
  },
  {
    version: "1.2.4",
    date: "2026-05-16",
    tag: "minor",
    title: "Web Shell Refresh & API Rewrite Support",
    summary:
      "Adds reusable empty states, refreshes the web shell, and introduces API rewrite support alongside supporting workspace and tooling fixes.",
    changes: [
      {
        category: "added",
        text: "Added reusable empty state components and refreshed the web shell experience",
      },
      {
        category: "added",
        text: "Introduced API rewrite support with a shared web API client",
      },
      {
        category: "changed",
        text: "Simplified URL schemas across auth, database, and rate limit packages",
      },
      {
        category: "changed",
        text: "Updated the docs collections alias and related configuration to match the current content layout",
      },
      {
        category: "changed",
        text: "Added a dev Docker script, updated CI environment wiring, and refreshed package metadata for the workspace",
      },
      {
        category: "fixed",
        text: "Added Node types to the rate-limit tsconfig so type checking works consistently",
      },
    ],
  },
  {
    version: "1.2.3",
    date: "2026-04-11",
    tag: "patch",
    title: "Docker Compose Project Name Replacement Fix",
    summary:
      "Ensures scaffolded project name replacement also updates the Docker compose file so generated projects stay consistent.",
    changes: [
      {
        category: "fixed",
        text: "Included `docker-compose.yml` in project name replacement files so scaffolded project names update everywhere",
      },
    ],
  },
  {
    version: "1.2.2",
    date: "2026-04-02",
    tag: "patch",
    title: "Manifest Path Fix for Generated Prisma Client",
    summary:
      "Fixes manifest generation by correcting the skipped generated Prisma client directory path so internal generated artifacts are excluded consistently during hashing.",
    changes: [
      {
        category: "fixed",
        text: "Updated manifest skip directory from `generated/prisma` to `packages/db/generated` to correctly exclude generated Prisma client files",
      },
    ],
  },
  {
    version: "1.2.1",
    date: "2026-03-26",
    tag: "minor",
    title: "CLI Template Transformations Refactoring",
    summary:
      "Refactors the scaffolding CLI by extracting and composing template transformations into modular, reusable units for improved maintainability and easier future enhancements.",
    changes: [
      {
        category: "changed",
        text: "Extracted template transformation logic into separate, composable modules for better code organization",
      },
      {
        category: "changed",
        text: "Refactored scaffold initialization, readme generation, and upgrade workflows to use composed transformations",
      },
      {
        category: "changed",
        text: "Added `lint:fix` script and turbo task for automated code style corrections across the monorepo",
      },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-03-23",
    tag: "minor",
    title: "Upgrade Command & Template Diffing",
    summary:
      "Adds an upgrade workflow that keeps scaffolded projects in sync with the latest build-elevate template. Files that haven't been modified locally are updated automatically, while modified files are flagged as conflicts and can be inspected with a built-in diff command.",
    changes: [
      {
        category: "added",
        text: "Introduced the `upgrade` command to automatically update files that remain unchanged since scaffolding, while marking modified files as conflicts for manual review.",
      },
      {
        category: "added",
        text: "Added a `diff` command that shows a colored, line-by-line comparison between your scaffolded version of a file and the latest template version.",
      },
      {
        category: "added",
        text: "Created a `.build-elevate.json` manifest during initialization to store the scaffolded commit SHA, template name, project metadata, and per-file hashes used during upgrades.",
      },
      {
        category: "added",
        text: "Template-aware upgrade filtering ensures projects only receive updates for files that were included during scaffolding (e.g., web projects will not receive api-specific files).",
      },
      {
        category: "fixed",
        text: "Upgrade now applies initialization-time transformations before comparing template files, preventing false conflicts in files like `package.json`, `turbo.json`, and `pnpm-workspace.yaml`.",
      },
      {
        category: "fixed",
        text: "Normalized line endings (CRLF → LF) before hashing to prevent false conflicts on Windows environments.",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-03-12",
    tag: "minor",
    title: "Auth Forms, UI Improvements & Fixes",
    summary:
      "Introduced reusable form field components, improved authentication UI structure, upgraded core dependencies, and fixed CI and documentation issues while strengthening auth configuration security.",
    changes: [
      {
        category: "added",
        text: "Reusable, composable form field components added to the shared UI package",
      },
      {
        category: "changed",
        text: "Split the unified CredentialsForm into separate SignInForm and SignUpForm components for a cleaner auth UI",
      },
      {
        category: "changed",
        text: "Updated shadcn/ui components to use unified @radix-ui primitives",
      },
      {
        category: "changed",
        text: "Upgraded Zod to v4 for improved schema validation performance and API",
      },
      {
        category: "fixed",
        text: "Fixed missing environment variables in the CI build job",
      },
      {
        category: "security",
        text: "Shared a single auth secret across all environment files to prevent secret drift",
      },
    ],
  },
  {
    version: "1.0.9",
    date: "2026-03-02",
    tag: "security",
    title: "Auth Secret Consistency & Security Improvement",
    summary:
      "Improved authentication security by standardizing the auth secret across all environment files to prevent configuration drift.",
    changes: [
      {
        category: "security",
        text: "Shared a single auth secret across all environment files to prevent secret drift",
      },
    ],
  },
  {
    version: "1.0.8",
    date: "2026-02-03",
    tag: "patch",
    title: "Improved App Name Handling in Scaffolding",
    summary:
      "Improved project scaffolding to support whitespace in app names, automatically trimming and formatting them for environment variables and display.",
    changes: [
      {
        category: "changed",
        text: "Accept whitespace format of app name, and trim it for use in env vars and display (e.g. 'My App' becomes MY_APP in env vars and 'My App' in display)",
      },
    ],
  },
  {
    version: "1.0.7",
    date: "2026-02-03",
    tag: "patch",
    title: "Monorepo Fixes & Environment Improvements",
    summary:
      "Improved development environment loading, resolved monorepo dependency resolution issues, fixed lint errors in scaffolded apps, and added metadataBase to eliminate configuration warnings.",
    changes: [
      {
        category: "changed",
        text: "Load package env vars in development",
      },
      {
        category: "fixed",
        text: "Fixed a lint error present in newly scaffolded apps",
      },
      {
        category: "fixed",
        text: "Resolved package resolution errors for pg and prettier in monorepo installs",
      },
      {
        category: "fixed",
        text: "Added metadataBase to site config to remove the warn log",
      },
    ],
  },
  {
    version: "1.0.6",
    date: "2026-02-03",
    tag: "major",
    title: "Scaffolding Enhancements, Documentation Site & Fixes",
    summary:
      "Enhanced project scaffolding with automatic package manager detection, introduced a Fumadocs-powered documentation site with structured MDX content, added tooling to generate documentation for scaffolded apps, and fixed formatting checks during scaffolding.",
    changes: [
      {
        category: "added",
        text: "Fumadocs-powered documentation site with full structured MDX content",
      },
      {
        category: "added",
        text: "Package manager detection with adaptive CLI options during project scaffolding",
      },
      {
        category: "changed",
        text: "Add a script to create structured documentation content on the scaffolded apps by template",
      },

      {
        category: "fixed",
        text: "Fixed formatting check failures during scaffolding",
      },
    ],
  },
  {
    version: "1.0.5",
    date: "2026-01-09",
    tag: "minor",
    title: "Developer experience improvements",
    summary:
      "Improved developer experience by enhancing the scaffolding CLI with multi-package-manager support, adding tooling for environment setup and code formatting, refining project initialization, and improving configuration consistency across templates.",
    changes: [
      {
        category: "added",
        text: "Added support for multiple package managers (npm, pnpm, bun) in Scaffolding CLI",
      },
      {
        category: "added",
        text: "Format check on scaffolding to ensure new projects adhere to code style standards",
      },
      {
        category: "added",
        text: "Turbo environment variable setup script",
      },
      {
        category: "added",
        text: "generatePageMetadata utility for per-page SEO metadata generation",
      },
      {
        category: "changed",
        text: "Improved project initialization flow and CLI prompts for a better developer experience",
      },
      {
        category: "changed",
        text: "Update script to include environment variables required by each template for turbo tasks",
      },
      {
        category: "changed",
        text: "Update eslint-config for nextjs web app to extend from the root config for better consistency",
      },
      {
        category: "removed",
        text: "Removed auth/client.ts in api only scaffolded projects since it is only needed for the web app",
      },
    ],
  },
  {
    version: "1.0.4",
    date: "2026-01-07",
    tag: "patch",
    title: "Scaffolding script improvements",
    summary:
      "Improved project scaffolding scripts, optimized Docker Compose for production, refined GitHub workflow triggers, reorganized monorepo dependencies, and fixed the Prisma Studio script.",
    changes: [
      {
        category: "changed",
        text: "Update scripts to update pnpm catalog, docker-compose file on scaffolding new projects",
      },
      {
        category: "changed",
        text: "Optimized Docker Compose configuration for production environments",
      },
      {
        category: "changed",
        text: "Ignore .md changes in GitHub workflows to prevent unnecessary CI runs on documentation updates",
      },
      {
        category: "changed",
        text: "Use explicit paths filter to trigger the github workflows",
      },
      {
        category: "changed",
        text: "Updated Documentation and Getting Started guide on README.md",
      },
      {
        category: "changed",
        text: "Moved better-auth from the web app to the core workspace package for better reuse",
      },
      {
        category: "changed",
        text: "Moved shared dependencies to the core catalog to reduce duplication across packages",
      },
      {
        category: "fixed",
        text: "Fixed Prisma Studio app script after a Prisma version bump",
      },
    ],
  },
  {
    version: "1.0.3",
    date: "2026-01-05",
    tag: "minor",
    title: "Added scaffolding scripts",
    summary:
      "Initial scaffolding scripts to bootstrap new projects from the monorepo template, along with improvements to environment variable management and documentation updates.",
    changes: [
      {
        category: "added",
        text: "Scaffolding scripts to bootstrap new projects from the monorepo template",
      },
      {
        category: "changed",
        text: "Make env placeholder values more descriptive",
      },
      {
        category: "changed",
        text: "Made Environment variable management more consistent across all packages",
      },
    ],
  },
  {
    version: "1.0.2",
    date: "2026-01-05",
    tag: "major",
    title: "Foundation Release",
    summary:
      "The effective initial release. Includes the full monorepo foundation, Better-Auth migration, email system, 2FA, session management, and account security suite.",
    changes: [
      // Monorepo & Infrastructure
      {
        category: "added",
        text: "Turborepo monorepo with apps/ and packages/ structure",
      },
      {
        category: "added",
        text: "Next.js web app with App Router, Tailwind CSS, and shadcn/ui",
      },
      {
        category: "added",
        text: "Express API server with TypeScript, structured routing, and a 404 catch-all",
      },
      {
        category: "added",
        text: "Shared packages: ui, utils, auth, db, email, eslint-config, typescript-config",
      },
      {
        category: "added",
        text: "Docker Compose setup for local development and production deployments",
      },
      {
        category: "added",
        text: "GitHub Actions CI with lint, type-check, and test jobs",
      },
      {
        category: "added",
        text: "Jest testing setup with shared workspace presets",
      },

      // Authentication
      {
        category: "added",
        text: "Better-Auth with email/password sign-in and sign-up flows",
      },
      {
        category: "added",
        text: "Dedicated @workspace/auth package with centralized auth logic and TypeScript support",
      },
      {
        category: "added",
        text: "Authentication middleware for the Express API with protected route support",
      },
      {
        category: "added",
        text: "Rate limiting for API calls and verification email requests with configurable strategies",
      },
      {
        category: "added",
        text: "Email verification on sign-up",
      },
      {
        category: "added",
        text: "Two-factor authentication (2FA) with TOTP support, including setup flow for OAuth users",
      },
      {
        category: "added",
        text: "Forgot/reset password flow with secure token-based email links",
      },
      {
        category: "added",
        text: "Email change flow with a verification step",
      },
      {
        category: "added",
        text: "Social login connect/disconnect cards in account settings",
      },

      // Account & UI
      {
        category: "added",
        text: "Session activity UI and API — view and manage active sessions across devices",
      },
      {
        category: "added",
        text: "Revoke all sessions from the security settings page",
      },
      {
        category: "added",
        text: "User profile, account settings, and security settings pages",
      },
      {
        category: "added",
        text: "Account deletion with a post-deletion goodbye page",
      },
      {
        category: "added",
        text: "Light/dark/system theme switcher",
      },
      {
        category: "added",
        text: "React Email + Resend email package with in-app preview",
      },
      {
        category: "added",
        text: "Refreshed email templates with a modern design",
      },
      {
        category: "added",
        text: "Responsive layout across auth and settings pages",
      },

      // Database & Config
      {
        category: "added",
        text: "Prisma ORM with PostgreSQL support and auto-generated client",
      },
      {
        category: "added",
        text: "Prisma Studio as a standalone app in the monorepo",
      },
      {
        category: "added",
        text: "Environment validation using @t3-oss/env for fail-fast startup errors",
      },
      {
        category: "added",
        text: "Husky git hooks for pre-commit linting and formatting enforcement",
      },

      // Bug Fixes
      {
        category: "fixed",
        text: "Fixed hydration error on authentication pages",
      },
      {
        category: "security",
        text: "Prevented client-side access to server-only environment variables",
      },
    ],
  },
  {
    version: "1.0.1",
    date: "2026-01-05",
    tag: "yanked",
    title: "Unpublished from npm.",
    summary:
      "Unpublished from npm. No functional changes — version created to reclaim 1.0.0 slot after accidental deletion. Use v1.0.2 instead.",
    changes: [],
  },
  {
    version: "1.0.0",
    date: "2026-01-05",
    tag: "yanked",
    title: "Unpublished from npm.",
    summary:
      "Unpublished from npm. Original initial release — no longer installable. All changes are included in v1.0.2.",
    changes: [],
  },
];
