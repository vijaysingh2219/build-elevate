import { cn } from "@/lib/cn";

/**
 * Decorative background layer: a faint masked grid with a soft radial glow on top.
 * Theme-aware (uses semantic tokens) and purely presentational.
 */
export function GridGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Grid lines, faded out toward the edges with a radial mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      {/* Soft primary glow near the top */}
      <div className="absolute left-1/2 top-[-10%] h-[420px] w-[820px] max-w-full -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
    </div>
  );
}
