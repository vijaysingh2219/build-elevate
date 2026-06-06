# Changelog

All changes, fixes and updates to build-elevate.

The format is based on [Keep a Changelog](https://keepachangelog.com).
`Latest` is derived from position and is not stored here.

## [Unreleased]

Nothing yet.

## [1.3.0] - 2026-06-06 [Minor] - Kubernetes Deployments & CI Upgrades

Adds first-class Kubernetes support with deployment manifests, deploy/verify scripts, and an opt-in scaffolding flow, plus health probe endpoints. Also upgrades the GitHub Actions workflow and adds Turborepo caching across CI jobs.

### Added

- **Kubernetes:** Kubernetes deployment manifests for the API and web apps — Namespace, ConfigMap, Deployments, ClusterIP Services, nginx Ingress with `/api/v1/*` rewrite, and HPAs (2–10 replicas)
- **Kubernetes:** `deploy.sh` to build/push images and apply all manifests, plus a CI-friendly `k8s/verify.sh` that health-checks pods, endpoints, in-cluster HTTP, ingress, and HPA metrics — exposed as `k8s:deploy` and `k8s:verify` pnpm scripts
- **Kubernetes:** `/readyz` and `/healthz` probe endpoints on the API server for Kubernetes liveness and readiness checks
- **Kubernetes:** Opt-in Kubernetes prompt during scaffolding (Docker-gated, defaults to No) with per-template manifest pruning and full upgrader integration
- **Kubernetes:** Kubernetes deployment guide added to the documentation site

### Changed

- **Kubernetes:** Bake `API_INTERNAL_URL` into the web Docker image at build time so server-side rendering can reach the API in-cluster
- **CI & Tooling:** Upgraded the GitHub Actions workflow — actions/checkout, setup-node, and pnpm/action-setup to v6, Node.js 20 → 24, pnpm 10 → 11.1.1, and switched to the native setup-node pnpm cache

### Fixed

- **CI & Tooling:** Stripped unnecessary quotes from `DATABASE_URL` values in `.env.example` files

### Performance

- **CI & Tooling:** Added Turborepo cache restoration to the lint, type-check, test, and build CI jobs for faster pipeline runs

## [1.2.6] - 2026-05-26 [Minor] - Vitest Migration Complete & Jest Removal

Completes the monorepo migration to Vitest, removes Jest dependencies and presets, and updates docs and workspace configuration to match the new test stack.

### Changed

- Migrated the API app from Jest to Vitest and aligned test scripts, config, and setup with the shared workspace preset
- Updated docs, package metadata, and workspace configuration to remove Jest references and reflect the Vitest-based test setup

### Removed

- Removed Jest dependencies, presets, and config files now that the workspace test suite runs on Vitest

## [1.2.5] - 2026-05-25 [Patch] - Contracts Package Split & Workspace Config Updates

Adds a new shared contracts package for validation schemas and refreshes workspace package configuration to match the updated monorepo layout.

### Changed

- Introduced `@workspace/contracts` for shared Zod schemas and moved auth validation out of `@workspace/utils`
- Updated web auth and security flows to import schemas from `@workspace/contracts`
- Refreshed workspace package configs, dependencies, and lockfile entries.
- Updated docs content for the utils and contracts packages to describe the new split

## [1.2.4] - 2026-05-16 [Minor] - Web Shell Refresh & API Rewrite Support

Adds reusable empty states, refreshes the web shell, and introduces API rewrite support alongside supporting workspace and tooling fixes.

### Added

- Added reusable empty state components and refreshed the web shell experience
- Introduced API rewrite support with a shared web API client

### Changed

- Simplified URL schemas across auth, database, and rate limit packages
- Updated the docs collections alias and related configuration to match the current content layout
- Added a dev Docker script, updated CI environment wiring, and refreshed package metadata for the workspace

### Fixed

- Added Node types to the rate-limit tsconfig so type checking works consistently

## [1.2.3] - 2026-04-11 [Patch] - Docker Compose Project Name Replacement Fix

Ensures scaffolded project name replacement also updates the Docker compose file so generated projects stay consistent.

### Fixed

- Included `docker-compose.yml` in project name replacement files so scaffolded project names update everywhere

## [1.2.2] - 2026-04-02 [Patch] - Manifest Path Fix for Generated Prisma Client

Fixes manifest generation by correcting the skipped generated Prisma client directory path so internal generated artifacts are excluded consistently during hashing.

### Fixed

- Updated manifest skip directory from `generated/prisma` to `packages/db/generated` to correctly exclude generated Prisma client files

## [1.2.1] - 2026-03-26 [Minor] - CLI Template Transformations Refactoring

Refactors the scaffolding CLI by extracting and composing template transformations into modular, reusable units for improved maintainability and easier future enhancements.

### Changed

- Extracted template transformation logic into separate, composable modules for better code organization
- Refactored scaffold initialization, readme generation, and upgrade workflows to use composed transformations
- Added `lint:fix` script and turbo task for automated code style corrections across the monorepo

## [1.2.0] - 2026-03-23 [Minor] - Upgrade Command & Template Diffing

Adds an upgrade workflow that keeps scaffolded projects in sync with the latest build-elevate template. Files that haven't been modified locally are updated automatically, while modified files are flagged as conflicts and can be inspected with a built-in diff command.

### Added

- Introduced the `upgrade` command to automatically update files that remain unchanged since scaffolding, while marking modified files as conflicts for manual review.
- Added a `diff` command that shows a colored, line-by-line comparison between your scaffolded version of a file and the latest template version.
- Created a `.build-elevate.json` manifest during initialization to store the scaffolded commit SHA, template name, project metadata, and per-file hashes used during upgrades.
- Template-aware upgrade filtering ensures projects only receive updates for files that were included during scaffolding (e.g., web projects will not receive api-specific files).

### Fixed

- Upgrade now applies initialization-time transformations before comparing template files, preventing false conflicts in files like `package.json`, `turbo.json`, and `pnpm-workspace.yaml`.
- Normalized line endings (CRLF → LF) before hashing to prevent false conflicts on Windows environments.

## [1.1.0] - 2026-03-12 [Minor] - Auth Forms, UI Improvements & Fixes

Introduced reusable form field components, improved authentication UI structure, upgraded core dependencies, and fixed CI and documentation issues while strengthening auth configuration security.

### Added

- Reusable, composable form field components added to the shared UI package

### Changed

- Split the unified CredentialsForm into separate SignInForm and SignUpForm components for a cleaner auth UI
- Updated shadcn/ui components to use unified @radix-ui primitives
- Upgraded Zod to v4 for improved schema validation performance and API

### Fixed

- Fixed missing environment variables in the CI build job

### Security

- Shared a single auth secret across all environment files to prevent secret drift

## [1.0.9] - 2026-03-02 [Security] - Auth Secret Consistency & Security Improvement

Improved authentication security by standardizing the auth secret across all environment files to prevent configuration drift.

### Security

- Shared a single auth secret across all environment files to prevent secret drift

## [1.0.8] - 2026-02-03 [Patch] - Improved App Name Handling in Scaffolding

Improved project scaffolding to support whitespace in app names, automatically trimming and formatting them for environment variables and display.

### Changed

- Accept whitespace format of app name, and trim it for use in env vars and display (e.g. 'My App' becomes MY_APP in env vars and 'My App' in display)

## [1.0.7] - 2026-02-03 [Patch] - Monorepo Fixes & Environment Improvements

Improved development environment loading, resolved monorepo dependency resolution issues, fixed lint errors in scaffolded apps, and added metadataBase to eliminate configuration warnings.

### Changed

- Load package env vars in development

### Fixed

- Fixed a lint error present in newly scaffolded apps
- Resolved package resolution errors for pg and prettier in monorepo installs
- Added metadataBase to site config to remove the warn log

## [1.0.6] - 2026-02-03 [Major] - Scaffolding Enhancements, Documentation Site & Fixes

Enhanced project scaffolding with automatic package manager detection, introduced a Fumadocs-powered documentation site with structured MDX content, added tooling to generate documentation for scaffolded apps, and fixed formatting checks during scaffolding.

### Added

- Fumadocs-powered documentation site with full structured MDX content
- Package manager detection with adaptive CLI options during project scaffolding

### Changed

- Add a script to create structured documentation content on the scaffolded apps by template

### Fixed

- Fixed formatting check failures during scaffolding

## [1.0.5] - 2026-01-09 [Minor] - Developer experience improvements

Improved developer experience by enhancing the scaffolding CLI with multi-package-manager support, adding tooling for environment setup and code formatting, refining project initialization, and improving configuration consistency across templates.

### Added

- Added support for multiple package managers (npm, pnpm, bun) in Scaffolding CLI
- Format check on scaffolding to ensure new projects adhere to code style standards
- Turbo environment variable setup script
- generatePageMetadata utility for per-page SEO metadata generation

### Changed

- Improved project initialization flow and CLI prompts for a better developer experience
- Update script to include environment variables required by each template for turbo tasks
- Update eslint-config for nextjs web app to extend from the root config for better consistency

### Removed

- Removed auth/client.ts in api only scaffolded projects since it is only needed for the web app

## [1.0.4] - 2026-01-07 [Patch] - Scaffolding script improvements

Improved project scaffolding scripts, optimized Docker Compose for production, refined GitHub workflow triggers, reorganized monorepo dependencies, and fixed the Prisma Studio script.

### Changed

- Update scripts to update pnpm catalog, docker-compose file on scaffolding new projects
- Optimized Docker Compose configuration for production environments
- Ignore .md changes in GitHub workflows to prevent unnecessary CI runs on documentation updates
- Use explicit paths filter to trigger the github workflows
- Updated Documentation and Getting Started guide on README.md
- Moved better-auth from the web app to the core workspace package for better reuse
- Moved shared dependencies to the core catalog to reduce duplication across packages

### Fixed

- Fixed Prisma Studio app script after a Prisma version bump

## [1.0.3] - 2026-01-05 [Minor] - Added scaffolding scripts

Initial scaffolding scripts to bootstrap new projects from the monorepo template, along with improvements to environment variable management and documentation updates.

### Added

- Scaffolding scripts to bootstrap new projects from the monorepo template

### Changed

- Make env placeholder values more descriptive
- Made Environment variable management more consistent across all packages

## [1.0.2] - 2026-01-05 [Major] - Foundation Release

The effective initial release. Includes the full monorepo foundation, Better-Auth migration, email system, 2FA, session management, and account security suite.

### Added

- **Monorepo & Infrastructure:** Turborepo monorepo with apps/ and packages/ structure
- **Monorepo & Infrastructure:** Next.js web app with App Router, Tailwind CSS, and shadcn/ui
- **Monorepo & Infrastructure:** Express API server with TypeScript, structured routing, and a 404 catch-all
- **Monorepo & Infrastructure:** Shared packages: ui, utils, auth, db, email, eslint-config, typescript-config
- **Monorepo & Infrastructure:** Docker Compose setup for local development and production deployments
- **Monorepo & Infrastructure:** GitHub Actions CI with lint, type-check, and test jobs
- **Monorepo & Infrastructure:** Jest testing setup with shared workspace presets
- **Authentication:** Better-Auth with email/password sign-in and sign-up flows
- **Authentication:** Dedicated @workspace/auth package with centralized auth logic and TypeScript support
- **Authentication:** Authentication middleware for the Express API with protected route support
- **Authentication:** Rate limiting for API calls and verification email requests with configurable strategies
- **Authentication:** Email verification on sign-up
- **Authentication:** Two-factor authentication (2FA) with TOTP support, including setup flow for OAuth users
- **Authentication:** Forgot/reset password flow with secure token-based email links
- **Authentication:** Email change flow with a verification step
- **Authentication:** Social login connect/disconnect cards in account settings
- **Account & UI:** Session activity UI and API — view and manage active sessions across devices
- **Account & UI:** Revoke all sessions from the security settings page
- **Account & UI:** User profile, account settings, and security settings pages
- **Account & UI:** Account deletion with a post-deletion goodbye page
- **Account & UI:** Light/dark/system theme switcher
- **Account & UI:** React Email + Resend email package with in-app preview
- **Account & UI:** Refreshed email templates with a modern design
- **Account & UI:** Responsive layout across auth and settings pages
- **Database & Config:** Prisma ORM with PostgreSQL support and auto-generated client
- **Database & Config:** Prisma Studio as a standalone app in the monorepo
- **Database & Config:** Environment validation using @t3-oss/env for fail-fast startup errors
- **Database & Config:** Husky git hooks for pre-commit linting and formatting enforcement

### Fixed

- **Bug Fixes:** Fixed hydration error on authentication pages

### Security

- **Bug Fixes:** Prevented client-side access to server-only environment variables

## [1.0.1] - 2026-01-05 [Yanked] - Unpublished from npm

Unpublished from npm. No functional changes — version created to reclaim 1.0.0 slot after accidental deletion. Use v1.0.2 instead.

## [1.0.0] - 2026-01-05 [Yanked] - Unpublished from npm

Unpublished from npm. Original initial release — no longer installable. All changes are included in v1.0.2.
