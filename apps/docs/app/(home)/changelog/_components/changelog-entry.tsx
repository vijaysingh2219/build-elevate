import {
  categoryMeta,
  CATEGORY_ORDER,
  formatDate,
  versionAnchor,
} from "@/lib/changelog-data";
import type {
  ChangelogEntry,
  ReleaseTag,
  ChangeCategory,
} from "@/lib/changelog-data";
import { Dot, Link as LinkIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Presentation config (UI-only; category colors live in changelog-data.ts)
// ---------------------------------------------------------------------------

const TAG_CONFIG: Record<ReleaseTag, { label: string; cls: string }> = {
  latest: {
    label: "Latest",
    cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
  },
  major: {
    label: "Major",
    cls: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
  },
  minor: {
    label: "Minor",
    cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
  },
  patch: {
    label: "Patch",
    cls: "bg-fd-muted text-fd-muted-foreground border-fd-border",
  },
  yanked: {
    label: "Yanked",
    cls: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  security: {
    label: "Security",
    cls: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    (acc[key(item)] ??= []).push(item);
    return acc;
  }, {});
}

/**
 * Orders the present section keys: known keys first (in `order`), then any
 * remaining keys in their original insertion order. Ensures no section is
 * ever silently dropped.
 */
function orderedKeys(present: string[], order: readonly string[]): string[] {
  const known = order.filter((k) => present.includes(k));
  const rest = present.filter((k) => !order.includes(k));
  return [...known, ...rest];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Badge({ tag }: { tag: ReleaseTag }) {
  const { label, cls } = TAG_CONFIG[tag] ?? TAG_CONFIG.patch;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}
    >
      {label}
    </span>
  );
}

function ChangeList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 ml-4">
      {items.map((text) => (
        <li
          key={text}
          className="flex items-start gap-1 text-base text-fd-foreground/80 leading-relaxed"
        >
          <Dot aria-hidden className="text-fd-foreground/25 shrink-0 -ml-1" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeader({
  label,
  text,
  dot,
}: {
  label: string;
  text: string;
  dot: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span
        aria-hidden
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`}
      />
      <span
        className={`text-xs font-semibold uppercase tracking-widest ${text}`}
      >
        {label}
      </span>
    </div>
  );
}

function Changes({ changes }: { changes: ChangelogEntry["changes"] }) {
  const grouped = groupBy(changes, (c) => c.category);
  return (
    <div className="space-y-4">
      {orderedKeys(Object.keys(grouped), CATEGORY_ORDER).map((k) => {
        const meta = categoryMeta[k as ChangeCategory];
        return (
          <div key={k}>
            <SectionHeader label={meta.label} text={meta.text} dot={meta.dot} />
            <ChangeList items={grouped[k].map((c) => c.text)} />
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Entry — Linear-style two-column row: sticky version/date rail + content
// ---------------------------------------------------------------------------

export function Entry({ entry }: { entry: ChangelogEntry }) {
  const hasChanges = entry.changes.length > 0;
  const anchor = versionAnchor(entry.version);

  return (
    <article
      id={anchor}
      className="scroll-mt-24 flex flex-col gap-4 border-t border-fd-border py-12 md:flex-row md:items-start md:gap-12"
    >
      {/* Sticky meta rail */}
      <aside className="md:w-44 lg:w-52 shrink-0 md:sticky md:top-24">
        <a
          href={`#${anchor}`}
          className="group/anchor inline-flex items-center gap-1.5 font-mono font-bold text-sm tracking-tight text-fd-foreground hover:text-fd-primary transition-colors"
        >
          v{entry.version}
          <LinkIcon
            aria-hidden
            className="w-3 h-3 opacity-0 group-hover/anchor:opacity-100 transition-opacity text-fd-muted-foreground"
          />
          <span className="sr-only">Link to v{entry.version}</span>
        </a>
        <time
          dateTime={entry.date}
          className="mt-1 block text-xs text-fd-muted-foreground font-mono"
        >
          {formatDate(entry.date)}
        </time>
        <div className="mt-3">
          <Badge tag={entry.tag} />
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-fd-foreground">
          {entry.title}
        </h2>

        {entry.summary && (
          <p className="mt-2 text-base leading-relaxed text-fd-foreground/80">
            {entry.summary}
          </p>
        )}

        {hasChanges && (
          <div className="mt-6">
            <Changes changes={entry.changes} />
          </div>
        )}
      </div>
    </article>
  );
}
