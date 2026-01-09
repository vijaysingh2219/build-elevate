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
  .command("init [project-name]")
  .description("Create a new project")
  .option("-t, --template <type>", "Project type: fullstack, web, or api")
  .option(
    "-p, --package-manager <manager>",
    "Package manager: pnpm, npm, or bun",
  )
  .option("--no-git", "Skip Git repository initialization")
  .option("--skip-install", "Skip dependency installation")
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("-v, --verbose", "Show detailed output")
  .action(initialize);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
