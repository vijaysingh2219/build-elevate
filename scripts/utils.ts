import { type ExecSyncOptions, exec as execRaw } from "node:child_process";
import { randomBytes } from "node:crypto";
import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

export const url = "vijaysingh2219/build-elevate";

export const execSyncOpts: ExecSyncOptions = { stdio: "ignore" };
export const execOpts = { stdio: "ignore" as const };

export const internalContentDirs = ["scripts", "apps/docs", "assets"];

export const internalContentFiles = [
  join(".github", "CONTRIBUTING.md"),
  "SCREENSHOTS.md",
  "tsup.config.ts",
  ".npmignore",
];

export const allInternalContent = [
  ...internalContentDirs,
  ...internalContentFiles,
];

export const exec = promisify(execRaw);

export const supportedPackageManagers = ["npm", "bun", "pnpm"];

export const validateProjectName = (name: string): string | undefined => {
  if (!name || name.trim().length === 0) {
    return "Project name cannot be empty";
  }

  if (name.length > 214) {
    return "Project name must be less than 214 characters";
  }

  if (name.startsWith(".") || name.startsWith("_")) {
    return "Project name cannot start with . or _";
  }

  if (!/^[a-z0-9-_@/]+$/.test(name)) {
    return "Project name can only contain lowercase letters, numbers, hyphens, underscores, @, and /";
  }

  if (name.includes("..") || name.includes(" ")) {
    return "Project name cannot contain spaces or ..";
  }

  const reserved = [
    "node_modules",
    "favicon.ico",
    "con",
    "prn",
    "aux",
    "nul",
    "com1",
    "lpt1",
  ];
  if (reserved.includes(name.toLowerCase())) {
    return `Project name "${name}" is reserved and cannot be used`;
  }

  return undefined;
};

export const directoryExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export const isCommandAvailable = async (command: string): Promise<boolean> => {
  try {
    await exec(`${command} --version`, { ...execSyncOpts, encoding: "utf8" });
    return true;
  } catch {
    return false;
  }
};

// Case conversion utilities
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

export const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""));
};

export const toPascalCase = (str: string): string => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
};

export const toConstantCase = (str: string): string => {
  return toSnakeCase(str).toUpperCase();
};

export const toTitleCase = (str: string): string => {
  return str
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Replace utility functions
export const replaceInFile = async (
  filePath: string,
  search: string | RegExp,
  replace: string,
) => {
  const content = await readFile(filePath, "utf8");
  const updated = content.replace(search, replace);
  await writeFile(filePath, updated);
};

export const replaceAllInFile = async (
  filePath: string,
  search: string | RegExp,
  replace: string,
) => {
  const content = await readFile(filePath, "utf8");
  const updated = content.replaceAll(search, replace);
  await writeFile(filePath, updated);
};

// Replace project name in all common formats
export const replaceProjectName = async (
  filePath: string,
  newProjectName: string,
) => {
  let content = await readFile(filePath, "utf8");

  // Replace all variations
  content = content.replaceAll("build-elevate", toKebabCase(newProjectName));
  content = content.replaceAll("buildElevate", toCamelCase(newProjectName));
  content = content.replaceAll("BuildElevate", toPascalCase(newProjectName));
  content = content.replaceAll("build_elevate", toSnakeCase(newProjectName));
  content = content.replaceAll("BUILD_ELEVATE", toConstantCase(newProjectName));
  content = content.replaceAll("Build Elevate", toTitleCase(newProjectName));

  await writeFile(filePath, content);
};

// Files to replace project name in
export const getFilesToReplaceProjectName = (): string[] => {
  return [
    "package.json",
    "apps/web/.env.example",
    "apps/web/app/(home)/page.tsx",
    "apps/web/config/metadata.ts",
    "apps/web/config/site.ts",
    "docker-compose.prod.yml",
    "packages/db/.env.example",
    "packages/auth/src/server.ts",
    "packages/email/src/branding.ts",
    "packages/rate-limit/src/limiter.ts",
  ];
};

// Replace project name across all relevant files
export const replaceProjectNameInAll = async (newProjectName: string) => {
  const files = getFilesToReplaceProjectName();

  for (const file of files) {
    try {
      await replaceProjectName(file, newProjectName);
    } catch (error) {
      // Skip files that don't exist (based on template)
    }
  }
};

// Generate a secure random secret
export const generateSecret = (length: number = 32): string => {
  return randomBytes(length).toString("base64");
};

// Update BETTER_AUTH_SECRET in env files
export const updateAuthSecretInEnvFile = async (filePath: string) => {
  try {
    const content = await readFile(filePath, "utf8");
    const secret = generateSecret(32);
    const updated = content.replace(
      /BETTER_AUTH_SECRET=.*/,
      `BETTER_AUTH_SECRET="${secret}"`,
    );
    await writeFile(filePath, updated);
  } catch (error) {
    // Skip if file doesn't exist
  }
};

// Descriptions for each template
export const templateDescriptions: Record<string, string> = {
  fullstack:
    "Full-stack application with Next.js frontend, Express backend, authentication and PostgreSQL database",
  web: "Frontend application with Next.js, authentication, and modern UI",
  api: "Backend API with Express, PostgreSQL, and authentication",
};

// Get description for a given template
export const getDescription = (template: string): string => {
  return templateDescriptions[template] || "";
};

// Environment variables required by each template
export const envsByTemplate: Record<string, string[]> = {
  fullstack: [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NEXT_PUBLIC_BASE_URL",
    "NODE_ENV",
    "PORT",
    "ALLOWED_ORIGINS",
    "BETTER_AUTH_URL",
    "RESEND_TOKEN",
    "RESEND_EMAIL_FROM",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ],
  web: [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NEXT_PUBLIC_BASE_URL",
    "NODE_ENV",
    "BETTER_AUTH_URL",
    "RESEND_TOKEN",
    "RESEND_EMAIL_FROM",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ],
  api: [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NODE_ENV",
    "PORT",
    "ALLOWED_ORIGINS",
    "BETTER_AUTH_URL",
    "RESEND_TOKEN",
    "RESEND_EMAIL_FROM",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ],
};
