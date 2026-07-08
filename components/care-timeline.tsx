"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type TimelineItem = {
  id: string;
  year: number;
  title: string;
  body: ReactNode;
  keyYear: boolean;
};

// THE SIGNATURE: a vertical teal "care thread" spine with alternating
// milestone cards. each node lights as it reaches viewport center via a single
// IntersectionObserver over the milestone refs; the teal thread grows in steps
// (css height transition), so state updates only a handful of times, never per
// scroll frame. marigold nodes mark the two heritage moments (1974, 1983).
// reduced-motion → fully drawn thread + all nodes lit, applied after mount so
// server html and the client's first render agree (no hydration mismatch).
export function CareTimeline({ items }: { items: TimelineItem[] }) {
  const liRefs = useRef<Array<HTMLLIElement | null>>([]);
  // highest node index reached; drives the thread height and node states.
  const [litIndex, setLitIndex] = useState(-1);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLitIndex(items.length - 1);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        let maxReached = -1;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.index ?? -1,
            );
            if (idx > maxReached) maxReached = idx;
          }
        }
        if (maxReached >= 0) {
          // monotonic: never un-light a node the user already scrolled past.
          setLitIndex((prev) => (maxReached > prev ? maxReached : prev));
        }
      },
      // light a node once it crosses roughly the vertical center of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const el of liRefs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, [items.length]);

  // thread height grows in steps toward the lit node (percent of the list).
  const threadPct =
    items.length > 0 ? ((litIndex + 1) / items.length) * 100 : 0;

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* spine track (faint) + drawn thread (teal), centered on lg, left on mobile. */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 top-0 left-[15px] w-0.5 bg-ink/10 lg:left-1/2 lg:-translate-x-1/2"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-[15px] w-0.5 origin-top bg-teal transition-[height] duration-700 ease-out lg:left-1/2 lg:-translate-x-1/2"
        style={{ height: `${threadPct}%` }}
      />

      <ol className="space-y-10 lg:space-y-16">
        {items.map((item, i) => {
          const lit = i <= litIndex;
          const left = i % 2 === 0; // alternate sides on lg
          return (
            <li
              key={item.id}
              ref={(el) => {
                liRefs.current[i] = el;
              }}
              data-index={i}
              className="relative pl-12 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:pl-0"
            >
              {/* node on the spine */}
              <span
                aria-hidden="true"
                className={`absolute top-1.5 left-[7px] z-10 size-4 rounded-full border-2 transition-all duration-500 lg:left-1/2 lg:-translate-x-1/2 ${
                  lit
                    ? item.keyYear
                      ? "scale-125 border-marigold bg-marigold shadow-[0_0_0_5px_rgba(233,164,38,0.2)]"
                      : "border-teal bg-teal"
                    : "border-ink/20 bg-paper"
                }`}
              />

              <div
                className={`transition-opacity duration-500 ${
                  lit ? "opacity-100" : "opacity-45"
                } ${left ? "lg:col-start-1 lg:text-right" : "lg:col-start-2"}`}
              >
                <div
                  className={`mb-1 flex items-baseline gap-3 ${
                    left ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <span
                    className={`font-mono text-2xl font-medium ${
                      item.keyYear ? "text-marigold-ink" : "text-teal"
                    }`}
                  >
                    {item.year}
                  </span>
                  {item.keyYear && (
                    <span className="rounded-full bg-marigold/12 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-marigold-ink">
                      Milestone
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-ink">
                  {item.title}
                </h3>
                <div className="mt-2 lg:inline-block lg:text-left">
                  {item.body}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
