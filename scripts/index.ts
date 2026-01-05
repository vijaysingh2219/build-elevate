import { program } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initialize } from "./initialize.js";

// Get package.json version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

program
  .name("build-elevate")
  .description(
    "Production-grade full-stack starter with Next.js, Express, and authentication",
  )
  .version(packageJson.version);

program
  .command("init")
  .description("Create a new Build Elevate project")
  .option("--name <name>", "Project name")
  .option(
    "--template <type>",
    "Project type: fullstack, web, or api (default: fullstack)",
  )
  .option("--disable-git", "Skip Git repository initialization")
  .option("--git-remote <url>", "Set Git remote origin URL")
  .option("--skip-docker", "Exclude Docker configuration")
  .option("--skip-studio", "Exclude Prisma Studio app")
  .option("-y, --yes", "Skip all prompts and use default values")
  .option("--verbose", "Show detailed output during initialization")
  .action(initialize);

program.parse(process.argv);
