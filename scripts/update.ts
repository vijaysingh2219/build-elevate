import { readFile, rm, writeFile } from "node:fs/promises";
import { envsByTemplate } from "./utils.js";

export const updateTurboLintEnv = async (template: string) => {
  const turboPath = "turbo.json";
  const content = await readFile(turboPath, "utf8");
  const turbo = JSON.parse(content);
  if (!turbo.tasks?.lint) return;
  turbo.tasks.lint.env = envsByTemplate[template];
  await writeFile(turboPath, JSON.stringify(turbo, null, 2) + "\n");
};

// Remove client.ts and related artifacts for API-only template
export const removeAuthClientArtifactsForApi = async (template: string) => {
  if (template === "api") {
    try {
      await rm("packages/auth/src/client.ts", { force: true });
    } catch (error) {
      // Ignore if file doesn't exist
    }
    // Remove export * from './client'; and its comment from index.ts
    const indexPath = "packages/auth/src/index.ts";
    try {
      let indexContent = await readFile(indexPath, "utf8");
      // Remove the client auth comment line
      const clientCommentRegex =
        /^\/\/ Client auth \(for React components - only import in client-side code\)\s*\n?/m;
      indexContent = indexContent.replace(clientCommentRegex, "");
      // Remove the client export line
      const clientExportRegex = /^export \* from '.\/client';\s*\n?/m;
      indexContent = indexContent.replace(clientExportRegex, "");
      await writeFile(indexPath, indexContent);
    } catch (error) {
      // Ignore if file doesn't exist
    }

    // Remove './client' export from package.json
    const pkgPath = "packages/auth/package.json";
    try {
      const pkgContent = await readFile(pkgPath, "utf8");
      const pkg = JSON.parse(pkgContent);
      if (pkg.exports && pkg.exports["./client"]) {
        delete pkg.exports["./client"];
        await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
      }
    } catch (error) {
      // Ignore if file doesn't exist
    }

    // Remove client field from keys.ts
    const keysPath = "packages/auth/src/keys.ts";
    try {
      let keysContent = await readFile(keysPath, "utf8");
      // Remove the client field block
      keysContent = keysContent.replace(/\s*client:\s*{[^}]*},?\n?/m, "\n");
      // Remove the NEXT_PUBLIC_BASE_URL line from runtimeEnv
      keysContent = keysContent.replace(
        /\s*NEXT_PUBLIC_BASE_URL: process\.env\.NEXT_PUBLIC_BASE_URL,?\n?/m,
        "\n",
      );
      await writeFile(keysPath, keysContent);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }
};
