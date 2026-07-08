import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { formatEventDate } from "@/lib/format";
import { getEvents } from "@/lib/sanity/chrome";
import { sanityFetch } from "@/lib/sanity/fetch";
import { EVENT_BY_SLUG_QUERY } from "@/lib/sanity/queries";

// only prerender internal events that actually use this generic route: external
// events link off-site and internalPath events (e.g. Obra) render elsewhere.
export async function generateStaticParams() {
  const events = await getEvents();
  return events
    .filter((e) => e.linkMode !== "external" && !e.internalPath && e.slug)
    .map((e) => ({ slug: e.slug as string }));
}

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await sanityFetch({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug },
  });
  if (!event) return { title: "Event not found" };
  return {
    title: event.title ?? "Event",
    description: event.summary ?? undefined,
  };
}

export default async function EventDetailPage({
  params,
}: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await sanityFetch({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!event) notFound();

  const date = formatEventDate(event.date);

  return (
    <main>
      <section className="border-b border-ink/8 bg-linen">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-16">
          <div>
            <Link
              href="/events"
              className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-teal hover:text-harbor"
            >
              All events
            </Link>
            {(date || event.location) && (
              <p className="mt-5 font-mono text-sm text-ink-50">
                {[date, event.location].filter(Boolean).join(" · ")}
              </p>
            )}
            <h1 className="mt-3 text-display font-display font-extrabold text-ink">
              {event.title}
            </h1>
            {event.summary && (
              <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-70">
                {event.summary}
              </p>
            )}
          </div>

          <div className="aspect-[16/11] overflow-hidden rounded-2xl shadow-card">
            <SanityImage
              source={event.coverImage}
              alt={event.title ?? "Event"}
              width={800}
              height={550}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
              fallbackMotif="bloom"
              fallbackTone="teal"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
        {event.body && event.body.length > 0 ? (
          <PortableText value={event.body} />
        ) : (
          <p className="text-ink-70">More detail on this event is coming soon.</p>
        )}
      </section>
    </main>
  );
}
