import { readFile, writeFile } from "node:fs/promises";
import { templateDescriptions, toTitleCase, toKebabCase } from "./utils.js";

export const createProjectReadme = async (
  projectName: string,
  template: string,
  includeDocker: boolean,
  packageManager: "pnpm" | "npm" | "bun" = "pnpm",
) => {
  const readmePath = "README.md";
  let content = "";
  try {
    content = await readFile(readmePath, "utf8");
  } catch {
    content = "";
  }

  const scriptPrefix =
    packageManager === "pnpm" ? packageManager : `${packageManager} run`;

  content = content.replace(/^# .*/m, `# ${toTitleCase(projectName)}\n`);
  content = content.replace(
    /^(> .*)?\n*(A modern full-stack monorepo starter[\s\S]*?)(?=\n##|\n#|$)/m,
    `\n${templateDescriptions[template]}\n\nBuilt with [build-elevate](https://github.com/vijaysingh2219/build-elevate) - A production-grade full-stack starter.`,
  );

  const installCmd = `${packageManager} install`;
  const gettingStarted = `## Getting Started\n\n### Prerequisites\n\n- Node.js 20+\n- ${packageManager}\n- PostgreSQL database\n\n### Setup\n\n1. Install dependencies:\n\n\u0060\u0060\u0060bash\n${installCmd}\n\u0060\u0060\u0060\n\n2. Configure environment variables:\n   - Copy \`.env.example\` files to \`.env.local\` or \`.env\` in respective packages\n   - Update database connection strings and API keys\n\n3. Generate Prisma client and run migrations:\n\n\u0060\u0060\u0060bash\ncd packages/db\n${scriptPrefix} db:generate\n${scriptPrefix} db:migrate\ncd ../..\n\u0060\u0060\u0060\n\n4. Start development server:\n\n\u0060\u0060\u0060bash\n${scriptPrefix} dev\n\u0060\u0060\u0060\n`;
  if (/## Getting Started/.test(content)) {
    content = content.replace(
      /## Getting Started[\s\S]*?(?=\n## |\n# |$)/,
      gettingStarted,
    );
  } else {
    content += `\n${gettingStarted}`;
  }

  const scriptsSection = `## Available Scripts\n\n- \`${scriptPrefix} dev\` - Start development servers\n- \`${scriptPrefix} build\` - Build all packages\n- \`${scriptPrefix} lint\` - Run ESLint\n- \`${scriptPrefix} format\` - Format code with Prettier\n- \`${scriptPrefix} test\` - Run tests\n\n### Database Commands (run from packages/db)\n\n- \`${scriptPrefix} db:generate\` - Generate Prisma client\n- \`${scriptPrefix} db:migrate\` - Run database migrations\n`;
  if (/## Available Scripts/.test(content)) {
    content = content.replace(
      /## Available Scripts[\s\S]*?(?=\n## |\n# |$)/,
      scriptsSection,
    );
  } else {
    content += `\n${scriptsSection}`;
  }

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
    ...(template !== "api" ? ["│   ├── ui/"] : []),
    "│   └── utils/",
    "└── turbo.json",
  ]
    .filter(Boolean)
    .join("\n");

  const structureSection = `## Structure\n\n\u0060\u0060\u0060plaintext\n${treeLines}\n\u0060\u0060\u0060\n`;
  if (/## Structure/.test(content)) {
    content = content.replace(
      /## Structure[\s\S]*?(?=\n## |\n# |$)/,
      structureSection,
    );
  }

  let builtWith = [
    "[Turborepo](https://turbo.build/)",
    "[TypeScript](https://www.typescriptlang.org/)",
    "[pnpm](https://pnpm.io/)",
    "[ESLint](https://eslint.org/)",
    "[Prettier](https://prettier.io/)",
    "[Jest](https://jestjs.io/)",
    "[GitHub Actions](https://github.com/features/actions)",
  ];
  if (template !== "api") {
    builtWith.unshift(
      "[Next.js 16](https://nextjs.org/)",
      "[shadcn/ui](https://ui.shadcn.com/)",
      "[Tailwind CSS](https://tailwindcss.com/)",
    );
  }
  if (template !== "web") {
    builtWith.unshift("[Express](https://expressjs.com/)");
  }
  if (template !== "web") {
    builtWith.push(
      "[Prisma](https://www.prisma.io/)",
      "[PostgreSQL](https://www.postgresql.org/)",
    );
  }
  builtWith.push("[Better Auth](https://www.better-auth.com/)");
  if (template === "fullstack") {
    builtWith.push(
      "[React Email](https://react.email/)",
      "[Resend](https://resend.com/)",
      "[Tanstack Query](https://tanstack.com/query/latest)",
    );
  }
  if (typeof includeDocker !== "undefined" ? includeDocker : true) {
    builtWith.push("[Docker](https://www.docker.com/)");
  }
  const builtWithSection = `### Built With\n\n${builtWith.join(" · ")}\n`;
  if (/### Built With/.test(content)) {
    content = content.replace(
      /### Built With[\s\S]*?(?=\n## |\n# |$)/,
      builtWithSection,
    );
  }

  let docsSection = "## Documentation\n\n";
  if (template === "fullstack") {
    docsSection +=
      "- [Web App Documentation](apps/web/README.md) - Next.js application\n";
    docsSection +=
      "- [API Documentation](apps/api/README.md) - Express server\n";
    docsSection +=
      "- [UI Components Guide](packages/ui/README.md) - shadcn/ui components\n";
  } else if (template === "web") {
    docsSection +=
      "- [Web App Documentation](apps/web/README.md) - Next.js application\n";
    docsSection +=
      "- [UI Components Guide](packages/ui/README.md) - shadcn/ui components\n";
  } else if (template === "api") {
    docsSection +=
      "- [API Documentation](apps/api/README.md) - Express server\n";
    docsSection +=
      "- [UI Components Guide](packages/ui/README.md) - shadcn/ui components\n";
  }

  if (/## Documentation/.test(content)) {
    content = content.replace(
      /## Documentation[\s\S]*?(?=\n## |\n# |$)/,
      docsSection,
    );
  } else {
    content += `\n${docsSection}`;
  }

  // Add or remove Docker Deployment section based on includeDocker
  if (includeDocker) {
    const dockerCmd = `${scriptPrefix} docker:prod`;
    let dockerSpins = "This spins up:\n\n";
    if (template !== "api") {
      dockerSpins += "- **Web app** → `localhost:3000`\n";
    }
    if (template !== "web") {
      dockerSpins += "- **API server** → `localhost:4000`\n";
    }
    dockerSpins += "- **PostgreSQL** → `localhost:5432`";

    const dockerSection = `## Docker Deployment

Production-ready Docker setup with docker-compose:

\`\`\`bash
${dockerCmd}
\`\`\`

${dockerSpins}

Features:

- Multi-stage builds for minimal image size
- Non-root user execution for security
- Turbo pruning for optimized workspace dependencies\n`;
    if (/##\s*Docker Deployment/.test(content)) {
      content = content.replace(
        /##\s*Docker Deployment[\s\S]*?(?=\n##\s|\n#\s|$)/,
        dockerSection,
      );
    } else {
      content += `\n\n${dockerSection}`;
    }
  } else {
    // Remove Docker Deployment section if present
    content = content.replace(
      /\n?##\s*Docker Deployment[\s\S]*?(?=\n##\s|\n#\s|$)/,
      "",
    );
  }

  await writeFile(readmePath, content);
};
