import { readFile, rm, writeFile } from "node:fs/promises";
import { envsByTemplate, getDescription } from "./utils.js";

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
    const indexPath = "packages/auth/src/index.ts";
    try {
      const indexContent = await readFile(indexPath, "utf8");
      await writeFile(indexPath, applyAuthIndexCleanup(indexContent));
    } catch (error) {
      // Ignore if file doesn't exist
    }

    const pkgPath = "packages/auth/package.json";
    try {
      const pkgContent = await readFile(pkgPath, "utf8");
      await writeFile(pkgPath, applyAuthPackageJsonCleanup(pkgContent));
    } catch (error) {
      // Ignore if file doesn't exist
    }

    const keysPath = "packages/auth/src/keys.ts";
    try {
      const keysContent = await readFile(keysPath, "utf8");
      await writeFile(keysPath, applyAuthKeysCleanup(keysContent));
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }
};

// Pure string-based versions (used by upgrade)
// These apply the exact same transformations as the filesystem versions above,
// but operate on strings so upgrade can apply them to fetched GitHub content
// before hashing or writing — ensuring hashes are comparable to the manifest.

/**
 * Mirrors updateTurboLintEnv() — strips env vars not relevant to the template.
 */
export const applyTurboLintEnv = (
  content: string,
  template: string,
): string => {
  let turbo: any;
  try {
    turbo = JSON.parse(content);
  } catch {
    return content;
  }
  if (!turbo.tasks?.lint) return content;
  turbo.tasks.lint.env = envsByTemplate[template];
  return JSON.stringify(turbo, null, 2) + "\n";
};

/**
 * Mirrors cleanupPackageJson() in initialize.ts — removes CLI-specific fields
 * and resets version to 1.0.0.
 */
export const applyPackageJsonCleanup = (
  content: string,
  template: string,
): string => {
  let pkg: any;
  try {
    pkg = JSON.parse(content);
  } catch {
    return content;
  }

  delete pkg.bin;
  delete pkg.files;
  delete pkg.homepage;
  delete pkg.repository;
  delete pkg.keywords;
  delete pkg.bugs;
  delete pkg.author;

  if (pkg.scripts) {
    delete pkg.scripts["build:cli"];
    delete pkg.scripts.prepublish;
  }

  delete pkg.dependencies;

  if (pkg.devDependencies) {
    delete pkg.devDependencies["@types/degit"];
    delete pkg.devDependencies.tsup;
  }

  pkg.description = getDescription(template);
  pkg.version = "1.0.0";

  return JSON.stringify(pkg, null, 2) + "\n";
};

/**
 * Mirrors updatePnpmCatalog() in initialize.ts — removes catalog sections
 * not relevant to the template.
 */
export const applyPnpmCatalogCleanup = (
  content: string,
  template: string,
): string => {
  let updated = content;

  // Always remove the cli catalog
  updated = updated.replace(/\n  cli:[\s\S]*?(?=\n  \w+:|$)/s, "");

  if (template === "api") {
    updated = updated.replace(/\n  web:[\s\S]*?(?=\n  \w+:|$)/s, "");
  } else if (template === "web") {
    updated = updated.replace(/\n  server:[\s\S]*?(?=\n  \w+:|$)/s, "");
  }

  return updated;
};

/**
 * Mirrors the packages/auth/src/index.ts mutation in removeAuthClientArtifactsForApi().
 */
export const applyAuthIndexCleanup = (content: string): string => {
  let updated = content;
  updated = updated.replace(
    /^\/\/ Client auth \(for React components - only import in client-side code\)\s*\n?/m,
    "",
  );
  updated = updated.replace(/^export \* from '.\/client';\s*\n?/m, "");
  return updated;
};

/**
 * Mirrors the packages/auth/package.json mutation in removeAuthClientArtifactsForApi().
 */
export const applyAuthPackageJsonCleanup = (content: string): string => {
  let pkg: any;
  try {
    pkg = JSON.parse(content);
  } catch {
    return content;
  }
  if (pkg.exports && pkg.exports["./client"]) {
    delete pkg.exports["./client"];
  }
  return JSON.stringify(pkg, null, 2) + "\n";
};

/**
 * Mirrors the packages/auth/src/keys.ts mutation in removeAuthClientArtifactsForApi().
 */
export const applyAuthKeysCleanup = (content: string): string => {
  let updated = content;
  updated = updated.replace(/\s*client:\s*{[^}]*},?\n?/m, "\n");
  updated = updated.replace(
    /\s*NEXT_PUBLIC_BASE_URL: process\.env\.NEXT_PUBLIC_BASE_URL,?\n?/m,
    "\n",
  );
  return updated;
};
