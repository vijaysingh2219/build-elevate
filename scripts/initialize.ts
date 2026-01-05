import { copyFile, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
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
} from "./utils.js";

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
    }
    // For 'fullstack', keep everything
  } catch (error) {
    throw new Error(
      `Failed to remove apps for ${template} template: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

const installDependencies = async () => {
  await exec("pnpm install", execSyncOpts);
};

const initializeGit = async (remoteUrl?: string) => {
  await exec("git init", execSyncOpts);
  await exec("git branch -M main", execSyncOpts);
  await exec("git add .", execSyncOpts);
  await exec(
    'git commit --no-verify -m "✨ Initial commit from Build Elevate"',
    execSyncOpts,
  );

  if (remoteUrl) {
    await exec(`git remote add origin ${remoteUrl}`, execSyncOpts);
  }
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
      log.warn(
        `Skipped env file for ${source}: ${error instanceof Error ? error.message : String(error)}`,
      );
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
        log.warn(
          `Skipped production env file for ${source}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    });

    await Promise.all(prodEnvFilePromises);
  }
};

const buildWorkspacePackages = async () => {
  await exec("pnpm build --filter '@workspace/*'", execSyncOpts);
};

const updatePnpmCatalog = async (template: string) => {
  const workspacePath = "pnpm-workspace.yaml";
  const workspaceFile = await readFile(workspacePath, "utf8");

  let updatedContent = workspaceFile;

  if (template === "api") {
    // Remove web catalog section
    updatedContent = updatedContent.replace(
      /\n  web:[\s\S]*?(?=\n  \w+:|$)/,
      "",
    );
  } else if (template === "web") {
    // Remove server catalog section
    updatedContent = updatedContent.replace(
      /\n  server:[\s\S]*?(?=\n  \w+:|$)/,
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

const getGitRemote = async () => {
  const useRemote = await select({
    message: "Set up Git remote origin?",
    options: [
      {
        value: true,
        label: "Yes",
        hint: "Add remote repository URL",
      },
      { value: false, label: "No", hint: "Skip for now" },
    ],
    initialValue: false,
  });

  if (isCancel(useRemote)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  if (!useRemote) {
    return undefined;
  }

  const remoteUrl = await text({
    message: "Enter your Git remote URL:",
    placeholder: "https://github.com/username/repo.git",
    validate(value: string) {
      if (value.length === 0) {
        return "Please enter a remote URL.";
      }
      // Validate HTTPS/HTTP URLs
      if (value.startsWith("http://") || value.startsWith("https://")) {
        if (!value.match(/^https?:\/\/[a-z0-9.-]+\.[a-z]{2,}\//i)) {
          return "Invalid URL format. Example: https://github.com/username/repo.git";
        }
      }
      // Validate SSH URLs
      else if (value.startsWith("git@")) {
        if (!value.match(/^git@[a-z0-9.-]+\.[a-z]{2,}:/i)) {
          return "Invalid SSH format. Example: git@github.com:username/repo.git";
        }
      } else {
        return "Remote URL must start with https://, http://, or git@";
      }
    },
  });

  if (isCancel(remoteUrl)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  return remoteUrl.toString();
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

export const initialize = async (options: {
  name?: string;
  template?: string;
  disableGit?: boolean;
  gitRemote?: string;
  skipDocker?: boolean;
  skipStudio?: boolean;
  yes?: boolean;
  verbose?: boolean;
}) => {
  try {
    intro("Let's start a Build Elevate project!");

    const cwd = process.cwd();
    const name = options.name || (options.yes ? "my-app" : await getName());
    const template =
      options.template ||
      (options.yes ? "fullstack" : await getProjectTemplate());
    const includeDocker = options.skipDocker
      ? false
      : options.skipDocker === undefined
        ? options.yes
          ? true
          : await getDockerChoice()
        : true;
    const includeStudio = options.skipStudio
      ? false
      : options.skipStudio === undefined
        ? options.yes
          ? true
          : await getStudioChoice()
        : true;
    const gitRemote = options.gitRemote
      ? options.gitRemote
      : !options.disableGit && !options.yes
        ? await getGitRemote()
        : undefined;

    if (!["fullstack", "web", "api"].includes(template)) {
      throw new Error("Invalid project template");
    }

    const s = spinner();
    const projectDir = join(cwd, name);

    // Validate prerequisites before starting
    s.start("Validating prerequisites...");
    await validatePrerequisites(name, projectDir, options.disableGit || false);
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

    s.message("Replacing project name...");
    await replaceProjectNameInAll(name);
    if (options.verbose) log.info("✓ Replaced project name in all files");

    if (template !== "fullstack") {
      s.message("Updating pnpm catalog...");
      await updatePnpmCatalog(template);
      if (options.verbose) log.info("✓ Updated pnpm catalog");
    }

    s.message("Setting up environment variable files...");
    await setupEnvironmentVariables(includeDocker);
    if (options.verbose) log.info("✓ Environment files created");

    s.message("Deleting internal content...");
    await deleteInternalContent();
    if (options.verbose) log.info("✓ Deleted internal content");

    if (template !== "fullstack") {
      s.message(`Configuring ${template} project...`);
      await removeAppsByTemplate(template);
      if (options.verbose) log.info(`✓ Configured ${template} template`);
    }

    if (!includeStudio) {
      s.message("Removing Prisma Studio app...");
      await rm("apps/studio", { recursive: true, force: true });
      if (options.verbose) log.info("✓ Removed Prisma Studio app");
    }

    if (!includeDocker) {
      s.message("Removing Docker files...");
      await removeDockerFiles();
      if (options.verbose) log.info("✓ Removed Docker files");
    }

    s.message("Installing dependencies...");
    await installDependencies();
    if (options.verbose) log.info("✓ Installed dependencies");

    s.message("Building workspace packages...");
    await buildWorkspacePackages();
    if (options.verbose) log.info("✓ Built workspace packages");

    if (!options.disableGit) {
      s.message("Initializing Git repository...");
      await initializeGit(gitRemote);
      if (options.verbose) {
        log.info("✓ Initialized Git repository");
        if (gitRemote) {
          log.info(`✓ Added remote origin: ${gitRemote}`);
        }
      }
    }

    s.stop("Project initialized successfully!");

    outro(
      `🎉 Your Build Elevate project is ready!\n\nNext steps:\n  cd ${name}\n  Update .env files with your database and API keys\n  pnpm build\n  pnpm dev`,
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
