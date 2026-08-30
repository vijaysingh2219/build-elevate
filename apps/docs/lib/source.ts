import { changelog as changelogCollection, docs } from "collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const changelogSource = loader({
  baseUrl: "/changelog",
  source: changelogCollection.toFumadocsSource(),
});

export type ChangelogPage = InferPageType<typeof changelogSource>;

function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split(".").map((n) => parseInt(n, 10) || 0);
  const parts2 = v2.split(".").map((n) => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] ?? 0;
    const p2 = parts2[i] ?? 0;
    if (p1 !== p2) return p2 - p1;
  }
  return 0;
}

export function getSortedChangelogPages(): ChangelogPage[] {
  return [...changelogSource.getPages()].sort((a, b) => {
    const dateDiff =
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return compareVersions(a.data.version, b.data.version);
  });
}

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
