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
  group?: string; // Optional group for categorizing releases (e.g., "Auth", "API", "UI")
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
  { label: string; color: string; icon: string }
> = {
  added: {
    label: "Added",
    color:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: "plus",
  },
  changed: {
    label: "Changed",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: "pencil",
  },
  fixed: {
    label: "Fixed",
    color:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: "bug",
  },
  deprecated: {
    label: "Deprecated",
    color:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    icon: "alert-triangle",
  },
  removed: {
    label: "Removed",
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    icon: "trash",
  },
  security: {
    label: "Security",
    color:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: "shield",
  },
  performance: {
    label: "Performance",
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    icon: "trending-up",
  },
};

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
    version: "1.1.0",
    date: "2026-03-12",
    tag: "latest",
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
        group: "Monorepo & Infrastructure",
        text: "Turborepo monorepo with apps/ and packages/ structure",
      },
      {
        category: "added",
        group: "Monorepo & Infrastructure",
        text: "Next.js web app with App Router, Tailwind CSS, and shadcn/ui",
      },
      {
        category: "added",
        group: "Monorepo & Infrastructure",
        text: "Express API server with TypeScript, structured routing, and a 404 catch-all",
      },
      {
        category: "added",
        group: "Monorepo & Infrastructure",
        text: "Shared packages: ui, utils, auth, db, email, eslint-config, typescript-config",
      },
      {
        category: "added",
        group: "Monorepo & Infrastructure",
        text: "Docker Compose setup for local development and production deployments",
      },
      {
        category: "added",
        group: "Monorepo & Infrastructure",
        text: "GitHub Actions CI with lint, type-check, and test jobs",
      },
      {
        category: "added",
        group: "Monorepo & Infrastructure",
        text: "Jest testing setup with shared workspace presets",
      },

      // Authentication
      {
        category: "added",
        group: "Authentication",
        text: "Better-Auth with email/password sign-in and sign-up flows",
      },
      {
        category: "added",
        group: "Authentication",
        text: "Dedicated @workspace/auth package with centralized auth logic and TypeScript support",
      },
      {
        category: "added",
        group: "Authentication",
        text: "Authentication middleware for the Express API with protected route support",
      },
      {
        category: "added",
        group: "Authentication",
        text: "Rate limiting for API calls and verification email requests with configurable strategies",
      },
      {
        category: "added",
        group: "Authentication",
        text: "Email verification on sign-up",
      },
      {
        category: "added",
        group: "Authentication",
        text: "Two-factor authentication (2FA) with TOTP support, including setup flow for OAuth users",
      },
      {
        category: "added",
        group: "Authentication",
        text: "Forgot/reset password flow with secure token-based email links",
      },
      {
        category: "added",
        group: "Authentication",
        text: "Email change flow with a verification step",
      },
      {
        category: "added",
        group: "Authentication",
        text: "Social login connect/disconnect cards in account settings",
      },

      // Account & UI
      {
        category: "added",
        group: "Account & UI",
        text: "Session activity UI and API — view and manage active sessions across devices",
      },
      {
        category: "added",
        group: "Account & UI",
        text: "Revoke all sessions from the security settings page",
      },
      {
        category: "added",
        group: "Account & UI",
        text: "User profile, account settings, and security settings pages",
      },
      {
        category: "added",
        group: "Account & UI",
        text: "Account deletion with a post-deletion goodbye page",
      },
      {
        category: "added",
        group: "Account & UI",
        text: "Light/dark/system theme switcher",
      },
      {
        category: "added",
        group: "Account & UI",
        text: "React Email + Resend email package with in-app preview",
      },
      {
        category: "added",
        group: "Account & UI",
        text: "Refreshed email templates with a modern design",
      },
      {
        category: "added",
        group: "Account & UI",
        text: "Responsive layout across auth and settings pages",
      },

      // Database & Config
      {
        category: "added",
        group: "Database & Config",
        text: "Prisma ORM with PostgreSQL support and auto-generated client",
      },
      {
        category: "added",
        group: "Database & Config",
        text: "Prisma Studio as a standalone app in the monorepo",
      },
      {
        category: "added",
        group: "Database & Config",
        text: "Environment validation using @t3-oss/env for fail-fast startup errors",
      },
      {
        category: "added",
        group: "Database & Config",
        text: "Husky git hooks for pre-commit linting and formatting enforcement",
      },

      // Bug Fixes
      {
        category: "fixed",
        group: "Bug Fixes",
        text: "Fixed hydration error on authentication pages",
      },
      {
        category: "security",
        group: "Bug Fixes",
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
