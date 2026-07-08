"use client";

import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// oversized mono counter that tallies once when scrolled into view.
// reduced-motion → render the final value instantly, no animation.
export function StatCounter({
  value,
  label,
  suffix,
}: {
  value: number;
  label: string;
  suffix?: string | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  // always start at 0 so server html and the client's first render agree; the
  // reduced-motion final value is applied after mount (avoids hydration mismatch).
  const [display, setDisplay] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;

    // reduced-motion: skip the tally, jump to the final value post-mount.
    if (prefersReducedMotion()) {
      done.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();

        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo for a settling tally.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(Math.round(eased * value));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <div className="text-stat font-mono text-teal">
        {display.toLocaleString("en-US")}
      </div>
      {suffix ? (
        <div className="mt-1 font-mono text-sm uppercase tracking-widest text-marigold-ink">
          {suffix}
        </div>
      ) : null}
      <p className="mt-2 max-w-[26ch] text-base leading-snug text-ink-70">
        {label}
      </p>
    </div>
  );
}
