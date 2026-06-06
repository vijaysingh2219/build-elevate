import {
  changelog,
  categoryMeta,
  CATEGORY_ORDER,
  SITE_URL,
  versionAnchor,
} from "@/lib/changelog-data";
import type { ChangelogEntry } from "@/lib/changelog-data";

const FEED_TITLE = "build-elevate Changelog";
const FEED_DESC = "All changes, fixes and updates to build-elevate.";
const CHANGELOG_URL = `${SITE_URL}/changelog`;
const FEED_URL = `${CHANGELOG_URL}/rss.xml`;

/** Escapes the five XML predefined entities. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Renders a release's changes as an HTML fragment for the item description. */
function renderDescription(entry: ChangelogEntry): string {
  const parts: string[] = [];
  if (entry.summary) parts.push(`<p>${escapeXml(entry.summary)}</p>`);

  const byCategory = new Map<string, string[]>();
  for (const change of entry.changes) {
    const list = byCategory.get(change.category) ?? [];
    list.push(change.text);
    byCategory.set(change.category, list);
  }

  for (const category of CATEGORY_ORDER) {
    const items = byCategory.get(category);
    if (!items?.length) continue;
    const lis = items.map((t) => `<li>${escapeXml(t)}</li>`).join("");
    parts.push(`<h3>${categoryMeta[category].label}</h3><ul>${lis}</ul>`);
  }

  return parts.join("");
}

function renderItem(entry: ChangelogEntry): string {
  const url = `${CHANGELOG_URL}#${versionAnchor(entry.version)}`;
  const pubDate = new Date(`${entry.date}T00:00:00Z`).toUTCString();
  const title = escapeXml(`v${entry.version} — ${entry.title}`);

  return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${renderDescription(entry)}]]></description>
    </item>`;
}

export const dynamic = "force-static";

export function GET(): Response {
  const latest = changelog[0];
  const lastBuildDate = latest
    ? new Date(`${latest.date}T00:00:00Z`).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${CHANGELOG_URL}</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
${changelog.map(renderItem).join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
