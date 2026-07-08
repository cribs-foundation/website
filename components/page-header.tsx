import type { ReactNode } from "react";

// interior-route header band. mirrors the home eyebrow/h1 rhythm (mono eyebrow
// with a marigold rule, display headline, ink-70 lede) so every page reads as
// the same site. keep motion low here: static, no reveal.
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-ink/8 bg-linen">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        {eyebrow && (
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-teal">
            <span className="h-px w-8 bg-marigold" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-[20ch] text-display font-display font-extrabold text-ink">
          {title}
        </h1>
        {lede && (
          <div className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-70">
            {lede}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
