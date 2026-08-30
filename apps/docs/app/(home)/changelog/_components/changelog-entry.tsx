import { formatDate, versionAnchor, type ReleaseTag } from "@/lib/changelog";
import type { ChangelogPage } from "@/lib/source";
import { Link as LinkIcon } from "lucide-react";
import { getMDXComponents } from "@/mdx-components";

// ---------------------------------------------------------------------------
// Presentation config
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

// ---------------------------------------------------------------------------
// Entry — Linear-style two-column row: sticky version/date rail + MDX content
// ---------------------------------------------------------------------------

export function Entry({ page }: { page: ChangelogPage }) {
  const anchor = versionAnchor(page.data.version);
  const MDX = page.data.body;

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
          v{page.data.version}
          <LinkIcon
            aria-hidden
            className="w-3 h-3 opacity-0 group-hover/anchor:opacity-100 transition-opacity text-fd-muted-foreground"
          />
          <span className="sr-only">Link to v{page.data.version}</span>
        </a>
        <time
          dateTime={page.data.date}
          className="mt-1 block text-xs text-fd-muted-foreground font-mono"
        >
          {formatDate(page.data.date)}
        </time>
        <div className="mt-3">
          <Badge tag={page.data.tag as ReleaseTag} />
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-fd-foreground">
          {page.data.title}
        </h2>

        {page.data.summary && (
          <p className="mt-2 text-base leading-relaxed text-fd-foreground/80">
            {page.data.summary}
          </p>
        )}

        <div className="mt-6 prose prose-fd dark:prose-invert max-w-none [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-widest [&_h3]:text-fd-muted-foreground [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:space-y-1.5 [&_ul]:ml-4 [&_li]:text-base [&_li]:text-fd-foreground/80 [&_li]:leading-relaxed">
          <MDX components={getMDXComponents()} />
        </div>
      </div>
    </article>
  );
}
