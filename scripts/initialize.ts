import { copyFile, readFile, readdir, rm, writeFile } from "node:fs/promises";
import yaml from "yaml";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import degit from "degit";
import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import {
  directoryExists,
  exec,
  execSyncOpts,
  internalContentDirs,
  internalContentFiles,
  isCommandAvailable,
  replaceProjectNameInAll,
  updateAuthSecretInEnvFile,
  url,
  validateProjectName,
  getDescription,
} from "./utils.js";
import { createProjectReadme } from "./readme.js";
import {
  removeAuthClientArtifactsForApi,
  updateTurboLintEnv,
} from "./update.js";

const cloneBuildElevate = async (name: string) => {
  const emitter = degit(url, {
    cache: false,
    force: true,
    verbose: false,
  });

  await emitter.clone(name);
};

const deleteInternalContent = async () => {
  const errors: string[] = [];

  // Parallelize folder deletion
  const folderPromises = internalContentDirs.map(async (folder) => {
    try {
      await rm(folder, { recursive: true, force: true });
    } catch (error) {
      errors.push(
        `Failed to delete ${folder}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

  // Parallelize file deletion
  const filePromises = internalContentFiles.map(async (file) => {
    try {
      await rm(file, { force: true });
    } catch (error) {
      errors.push(
        `Failed to delete ${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

  await Promise.all([...folderPromises, ...filePromises]);

  if (errors.length > 0) {
    log.warn(`Some internal files could not be deleted:\n${errors.join("\n")}`);
  }
};

const removeDockerFiles = async () => {
  const dockerFiles = [
    "docker-compose.prod.yml",
    "apps/api/Dockerfile.prod",
    "apps/web/Dockerfile.prod",
    ".dockerignore",
  ];

  const errors: string[] = [];

  // Parallelize file deletion
  const deletePromises = dockerFiles.map(async (file) => {
    try {
      await rm(file, { force: true });
    } catch (error) {
      errors.push(
        `Failed to delete ${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

  await Promise.all(deletePromises);

  if (errors.length > 0) {
    log.warn(`Some Docker files could not be deleted:\n${errors.join("\n")}`);
  }
};

const updateDockerComposeForTemplate = async (template: string) => {
  const dockerComposePath = "docker-compose.prod.yml";

  try {
    const content = await readFile(dockerComposePath, "utf8");

    if (template === "web") {
      // Remove API service and its Dockerfile
      let updated = content.replace(/\n  api:[\s\S]*?(?=\n  \w+:|$)/, "");
      // Remove API dependency from web service
      updated = updated.replace(
        /\n      api:\n        condition: service_started/,
        "",
      );
      await writeFile(dockerComposePath, updated);
      await rm("apps/api/Dockerfile.prod", { force: true });
    } else if (template === "api") {
      // Remove web service and its Dockerfile
      let updated = content.replace(/\n  web:[\s\S]*?(?=\n  \w+:|$)/, "");
      await writeFile(dockerComposePath, updated);
      await rm("apps/web/Dockerfile.prod", { force: true });
    }
  } catch (error) {
    log.warn(
      `Failed to update docker-compose.prod.yml: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

const removeAppsByTemplate = async (template: string) => {
  const errors: string[] = [];

  try {
    if (template === "web") {
      // Remove API and email apps
      await rm("apps/api", { recursive: true, force: true });
      await rm("apps/email", { recursive: true, force: true });
    } else if (template === "api") {
      // Remove web and email apps
      await rm("apps/web", { recursive: true, force: true });
      await rm("apps/email", { recursive: true, force: true });
      await rm("packages/ui", { recursive: true, force: true });
    }
    // For 'fullstack', keep everything
  } catch (error) {
    throw new Error(
      `Failed to remove apps for ${template} template: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

const getPackageManager = async (provided?: string, yes?: boolean) => {
  if (provided) return provided;

  const availablePMs = await Promise.all([
    isCommandAvailable("npm").then((available) => ({
      value: "npm" as const,
      available,
    })),
    isCommandAvailable("pnpm").then((available) => ({
      value: "pnpm" as const,
      available,
    })),
    isCommandAvailable("bun").then((available) => ({
      value: "bun" as const,
      available,
    })),
  ]);

  const installedPMs = availablePMs.filter((pm) => pm.available);

  if (installedPMs.length === 0) {
    throw new Error(
      "No package manager found. Please install npm, pnpm, or bun.",
    );
  }

  // Show detection results
  const statusLines = availablePMs.map(
    (pm) =>
      `  ${pm.available ? "✓" : "✗"} ${pm.value}: ${pm.available ? "Installed" : "Not found"}`,
  );
  log.info(`Detected package managers:\n${statusLines.join("\n")}`);

  if (yes) {
    const preference = ["pnpm", "bun", "npm"] as const;
    for (const preferred of preference) {
      const found = installedPMs.find((pm) => pm.value === preferred);
      if (found) {
        return found.value;
      }
    }
    return installedPMs[0]!.value;
  }

  // Show only installed in the selection prompt
  const options = installedPMs.map((pm) => ({
    value: pm.value,
    label: pm.value,
    hint: "Ready to use",
  }));

  const pm = await select({
    message: "Which package manager would you like to use?",
    options,
    initialValue: installedPMs[0]!.value,
  });

  if (isCancel(pm)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
  return pm as string;
};

const findAllPackageJsons = async (dir: string): Promise<string[]> => {
  let results: string[] = [];
  const list = await readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const filePath = join(dir, file.name);
    if (file.isDirectory()) {
      if (
        file.name === "node_modules" ||
        file.name === ".turbo" ||
        file.name === ".next" ||
        file.name === "dist" ||
        file.name === "build"
      ) {
        continue;
      }
      results = results.concat(await findAllPackageJsons(filePath));
    } else if (file.name === "package.json") {
      results.push(filePath);
    }
  }
  return results;
};

const replaceCatalogVersions = async () => {
  const workspacePath = "pnpm-workspace.yaml";
  const workspaceContent = await readFile(workspacePath, "utf8");
  const workspace = yaml.parse(workspaceContent) as {
    catalogs?: Record<string, Record<string, string>>;
  };

  if (!workspace.catalogs) {
    log.warn("No catalogs found in pnpm-workspace.yaml");
    return;
  }

  const catalogLookups: Record<string, Record<string, string>> = {};
  for (const [catalogName, packages] of Object.entries(workspace.catalogs)) {
    catalogLookups[catalogName] = packages;
  }

  const packageJsonFiles = await findAllPackageJsons(".");

  const rootPackageJson = resolve(cwd(), "package.json");
  const allFiles = new Set<string>();

  for (const file of packageJsonFiles) {
    allFiles.add(resolve(file));
  }

  allFiles.add(rootPackageJson);

  const normalizedFiles = Array.from(allFiles);

  for (const filePath of normalizedFiles) {
    const content = await readFile(filePath, "utf8");
    let packageJson: any;
    try {
      packageJson = JSON.parse(content);
    } catch (error) {
      log.warn(
        `Failed to parse ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }

    let fileChanged = false;
    const dependencyFields = [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ] as const;

    for (const field of dependencyFields) {
      if (!packageJson[field] || typeof packageJson[field] !== "object") {
        continue;
      }

      for (const [packageName, version] of Object.entries(packageJson[field])) {
        if (typeof version === "string" && version.startsWith("workspace:")) {
          continue;
        }

        if (typeof version === "string" && version.startsWith("catalog:")) {
          const catalogName = version.replace("catalog:", "");
          const catalog = catalogLookups[catalogName];

          if (!catalog) {
            log.warn(
              `Catalog "${catalogName}" not found for package "${packageName}" in ${filePath}`,
            );
            continue;
          }

          const catalogVersion = catalog[packageName];
          if (!catalogVersion) {
            log.warn(
              `Package "${packageName}" not found in catalog "${catalogName}" (${filePath})`,
            );
            continue;
          }

          packageJson[field][packageName] = catalogVersion;
          fileChanged = true;
        }
      }
    }

    if (fileChanged) {
      try {
        const updatedContent = JSON.stringify(packageJson, null, 2) + "\n";
        await writeFile(filePath, updatedContent);
      } catch (error) {
        log.warn(
          `Failed to write ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
};

const replaceWorkspaceProtocols = async (packageManager: string) => {
  if (packageManager === "pnpm" || packageManager === "bun") {
    return;
  }

  const packageJsonFiles = await findAllPackageJsons(".");

  const rootPackageJson = resolve(cwd(), "package.json");
  const allFiles = new Set<string>();

  for (const file of packageJsonFiles) {
    allFiles.add(resolve(file));
  }

  allFiles.add(rootPackageJson);

  const normalizedFiles = Array.from(allFiles);

  for (const filePath of normalizedFiles) {
    const content = await readFile(filePath, "utf8");
    let packageJson: any;
    try {
      packageJson = JSON.parse(content);
    } catch (error) {
      log.warn(
        `Failed to parse ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }

    let fileChanged = false;
    const dependencyFields = [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ] as const;

    for (const field of dependencyFields) {
      if (!packageJson[field] || typeof packageJson[field] !== "object") {
        continue;
      }

      for (const [packageName, version] of Object.entries(packageJson[field])) {
        if (typeof version === "string" && version.startsWith("workspace:")) {
          packageJson[field][packageName] = "*";
          fileChanged = true;
        }
      }
    }

    if (fileChanged) {
      try {
        const updatedContent = JSON.stringify(packageJson, null, 2) + "\n";
        await writeFile(filePath, updatedContent);
      } catch (error) {
        log.warn(
          `Failed to write ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
};

const addWorkspacesField = async () => {
  const workspacePath = "pnpm-workspace.yaml";
  let workspacePackages: string[] = [];

  try {
    const workspaceContent = await readFile(workspacePath, "utf8");
    const workspace = yaml.parse(workspaceContent) as {
      packages?: string[];
    };
    if (workspace.packages) {
      workspacePackages = workspace.packages;
    }
  } catch (error) {
    log.warn(
      `Failed to read ${workspacePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
    workspacePackages = ["apps/*", "packages/*"];
  }

  const packageJsonPath = "package.json";
  const content = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(content);

  packageJson.workspaces = workspacePackages;

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
};

const updateDockerfilesForPackageManager = async (packageManager: string) => {
  const dockerfiles = ["apps/api/Dockerfile.prod", "apps/web/Dockerfile.prod"];

  // Helper to replace pnpm commands with npm or bun
  const replaceCommands = (content: string, pm: string) => {
    if (pm === "pnpm") return content;
    let updated = content;
    // Regex to match the pnpm install block with flexible whitespace
    const pnpmBlock =
      /# ✅ Install pnpm and manually configure PNPM_HOME\s*\nENV PNPM_HOME="[^"]*"\s*\nENV PATH="[^"]*"\s*\nRUN npm install -g pnpm\s*\\\s*\n\s*&&\s*pnpm config set global-bin-dir "\$PNPM_HOME"\s*\\\s*\n\s*&&\s*pnpm add -g turbo\s*\n?/g;
    // Regex to match the pnpm cache mount with flexible whitespace
    const cacheMount =
      /--mount=type=cache,id=pnpm,target=\/root\/\.local\/share\/pnpm\/store\s*\\\s*\n\s*/g;
    // Regex for the install command
    const installRegex = /pnpm install --frozen-lockfile --ignore-scripts/g;
    // Regex for the db:generate command
    const generateRegex = /pnpm --filter @workspace\/db db:generate/g;
    // Regex for the turbo build command
    const buildRegex = /pnpm turbo build/g;

    if (pm === "npm") {
      // Replace pnpm install block with npm version
      updated = updated.replace(
        pnpmBlock,
        "# ✅ Install turbo globally\nRUN npm install -g turbo\n",
      );
      // Remove pnpm cache mount
      updated = updated.replace(cacheMount, "");
      // Replace install command
      updated = updated.replace(installRegex, "npm install --ignore-scripts");
      // Replace db:generate command
      updated = updated.replace(
        generateRegex,
        "cd packages/db && npm run db:generate",
      );
      // Replace turbo build command
      updated = updated.replace(buildRegex, "turbo build");
    } else if (pm === "bun") {
      // Replace pnpm install block with bun version
      updated = updated.replace(
        pnpmBlock,
        '# ✅ Install bun and add to PATH\nENV PATH="/root/.bun/bin:$PATH"\nRUN apk add --no-cache curl bash \\\n  && curl -fsSL https://bun.sh/install | bash \\\n  && /root/.bun/bin/bun install -g turbo\n\n',
      );
      // Remove pnpm cache mount
      updated = updated.replace(cacheMount, "");
      // Replace install command
      updated = updated.replace(installRegex, "bun install");
      // Replace db:generate command
      updated = updated.replace(
        generateRegex,
        "cd packages/db && bun run db:generate",
      );
      // Replace turbo build command
      updated = updated.replace(buildRegex, "turbo build");
    }
    return updated;
  };
  for (const dockerfile of dockerfiles) {
    try {
      const content = await readFile(dockerfile, "utf8");
      const updated = replaceCommands(content, packageManager);
      if (updated !== content) {
        await writeFile(dockerfile, updated);
      }
    } catch (error) {
      // Ignore if file doesn't exist (template may have removed it)
    }
  }
};

const configurePackageManager = async (packageManager: string) => {
  const packageJsonPath = "package.json";

  if (packageManager !== "pnpm") {
    await replaceCatalogVersions();
    await replaceWorkspaceProtocols(packageManager);
    if (packageManager === "npm" || packageManager === "bun") {
      await addWorkspacesField();
    }
  }

  let packageJson;
  try {
    const content = await readFile(packageJsonPath, "utf8");
    packageJson = JSON.parse(content);
  } catch {
    packageJson = undefined;
  }

  // Update Dockerfiles for selected package manager
  await updateDockerfilesForPackageManager(packageManager);

  if (packageManager === "bun") {
    if (packageJson) {
      packageJson.packageManager = "bun@1.3.5";
      // Add @tailwindcss/postcss to dependencies if not present
      if (!packageJson.dependencies) packageJson.dependencies = {};
      if (!packageJson.dependencies["@tailwindcss/postcss"]) {
        packageJson.dependencies["@tailwindcss/postcss"] = "^4.1.18";
      }
      await writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + "\n",
      );
    }
    try {
      await rm("pnpm-lock.yaml", { force: true });
    } catch {}
  } else if (packageManager === "npm") {
    if (packageJson) {
      packageJson.packageManager = "npm@11.7.0";
      await writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + "\n",
      );
    }
    try {
      await rm("pnpm-lock.yaml", { force: true });
    } catch {}
    try {
      await rm("pnpm-workspace.yaml", { force: true });
    } catch {}
  }

  if (packageJson && packageManager !== "pnpm") {
    const pmCmd = packageManager;
    for (const key of Object.keys(packageJson.scripts || {})) {
      if (typeof packageJson.scripts[key] === "string") {
        packageJson.scripts[key] = packageJson.scripts[key]
          .replace(/pnpm /g, pmCmd + " ")
          .replace(/pnpm\./g, pmCmd + ".");
      }
    }
    await writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n",
    );
  }
};

const installDependencies = async (packageManager: string) => {
  if (packageManager === "pnpm") {
    await exec("pnpm install");
  } else if (packageManager === "bun") {
    await exec("bun install");
  } else {
    await exec("npm install");
  }
};

const initializeGit = async () => {
  await exec("git init", execSyncOpts);
  await exec("git branch -M main", execSyncOpts);
  await exec("git add .", execSyncOpts);
  await exec(
    'git commit --no-verify -m "✨ Initial commit from Build Elevate"',
    execSyncOpts,
  );
};

const setupEnvironmentVariables = async (includeDocker: boolean) => {
  const files = [
    { source: join("apps", "api"), target: ".env.local" },
    { source: join("apps", "web"), target: ".env.local" },
    { source: join("packages", "db"), target: ".env" },
    { source: join("packages", "rate-limit"), target: ".env" },
    { source: join("packages", "email"), target: ".env" },
  ];

  // Parallelize env file creation
  const envFilePromises = files.map(async ({ source, target }) => {
    try {
      await copyFile(join(source, ".env.example"), join(source, target));
      await updateAuthSecretInEnvFile(join(source, target));
    } catch (error) {
      // Skip if source app doesn't exist (based on template choice)
    }
  });

  await Promise.all(envFilePromises);

  // Create production env files if Docker is included
  if (includeDocker) {
    const prodFiles = [
      { source: join("apps", "api"), target: ".env.production" },
      { source: join("apps", "web"), target: ".env.production" },
      { source: join("packages", "db"), target: ".env.production" },
      { source: join("packages", "rate-limit"), target: ".env.production" },
      { source: join("packages", "email"), target: ".env.production" },
    ];

    // Parallelize production env file creation
    const prodEnvFilePromises = prodFiles.map(async ({ source, target }) => {
      try {
        await copyFile(join(source, ".env.example"), join(source, target));
        await updateAuthSecretInEnvFile(join(source, target));
      } catch (error) {
        // Skip if source app doesn't exist (based on template choice)
      }
    });

    await Promise.all(prodEnvFilePromises);
  }
};

const buildWorkspacePackages = async (selectedManager: string) => {
  await exec(`${selectedManager} run build`, execSyncOpts);
};

const cleanupPackageJson = async (template: string) => {
  const packageJsonPath = "package.json";
  const content = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(content);

  // Remove CLI-specific fields
  delete packageJson.bin;
  delete packageJson.files;
  delete packageJson.homepage;
  delete packageJson.repository;
  delete packageJson.keywords;
  delete packageJson.bugs;
  delete packageJson.author;

  // Remove CLI-specific scripts
  if (packageJson.scripts) {
    delete packageJson.scripts["build:cli"];
    delete packageJson.scripts.prepublish;
  }

  // Remove all dependencies
  delete packageJson.dependencies;

  // Remove CLI-specific devDependencies
  if (packageJson.devDependencies) {
    delete packageJson.devDependencies["@types/degit"];
    delete packageJson.devDependencies.tsup;
  }

  packageJson.description = getDescription(template);
  packageJson.version = "1.0.0";

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
};

const updateLicense = async (projectName: string) => {
  const licensePath = "LICENSE";
  const currentYear = new Date().getFullYear();

  const content = await readFile(licensePath, "utf8");

  // Replace the copyright line with new project name and current year
  const updated = content.replace(
    /Copyright \(c\) \d{4} .+/,
    `Copyright (c) ${currentYear} ${projectName}`,
  );

  await writeFile(licensePath, updated);
};

const updatePnpmCatalog = async (template: string) => {
  const workspacePath = "pnpm-workspace.yaml";
  const workspaceFile = await readFile(workspacePath, "utf8");

  let updatedContent = workspaceFile;

  updatedContent = updatedContent.replace(
    /\n  cli:[\s\S]*?(?=\n  \w+:|$)/s,
    "",
  );

  if (template === "api") {
    // Remove web catalog section
    updatedContent = updatedContent.replace(
      /\n  web:[\s\S]*?(?=\n  \w+:|$)/s,
      "",
    );
  } else if (template === "web") {
    // Remove server catalog section
    updatedContent = updatedContent.replace(
      /\n  server:[\s\S]*?(?=\n  \w+:|$)/s,
      "",
    );
  }

  await writeFile(workspacePath, updatedContent);
};

const getName = async () => {
  const value = await text({
    message: "What is your project named?",
    placeholder: "my-app",
    validate(value: string) {
      if (value.length === 0) {
        return "Please enter a project name.";
      }
      const error = validateProjectName(value);
      if (error) {
        return error;
      }
    },
  });

  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  return value.toString();
};

const getProjectTemplate = async () => {
  const value = await select({
    message: "What type of project would you like to create?",
    options: [
      {
        value: "fullstack",
        label: "🚀 Full-Stack Application",
        hint: "Complete setup: Web + API + Database + Auth",
      },
      {
        value: "web",
        label: "🎨 Frontend Application",
        hint: "Next.js app with authentication & UI",
      },
      {
        value: "api",
        label: "⚡ Backend API",
        hint: "Express REST API with database & auth",
      },
    ],
    initialValue: "fullstack",
  });

  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  return value.toString() as "fullstack" | "web" | "api";
};

const getDockerChoice = async () => {
  const value = await select({
    message: "Include Docker configuration?",
    options: [
      {
        value: true,
        label: "Yes",
        hint: "Include Dockerfiles and docker-compose",
      },
      { value: false, label: "No", hint: "Skip Docker setup" },
    ],
    initialValue: true,
  });

  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  return value as boolean;
};

const getStudioChoice = async () => {
  const value = await select({
    message: "Include Prisma Studio app?",
    options: [
      {
        value: true,
        label: "Yes",
        hint: "Database management UI",
      },
      { value: false, label: "No", hint: "Skip Prisma Studio" },
    ],
    initialValue: true,
  });

  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  return value as boolean;
};

const validatePrerequisites = async (
  name: string,
  projectDir: string,
  disableGit: boolean,
) => {
  // Check if pnpm is installed
  const hasPnpm = await isCommandAvailable("pnpm");
  if (!hasPnpm) {
    throw new Error(
      "pnpm is required but not installed. Install it with: npm install -g pnpm",
    );
  }

  // Check if git is installed (unless disabled)
  if (!disableGit) {
    const hasGit = await isCommandAvailable("git");
    if (!hasGit) {
      throw new Error(
        "git is required but not installed. Install it or use --disable-git flag.",
      );
    }
  }

  // Check if directory already exists
  const exists = await directoryExists(projectDir);
  if (exists) {
    throw new Error(
      `Directory "${name}" already exists. Please choose a different name or remove the existing directory.`,
    );
  }

  // Validate project name
  const nameError = validateProjectName(name);
  if (nameError) {
    throw new Error(`Invalid project name: ${nameError}`);
  }
};

export const initialize = async (
  projectName?: string,
  options: {
    template?: string;
    git?: boolean;
    skipInstall?: boolean;
    yes?: boolean;
    verbose?: boolean;
    packageManager?: string;
  } = {},
) => {
  try {
    intro("Let's start a Build Elevate project!");

    // Validate template if provided
    if (
      options.template &&
      !["fullstack", "web", "api"].includes(options.template)
    ) {
      log.error(
        `Invalid template: ${options.template}. Choose from: fullstack, web, api`,
      );
      process.exit(1);
    }

    // Validate package manager if provided
    if (
      options.packageManager &&
      !["pnpm", "npm", "bun"].includes(options.packageManager)
    ) {
      log.error(
        `Invalid package manager: ${options.packageManager}. Choose from: pnpm, npm, bun`,
      );
      process.exit(1);
    }

    const cwd = process.cwd();

    // Handle project name - use positional argument or prompt
    const name = projectName || (options.yes ? "my-app" : await getName());

    const template =
      options.template ||
      (options.yes ? "fullstack" : await getProjectTemplate());

    const packageManager = await getPackageManager(
      options.packageManager,
      options.yes,
    );

    // Handle --no-git flag
    const shouldInitGit = options.git !== false;

    const includeDocker = options.yes ? true : await getDockerChoice();

    const includeStudio = options.yes ? true : await getStudioChoice();

    const s = spinner();
    const projectDir = join(cwd, name);

    // Validate prerequisites before starting
    s.start("Validating prerequisites...");
    await validatePrerequisites(name, projectDir, !shouldInitGit);
    s.stop("✓ Prerequisites validated");

    s.start("Cloning Build Elevate...");
    try {
      await cloneBuildElevate(name);
      if (options.verbose) log.info("✓ Cloned repository");
    } catch (error) {
      throw new Error(
        `Failed to clone repository. Check your internet connection and try again. ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    s.message("Moving into repository...");
    process.chdir(projectDir);
    if (options.verbose) log.info(`✓ Changed directory to ${projectDir}`);

    if (template !== "fullstack") {
      s.message(`Configuring ${template} project...`);
      await removeAppsByTemplate(template);
      // Remove client.ts from auth for API-only template
      await removeAuthClientArtifactsForApi(template);
      if (options.verbose) log.info(`✓ Configured ${template} template`);
    }

    s.message("Configuring turbo.json lint env for template...");
    await updateTurboLintEnv(template);
    if (options.verbose) log.info("✓ Updated turbo.json lint env");

    s.message("Replacing project name...");
    await replaceProjectNameInAll(name);
    if (options.verbose) log.info("✓ Replaced project name in all files");

    s.message("Cleaning up package.json...");
    await cleanupPackageJson(template);
    if (options.verbose) log.info("✓ Cleaned up package.json");

    s.message("Updating LICENSE...");
    await updateLicense(name);
    if (options.verbose) log.info("✓ Updated LICENSE");

    s.message("Updating pnpm catalog...");
    await updatePnpmCatalog(template);
    if (options.verbose) log.info("✓ Updated pnpm catalog");

    s.message(`Configuring for ${packageManager}...`);
    await configurePackageManager(packageManager);
    if (options.verbose) log.info("✓ Configured package manager");

    s.message("Setting up environment variable files...");
    await setupEnvironmentVariables(includeDocker);
    if (options.verbose) log.info("✓ Environment files created");

    s.message("Deleting internal content...");
    await deleteInternalContent();
    if (options.verbose) log.info("✓ Deleted internal content");

    if (!includeStudio) {
      s.message("Removing Prisma Studio app...");
      await rm("apps/studio", { recursive: true, force: true });
      if (options.verbose) log.info("✓ Removed Prisma Studio app");
    }

    if (!includeDocker) {
      s.message("Removing Docker files...");
      await removeDockerFiles();
      if (options.verbose) log.info("✓ Removed Docker files");
    } else if (template !== "fullstack") {
      s.message("Updating Docker configuration for template...");
      await updateDockerComposeForTemplate(template);
      if (options.verbose)
        log.info(`✓ Updated Docker configuration for ${template} template`);
    }

    // Handle --skip-install flag
    if (!options.skipInstall) {
      s.message("Installing dependencies...");
      await installDependencies(packageManager);
      if (options.verbose) log.info("✓ Installed dependencies");

      // Build workspace packages
      try {
        await buildWorkspacePackages(packageManager);
      } catch {}
    } else {
      if (options.verbose) log.info("⊘ Skipped dependency installation");
    }

    // Update README.md with project details
    s.message("Creating project README...");
    await createProjectReadme(
      name,
      template,
      includeDocker,
      packageManager as "npm" | "pnpm" | "bun",
    );

    if (shouldInitGit) {
      s.message("Initializing Git repository...");
      await initializeGit();
      if (options.verbose) {
        log.info("✓ Initialized Git repository");
      }
    }

    s.stop("Project initialized successfully!");

    // Adjust next steps based on skipInstall flag
    const cdCommand = `cd ${name}`;
    const installCommand = options.skipInstall
      ? `\n  ${packageManager === "pnpm" ? "pnpm" : packageManager} install`
      : "";
    const devCommand =
      packageManager === "pnpm" ? "pnpm dev" : packageManager + " run dev";
    outro(
      `🎉 Your Build Elevate project is ready!\n\nNext steps:\n  ${cdCommand}${installCommand}\n  Update .env files with your database and API keys\n  ${devCommand}`,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Failed to initialize project: ${error}`;

    log.error(message);
    process.exit(1);
  }
};
