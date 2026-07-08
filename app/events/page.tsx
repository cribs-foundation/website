import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SanityImage } from "@/components/sanity-image";
import { formatEventDate } from "@/lib/format";
import { getEvents } from "@/lib/sanity/chrome";
import type { EVENTS_QUERYResult } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Fundraisers, exhibits, and gatherings that sustain the children and young survivors in CRIBS Foundation's care.",
};

const FALLBACK_MOTIFS = ["bloom", "hands", "path", "hearth"] as const;

type Event = EVENTS_QUERYResult[number];

// external → externalUrl; else internalPath when set (e.g. Obra); else the
// generic /events/[slug] detail route.
function resolveHref(e: Event): { href: string; external: boolean } | null {
  if (e.linkMode === "external") {
    return e.externalUrl ? { href: e.externalUrl, external: true } : null;
  }
  if (e.internalPath) {
    // internalPath is free-text; treat an absolute url as external so it gets
    // proper target/rel, otherwise keep it as an in-site link.
    const external = /^https?:\/\//i.test(e.internalPath);
    return { href: e.internalPath, external };
  }
  return e.slug ? { href: `/events/${e.slug}`, external: false } : null;
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Where care becomes community."
        lede="Exhibits, fundraisers, and gatherings that carry the children and young women of CRIBS forward, one shared moment at a time."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        {events.length === 0 ? (
          <p className="text-ink-50">Events are being published soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e, i) => {
              const link = resolveHref(e);
              const date = formatEventDate(e.date);
              return (
                <Reveal key={e._id} delayMs={(i % 3) * 70}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-linen shadow-card transition-shadow hover:shadow-lift">
                    <div className="aspect-[16/10] overflow-hidden bg-band">
                      <SanityImage
                        source={e.coverImage}
                        alt={e.title ?? "Event"}
                        width={640}
                        height={400}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover"
                        fallbackMotif={FALLBACK_MOTIFS[i % FALLBACK_MOTIFS.length]}
                        fallbackTone={i % 2 === 0 ? "band" : "teal"}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      {(date || e.location) && (
                        <p className="mb-3 font-mono text-xs text-ink-50">
                          {[date, e.location].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <h2 className="font-display text-xl font-bold text-ink">
                        {e.title}
                      </h2>
                      {e.summary && (
                        <p className="mt-3 flex-1 text-base leading-relaxed text-ink-70">
                          {e.summary}
                        </p>
                      )}
                      {link &&
                        (link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-block font-semibold text-teal underline decoration-1 underline-offset-4 hover:text-harbor"
                          >
                            View event
                            <span className="sr-only"> {e.title}</span>
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="mt-5 inline-block font-semibold text-teal underline decoration-1 underline-offset-4 hover:text-harbor"
                          >
                            View event
                            <span className="sr-only"> {e.title}</span>
                          </Link>
                        ))}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
