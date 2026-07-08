import {
  PortableText as PortableTextBase,
  type PortableTextComponents,
  type PortableTextProps,
} from "next-sanity";

// shared portable text renderer with brand-sensible defaults. teal links,
// relaxed body measure. used for mission/vision/program/milestone/donation copy.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 max-w-[62ch] text-lg leading-relaxed text-ink-70 last:mb-0">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-2 border-marigold pl-4 text-lg italic leading-relaxed text-ink last:mb-0">
        {children}
      </blockquote>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 font-display text-2xl font-bold text-ink">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 font-display text-xl font-bold text-ink">
        {children}
      </h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 max-w-[62ch] list-disc space-y-1 pl-5 text-lg leading-relaxed text-ink-70">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 max-w-[62ch] list-decimal space-y-1 pl-5 text-lg leading-relaxed text-ink-70">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href;
      // no href → render plain text rather than a link that jumps to top.
      if (!href) return <>{children}</>;
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="text-teal underline decoration-1 underline-offset-2 hover:text-harbor"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableText({ value }: { value: PortableTextProps["value"] }) {
  if (!value) return null;
  return <PortableTextBase value={value} components={components} />;
}
