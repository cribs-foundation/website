import type { Metadata } from "next";
import Link from "next/link";

import { CareTimeline, type TimelineItem } from "@/components/care-timeline";
import { PageHeader } from "@/components/page-header";
import { PortableText } from "@/components/portable-text";
import { PortableTextPlain } from "@/components/portable-text-plain";
import { Reveal } from "@/components/reveal";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  HISTORY_MILESTONES_QUERY,
  HOME_PAGE_QUERY,
} from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "About CRIBS: Transforming Lives Since 1974",
  description:
    "The story of CRIBS Foundation, from two missionary wives fostering children in 1974 to a DSWD-licensed child welfare agency caring for the Philippines' most vulnerable children.",
};

// heritage moments get marigold nodes on the care thread.
const KEY_YEARS = new Set([1974, 1983]);

export default async function AboutPage() {
  const [milestones, home] = await Promise.all([
    sanityFetch({ query: HISTORY_MILESTONES_QUERY }),
    sanityFetch({ query: HOME_PAGE_QUERY }),
  ]);

  const timelineItems: TimelineItem[] = milestones
    .filter((m): m is typeof m & { year: number } => typeof m.year === "number")
    .map((m) => ({
      id: m._id,
      year: m.year,
      title: m.title ?? "",
      body: <PortableText value={m.description} />,
      keyYear: KEY_YEARS.has(m.year),
    }));

  return (
    <>
      <PageHeader
        eyebrow="About CRIBS"
        title="Transforming lives since 1974."
        lede="The first foster-care NGO in the Philippines, born when two missionary wives opened their home to two children in need. Half a century on, that circle of care has never broken."
      />

      {/* ---------- MISSION & VISION ---------- */}
      <section
        aria-labelledby="mission-heading"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2
              id="mission-heading"
              className="mb-5 text-h2 font-display font-bold text-ink"
            >
              {home?.missionHeading ??
                "Care, healing and recovery for children in need of special protection."}
            </h2>
            <PortableText value={home?.missionBody} />
          </Reveal>

          <Reveal delayMs={120} className="lg:pt-2">
            <div className="rounded-2xl border border-ink/8 bg-linen p-8 shadow-card">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-marigold-ink">
                {home?.visionHeading ?? "Our vision"}
              </p>
              <div className="mt-4 font-display text-2xl font-bold leading-snug text-ink">
                <PortableTextPlain value={home?.visionBody} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- HISTORY TIMELINE (signature) ---------- */}
      <section
        aria-labelledby="history-heading"
        className="border-y border-ink/8 bg-linen"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal className="mb-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-marigold-ink">
              The care thread
            </p>
            <h2
              id="history-heading"
              className="mx-auto mt-3 max-w-[20ch] text-h2 font-display font-bold text-ink"
            >
              An unbroken line of care, 1974 to today.
            </h2>
          </Reveal>

          {timelineItems.length > 0 ? (
            <CareTimeline items={timelineItems} />
          ) : (
            <p className="text-center text-ink-50">
              Our history is being written. Check back soon.
            </p>
          )}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 lg:py-24">
        <Reveal>
          <h2 className="mx-auto max-w-[24ch] text-h2 font-display font-bold text-ink">
            Fifty years on, the work continues.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/programs"
              className="rounded-full bg-teal px-7 py-3.5 text-base font-semibold text-linen shadow-lift transition-colors hover:bg-harbor"
            >
              Our programs
            </Link>
            <Link
              href="/donate"
              className="text-base font-semibold text-teal underline decoration-1 underline-offset-4 hover:text-harbor"
            >
              Donate
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
