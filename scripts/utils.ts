import { type ExecSyncOptions, exec as execRaw } from "node:child_process";
import { randomBytes } from "node:crypto";
import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

export const url = "vijaysingh2219/build-elevate";

export const execSyncOpts: ExecSyncOptions = { stdio: "ignore" };

export const internalContentDirs = ["scripts", "dist", "assets"];

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

export const supportedPackageManagers = ["npm", "yarn", "bun", "pnpm"];

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
