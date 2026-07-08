"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// calm reveal: opacity + 16px rise once in view. reduced-motion is handled in
// css (.reveal collapses to static), so we only toggle data-shown here.
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
  delayMs?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as "div";
  return (
    <Comp
      // @ts-expect-error polymorphic ref across div/section/li is safe here
      ref={ref}
      className={`reveal ${className}`}
      data-shown={shown}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}
