import {
  ArrowRight,
  BookOpen,
  Box,
  Code2,
  Component,
  Database,
  FileCode,
  FlaskConical,
  Gauge,
  GitBranch,
  Layers,
  Mail,
  Package,
  ShieldCheck,
  Ship,
  StarIcon,
  Terminal,
  Zap,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { CopyButton } from "./_components/copy-button";

const GITHUB_URL = "https://github.com/vijaysingh2219/build-elevate";
const INSTALL_COMMAND = "pnpm dlx build-elevate@latest init my-project";

export default function HomePage() {
  return (
    <div className="min-h-screen mx-auto ">
      {/* Hero Section */}
      <section className="mx-auto max-w-screen-2xl px-4 py-20 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">
            <StarIcon className="mr-1 inline-block size-3" />
            Modern CLI Scaffolding Tool
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Ship production apps in minutes
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            A CLI tool that scaffolds scalable monorepos with authentication,
            infrastructure, and best practices built in. Stop configuring. Start
            building.
          </p>
          <div className="mx-auto mt-8 w-full max-w-md rounded-lg border border-border/60 bg-muted/40 p-1.5 pl-4">
            <div className="flex items-center justify-between gap-3 font-mono text-sm">
              <span className="truncate">
                <span className="select-none text-muted-foreground">$ </span>
                {INSTALL_COMMAND}
              </span>
              <CopyButton value={INSTALL_COMMAND} />
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/docs">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
                <SiGithub className="mr-2 size-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Code Snippet Section */}
      <section className="mx-auto max-w-screen-2xl px-4 pb-24">
        <div className="mx-auto max-w-3xl">
          <Card className="border-border/40 bg-muted/30 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Terminal className="h-4 w-4" />
                <span className="font-mono">Terminal</span>
              </div>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-muted-foreground">$</span>
                  <span>{INSTALL_COMMAND}</span>
                </div>
                <div className="ml-6 space-y-1 text-muted-foreground">
                  <div>✓ Initializing project structure...</div>
                  <div>✓ Setting up monorepo configuration...</div>
                  <div>✓ Installing dependencies...</div>
                  <div>✓ Configuring project settings...</div>
                  <div className="text-foreground">
                    🎉 Project ready! Run cd my-project && pnpm dev
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why Build-Elevate Section */}
      <section className="border-t border-border/40 bg-muted/20 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why build-elevate?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop wasting time on boilerplate. Get a production-ready
              foundation in minutes.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Terminal className="h-5 w-5" />}
                title="CLI-first approach"
                description="Interactive prompts guide you through setup. No configuration files to write."
              />
              <FeatureCard
                icon={<Layers className="h-5 w-5" />}
                title="Opinionated structure"
                description="Best practices built in. Monorepo setup with clear separation of concerns."
              />
              <FeatureCard
                icon={<Zap className="h-5 w-5" />}
                title="Essentials built-in"
                description="Authentication, environment handling, and tooling configured out of the box."
              />
              <FeatureCard
                icon={<Box className="h-5 w-5" />}
                title="Extensible templates"
                description="Start with a solid foundation. Customize to your needs without fighting the setup."
              />
              <FeatureCard
                icon={<Code2 className="h-5 w-5" />}
                title="Modern stack"
                description="Built with the latest tools. TypeScript, React, Next.js, Tailwind, and more."
              />
              <FeatureCard
                icon={<GitBranch className="h-5 w-5" />}
                title="CI-ready"
                description="Pre-configured workflows for testing, linting, and deployment from day one."
              />
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What you get
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to build and ship production applications.
            </p>
            <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              <IncludedItem
                icon={<Package className="h-5 w-5" />}
                title="Turborepo monorepo"
                description="Optimized build system with caching, parallel execution, and task pipelining. Share code across apps and packages."
              />
              <IncludedItem
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Authentication & security"
                description="Better Auth with Google OAuth, email verification, TOTP two-factor, and database-backed sessions with protected routes."
              />
              <IncludedItem
                icon={<Database className="h-5 w-5" />}
                title="Prisma + PostgreSQL"
                description="A type-safe database layer with an auto-generated client, migrations, and Prisma Studio for browsing your data."
              />
              <IncludedItem
                icon={<Mail className="h-5 w-5" />}
                title="Transactional email"
                description="React Email templates delivered through Resend, with a local preview server for designing emails."
              />
              <IncludedItem
                icon={<Gauge className="h-5 w-5" />}
                title="Rate limiting"
                description="Per-IP sliding-window rate limiting backed by Upstash Redis, wired into the API middleware."
              />
              <IncludedItem
                icon={<Component className="h-5 w-5" />}
                title="UI component library"
                description="A shared shadcn/ui and Tailwind CSS component package used consistently across every app."
              />
              <IncludedItem
                icon={<FileCode className="h-5 w-5" />}
                title="Type-safe environments"
                description="Validated environment variables with fail-fast startup, and separate local and production configs."
              />
              <IncludedItem
                icon={<FlaskConical className="h-5 w-5" />}
                title="Testing, linting & formatting"
                description="Vitest, ESLint, Prettier, and TypeScript strict mode. Catch errors before they ship."
              />
              <IncludedItem
                icon={<Ship className="h-5 w-5" />}
                title="Docker & Kubernetes"
                description="Compose files for local and production, plus Kubernetes manifests with autoscaling (HPA) and one-command deploy and verify."
              />
              <IncludedItem
                icon={<GitBranch className="h-5 w-5" />}
                title="GitHub Actions CI"
                description="Pre-configured pipelines for linting, type checking, testing, and build on every push and pull request."
              />
              <IncludedItem
                icon={<BookOpen className="h-5 w-5" />}
                title="Documentation site"
                description="A Fumadocs-powered docs app, ready for your own content out of the box."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-border/40 bg-muted/20 py-24">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps from zero to deployed.
            </p>
            <div className="mt-12 space-y-8">
              <StepItem
                number="01"
                title="Install and initialize"
                description="Run a single command to create your project. The CLI walks you through your package manager and optional Docker, Kubernetes, and Prisma Studio."
              />
              <StepItem
                number="02"
                title="Pick a template"
                description="Choose fullstack, web-only, or api-only. Everything is pre-configured and only the files your template needs are scaffolded."
              />
              <StepItem
                number="03"
                title="Start building"
                description="Your project is ready with authentication, API routes, database schema, and CI/CD. Focus on features, not infrastructure."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to elevate your workflow?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop configuring and start shipping. Join developers who are
              building faster.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-md rounded-xl border border-border/40 bg-muted/30 p-2 pl-4">
                <div className="flex items-center justify-between gap-3 font-mono text-sm">
                  <span className="truncate">
                    <span className="text-muted-foreground">$ </span>
                    {INSTALL_COMMAND}
                  </span>
                  <CopyButton value={INSTALL_COMMAND} />
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/docs">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <SiGithub className="mr-2 size-4" />
                  Star on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Component: Feature Card
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border/40 bg-card p-6 transition-colors hover:bg-muted/50">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

// Component: Included Item
function IncludedItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Component: Step Item
function StepItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-muted/30 font-mono text-sm font-semibold">
        {number}
      </div>
      <div className="flex-1 pt-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
