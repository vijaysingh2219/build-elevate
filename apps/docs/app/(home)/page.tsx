import {
  ArrowRight,
  Box,
  Code2,
  FileCode,
  GitBranch,
  Layers,
  Lock,
  Package,
  StarIcon,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container max-w-screen-2xl px-4 py-20 md:py-24">
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
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Code Snippet Section */}
      <section className="container max-w-screen-2xl px-4 pb-24">
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
                  <span>pnpm dlx build-elevate init my-app</span>
                </div>
                <div className="ml-6 space-y-1 text-muted-foreground">
                  <div>✓ Initializing project structure...</div>
                  <div>✓ Setting up monorepo configuration...</div>
                  <div>✓ Installing dependencies...</div>
                  <div>✓ Configuring project settings...</div>
                  <div className="text-foreground">
                    🎉 Project ready! Run cd my-app && pnpm dev
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why Build-Elevate Section */}
      <section className="border-t border-border/40 bg-muted/20 py-24">
        <div className="container max-w-screen-2xl px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why build-elevate?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop wasting time on boilerplate. Get a production-ready
              foundation in minutes.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
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
        <div className="container max-w-screen-2xl px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What you get
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to build and ship production applications.
            </p>
            <div className="mt-12 space-y-6">
              <IncludedItem
                icon={<Package className="h-5 w-5" />}
                title="Turborepo monorepo"
                description="Optimized build system with caching, parallel execution, and task pipelining. Share code across apps and packages."
              />
              <IncludedItem
                icon={<Lock className="h-5 w-5" />}
                title="Authentication scaffold"
                description="Better Auth integration with user management, session handling, and protected routes."
              />
              <IncludedItem
                icon={<FileCode className="h-5 w-5" />}
                title="Environment management"
                description="Type-safe environment variables with validation. Local and production configs."
              />
              <IncludedItem
                icon={<Code2 className="h-5 w-5" />}
                title="Linting & formatting"
                description="ESLint, Prettier, and TypeScript strict mode. Catch errors before they ship."
              />
              <IncludedItem
                icon={<Terminal className="h-5 w-5" />}
                title="Package manager aware"
                description="Uses your preferred package manager: npm, pnpm or bun"
              />
              <IncludedItem
                icon={<GitBranch className="h-5 w-5" />}
                title="GitHub Actions workflows"
                description="Pre-configured CI/CD pipelines for automated testing, type checking, and format enforcement."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-border/40 bg-muted/20 py-24">
        <div className="container max-w-screen-2xl px-4">
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
                description="Run a single command to create your project. The CLI walks you through configuration options."
              />
              <StepItem
                number="02"
                title="Select your stack"
                description="Choose the apps and features. Everything is pre-configured."
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
        <div className="container max-w-screen-2xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to elevate your workflow?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop configuring and start shipping. Join developers who are
              building faster.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
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
