"use client";

import React, { useState } from "react";
import { changelog } from "@/lib/changelog-data";
import type {
  ChangelogEntry,
  ReleaseTag,
  ChangeCategory,
} from "@/lib/changelog-data";
import { ChevronRight, Dot, Github, Rss } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Config
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

const CAT_CONFIG: Record<
  ChangeCategory,
  { label: string; color: string; dot: string }
> = {
  added: {
    label: "Added",
    color: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  changed: {
    label: "Changed",
    color: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500 dark:bg-blue-400",
  },
  fixed: {
    label: "Fixed",
    color: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  removed: {
    label: "Removed",
    color: "text-red-600 dark:text-red-400",
    dot: "bg-red-500 dark:bg-red-400",
  },
  deprecated: {
    label: "Deprecated",
    color: "text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-500 dark:bg-yellow-400",
  },
  security: {
    label: "Security",
    color: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500 dark:bg-orange-400",
  },
  performance: {
    label: "Performance",
    color: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-500 dark:bg-cyan-400",
  },
};

const CAT_ORDER: ChangeCategory[] = [
  "added",
  "changed",
  "fixed",
  "removed",
  "deprecated",
  "security",
  "performance",
];

const GROUP_CONFIG: Record<string, string> = {
  "Monorepo & Infrastructure": "text-emerald-600 dark:text-emerald-400",
  Authentication: "text-blue-600 dark:text-blue-400",
  "Account & UI": "text-sky-600 dark:text-sky-400",
  "Database & Config": "text-purple-600 dark:text-purple-400",
  "Bug Fixes": "text-amber-600 dark:text-amber-400",
};

const GROUP_ORDER = Object.keys(GROUP_CONFIG);

const GITHUB_URL = "https://github.com/vijaysingh2219/build-elevate";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    (acc[key(item)] ??= []).push(item);
    return acc;
  }, {});
}

/** Converts a text-* class to the equivalent bg-* class for dot indicators. */
function colorClassToDot(colorClass: string): string {
  return colorClass
    .split(" ")
    .map((cls) => cls.replace(/^text-/, "bg-"))
    .join(" ");
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
      {items.map((text, i) => (
        <li
          key={i}
          className="flex items-start gap-1 text-sm text-fd-foreground/70 leading-relaxed"
        >
          <Dot className="text-fd-foreground/25 flex-shrink-0 -ml-1" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeader({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colorClassToDot(colorClass)}`}
      />
      <span
        className={`text-xs font-semibold uppercase tracking-widest ${colorClass}`}
      >
        {label}
      </span>
    </div>
  );
}

function FlatChanges({ changes }: { changes: ChangelogEntry["changes"] }) {
  const grouped = groupBy(changes, (c) => c.category);
  return (
    <div className="space-y-4">
      {CAT_ORDER.filter((k) => grouped[k]).map((k) => {
        const { label, color } = CAT_CONFIG[k];
        return (
          <div key={k}>
            <SectionHeader label={label} colorClass={color} />
            <ChangeList items={grouped[k].map((c) => c.text)} />
          </div>
        );
      })}
    </div>
  );
}

function GroupedChanges({ changes }: { changes: ChangelogEntry["changes"] }) {
  const grouped = groupBy(changes, (c) => c.group ?? "Other");
  return (
    <div className="space-y-5">
      {GROUP_ORDER.filter((g) => grouped[g]).map((g) => (
        <div key={g}>
          <SectionHeader
            label={g}
            colorClass={GROUP_CONFIG[g] ?? "text-fd-muted-foreground"}
          />
          <ChangeList items={grouped[g].map((c) => c.text)} />
        </div>
      ))}
    </div>
  );
}

function Entry({
  entry,
  isLatest,
}: {
  entry: ChangelogEntry;
  isLatest: boolean;
}) {
  const [open, setOpen] = useState(isLatest);
  const hasChanges = entry.changes.length > 0;
  const isGrouped = entry.changes.some((c) => c.group);

  return (
    <div className="relative flex gap-5 group">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0 w-4">
        <div
          className={cn(
            "w-2.5 h-2.5 rounded-full border-2 mt-1.5 flex-shrink-0 transition-colors duration-300",
            isLatest
              ? "bg-emerald-500 dark:bg-emerald-400 border-emerald-500 dark:border-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.35)]"
              : "bg-fd-background border-fd-border group-hover:border-fd-foreground/30",
          )}
        />
        <div className="w-px flex-1 bg-fd-border mt-1" />
      </div>

      {/* Body */}
      <div className="flex-1 pb-10 min-w-0">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="font-mono font-bold text-sm tracking-tight text-fd-foreground">
            v{entry.version}
          </span>
          <Badge tag={entry.tag} />
          <time className="text-xs text-fd-muted-foreground font-mono ml-auto">
            {entry.date}
          </time>
        </div>

        {/* Title */}
        <p className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground mb-1.5 mt-0.5">
          {entry.title}
        </p>

        {/* Summary */}
        <p className="text-sm leading-relaxed mb-3 text-fd-foreground/70">
          {entry.summary}
        </p>

        {/* Expand / collapse */}
        {hasChanges && (
          <>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground border border-fd-border hover:border-fd-foreground/30 rounded-md px-2.5 py-1 transition-colors mb-4 group/btn"
            >
              <ChevronRight
                className={cn(
                  "w-3 h-3 transition-transform duration-200",
                  open && "rotate-90",
                )}
              />
              <span>{open ? "Collapse" : "View changes"}</span>
              <span className="text-fd-muted-foreground/50 group-hover/btn:text-fd-muted-foreground transition-colors">
                ({entry.changes.length})
              </span>
            </button>

            {open && (
              <div className="rounded-xl border border-fd-border bg-fd-card p-5">
                {isGrouped ? (
                  <GroupedChanges changes={entry.changes} />
                ) : (
                  <FlatChanges changes={entry.changes} />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const NAV_LINKS = [
  { label: "GitHub Releases", href: `${GITHUB_URL}/releases`, icon: Github },
  { label: "RSS Feed", href: "#", icon: Rss },
] as const;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ChangelogPage() {
  return (
    <div>
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-50 dark:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-fd-border) 1px, transparent 1px)," +
            "linear-gradient(90deg, var(--color-fd-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.4,
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-fd-foreground mb-2">
            Changelog
          </h1>
          <p className="text-sm text-fd-muted-foreground leading-relaxed max-w-sm">
            All changes, fixes and updates to build-elevate.
          </p>

          <div className="flex gap-2 mt-4">
            {NAV_LINKS.map(({ label, href, icon }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground border border-fd-border hover:border-fd-foreground/30 rounded-md px-3 py-1.5 transition-colors"
              >
                {React.createElement(icon, { className: "w-3 h-3" })}
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Entries */}
        <div>
          {changelog.map((entry, i) => (
            <Entry key={entry.version} entry={entry} isLatest={i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
