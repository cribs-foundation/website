import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SanityImage } from "@/components/sanity-image";
import { PROGRAM_CATEGORY_LABEL } from "@/lib/labels";
import { sanityFetch } from "@/lib/sanity/fetch";
import { PROGRAMS_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Programs & Services",
  description:
    "CRIBS Foundation's programs: the Receiving Home for infants, New Beginnings for young survivors of abuse, and the Volunteer & Resource program that supports them all.",
};

const FALLBACK_MOTIFS = ["hearth", "hands", "path", "bloom"] as const;

export default async function ProgramsPage() {
  const programs = await sanityFetch({ query: PROGRAMS_QUERY });

  return (
    <>
      <PageHeader
        eyebrow="Programs & services"
        title="One continuous circle of care."
        lede="From an abandoned infant's first safe crib to a young survivor's path to independence, each CRIBS program meets a child where they are, with medical, psycho-social, educational and spiritual care."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        {programs.length === 0 ? (
          <p className="text-ink-50">Programs are being published soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p, i) => (
              <Reveal key={p._id} delayMs={(i % 3) * 70}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-linen shadow-card transition-shadow hover:shadow-lift">
                  <div className="aspect-[16/10] overflow-hidden">
                    <SanityImage
                      source={p.image}
                      alt={p.title ?? "Program"}
                      width={640}
                      height={400}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover"
                      fallbackMotif={FALLBACK_MOTIFS[i % FALLBACK_MOTIFS.length]}
                      fallbackTone={i % 2 === 0 ? "teal" : "band"}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-teal/10 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-teal">
                        {PROGRAM_CATEGORY_LABEL[p.category ?? ""] ?? p.category}
                      </span>
                      {p.ageRange && (
                        <span className="font-mono text-xs text-ink-50">
                          Ages {p.ageRange}
                        </span>
                      )}
                      {p.capacity != null && (
                        <span className="font-mono text-xs text-ink-50">
                          {p.capacity} children
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-xl font-bold text-ink">
                      {p.title}
                    </h2>
                    <p className="mt-3 flex-1 text-base leading-relaxed text-ink-70">
                      {p.summary}
                    </p>
                    {p.slug && (
                      <Link
                        href={`/programs/${p.slug}`}
                        className="mt-5 inline-block font-semibold text-teal underline decoration-1 underline-offset-4 hover:text-harbor"
                      >
                        Learn more
                        <span className="sr-only"> about {p.title}</span>
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
