import { writeFile } from "node:fs/promises";
import { templateDescriptions, toTitleCase, toKebabCase } from "./utils.js";

type Template = "fullstack" | "web" | "api";

interface ReadmeContext {
  projectName: string;
  template: Template;
  includeDocker: boolean;
  packageManager: "pnpm" | "npm" | "bun";
  scriptPrefix: string;
}

const buildHeroSection = ({
  projectName,
  template,
}: ReadmeContext): string => `\
# ${toTitleCase(projectName)}

${templateDescriptions[template]}

Built with [build-elevate](https://github.com/vijaysingh2219/build-elevate) - A production-grade full-stack starter.
`;

const buildGettingStartedSection = ({
  packageManager,
  scriptPrefix,
}: ReadmeContext): string => `\
## Getting Started

### Prerequisites

- Node.js 20+
- ${packageManager}
- PostgreSQL database

### Setup

#### 1. Install dependencies

\`\`\`bash
${packageManager} install
\`\`\`

#### 2. Configure environment variables

- Copy \`.env.example\` files to \`.env.local\` or \`.env\` in respective packages
- Update database connection strings and API keys

#### 3. Generate Prisma client and run migrations

\`\`\`bash
cd packages/db
${scriptPrefix} db:generate
${scriptPrefix} db:migrate
cd ../..
\`\`\`

#### 4. Start development server

\`\`\`bash
${scriptPrefix} dev
\`\`\`
`;

const buildAvailableScriptsSection = ({
  scriptPrefix,
}: ReadmeContext): string => `\
## Available Scripts

- \`${scriptPrefix} dev\` - Start development servers
- \`${scriptPrefix} build\` - Build all packages
- \`${scriptPrefix} lint\` - Run ESLint
- \`${scriptPrefix} format\` - Format code with Prettier
- \`${scriptPrefix} format:path\` - Format specific files with Prettier (e.g. \`${scriptPrefix} format:path src/index.ts\`)
- \`${scriptPrefix} format:check\` - Check code formatting with Prettier
- \`${scriptPrefix} test\` - Run tests
- \`${scriptPrefix} prepare\` - Prepare Husky git hooks

### Database Commands (run from packages/db)

- \`${scriptPrefix} db:generate\` - Generate Prisma client
- \`${scriptPrefix} db:migrate\` - Run database migrations
`;

const buildStructureSection = ({
  projectName,
  template,
}: ReadmeContext): string => {
  const treeLines = [
    `${toKebabCase(projectName)}/`,
    "├── apps/",
    template !== "api" ? "│   ├── web/" : "",
    template !== "web" ? "│   ├── api/" : "",
    "│   ├── email/",
    "│   └── studio/",
    "├── packages/",
    "│   ├── auth/",
    "│   ├── db/",
    "│   ├── email/",
    "│   ├── rate-limit/",
    template !== "api" ? "│   ├── ui/" : "",
    "│   └── utils/",
    "└── turbo.json",
  ]
    .filter(Boolean)
    .join("\n");

  return `\
## Structure

\`\`\`plaintext
${treeLines}
\`\`\`
`;
};

const buildBuiltWithSection = ({
  template,
  includeDocker,
}: ReadmeContext): string => {
  const links: string[] = [];

  if (template !== "api") {
    links.push(
      "[Next.js 16](https://nextjs.org/)",
      "[shadcn/ui](https://ui.shadcn.com/)",
      "[Tailwind CSS](https://tailwindcss.com/)",
    );
  }
  if (template !== "web") {
    links.unshift("[Express](https://expressjs.com/)");
  }

  links.push(
    "[Turborepo](https://turbo.build/)",
    "[TypeScript](https://www.typescriptlang.org/)",
    "[pnpm](https://pnpm.io/)",
    "[ESLint](https://eslint.org/)",
    "[Prettier](https://prettier.io/)",
    "[Jest](https://jestjs.io/)",
    "[GitHub Actions](https://github.com/features/actions)",
  );

  if (template !== "web") {
    links.push(
      "[Prisma](https://www.prisma.io/)",
      "[PostgreSQL](https://www.postgresql.org/)",
    );
  }

  links.push("[Better Auth](https://www.better-auth.com/)");

  if (template === "fullstack") {
    links.push(
      "[React Email](https://react.email/)",
      "[Resend](https://resend.com/)",
      "[Tanstack Query](https://tanstack.com/query/latest)",
    );
  }

  if (includeDocker) {
    links.push("[Docker](https://www.docker.com/)");
  }

  return `## Built With\n\n${links.join(" · ")}\n`;
};

const buildDocumentationSection = ({ template }: ReadmeContext): string => {
  const docs: string[] = [];

  if (template !== "api") {
    docs.push(
      "- [Web App Documentation](apps/web/README.md) - Next.js application",
    );
    docs.push(
      "- [UI Components Guide](packages/ui/README.md) - shadcn/ui components",
    );
  }
  if (template !== "web") {
    docs.push("- [API Documentation](apps/api/README.md) - Express server");
  }
  if (template === "api") {
    docs.push(
      "- [UI Components Guide](packages/ui/README.md) - shadcn/ui components",
    );
  }

  return `## Documentation\n\n${docs.join("\n")}\n`;
};

const buildDockerSection = ({
  template,
  scriptPrefix,
}: ReadmeContext): string => {
  const spins: string[] = [];

  if (template !== "api") spins.push("- **Web app** → `localhost:3000`");
  if (template !== "web") spins.push("- **API server** → `localhost:4000`");
  spins.push("- **PostgreSQL** → `localhost:5432`");

  return `\
## Docker Deployment

Production-ready Docker setup with docker-compose:

\`\`\`bash
${scriptPrefix} docker:prod
\`\`\`

${spins.join("\n")}

Features:

- Multi-stage builds for minimal image size
- Non-root user execution for security
- Turbo pruning for optimized workspace dependencies
`;
};

/**
 * Scaffold a fresh README for the project from context.
 * No file reading or regex patching — pure construction.
 */
export const createProjectReadme = async (
  projectName: string,
  template: string,
  includeDocker: boolean,
  packageManager: "pnpm" | "npm" | "bun" = "pnpm",
) => {
  const ctx: ReadmeContext = {
    projectName,
    template: template as Template,
    includeDocker,
    packageManager,
    scriptPrefix:
      packageManager === "pnpm" ? packageManager : `${packageManager} run`,
  };

  const sections: string[] = [
    buildHeroSection(ctx),
    buildBuiltWithSection(ctx),
    buildGettingStartedSection(ctx),
    buildAvailableScriptsSection(ctx),
    buildStructureSection(ctx),
    ...(includeDocker ? [buildDockerSection(ctx)] : []),
    buildDocumentationSection(ctx),
  ];

  const content = sections.join("\n");
  await writeFile("README.md", content, "utf8");
};
