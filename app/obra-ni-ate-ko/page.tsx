import type { Metadata } from "next";

import { PortableText } from "@/components/portable-text";
import { Reveal } from "@/components/reveal";
import { SanityImage } from "@/components/sanity-image";
import { getObraCategories } from "@/lib/sanity/chrome";
import { sanityFetch } from "@/lib/sanity/fetch";
import { OBRA_PAGE_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Obra ni Ate Ko",
  description:
    "Obra ni Ate Ko: a gallery of donated artworks whose sales support the recovery and independent-living journey of the young women of CRIBS' New Beginnings program.",
};

const FALLBACK_MOTIFS = ["bloom", "path", "hands", "hearth"] as const;

// stable anchor id per category (slug when present, else _id).
function anchorId(cat: { slug: string | null; _id: string }) {
  return `cat-${cat.slug ?? cat._id}`;
}

export default async function ObraPage() {
  const [page, categories] = await Promise.all([
    sanityFetch({ query: OBRA_PAGE_QUERY }),
    getObraCategories(),
  ]);

  const groups = categories.filter((c) => (c.images?.length ?? 0) > 0);

  // art-led opening: showcase the first artwork oversized beside the intro
  // (SanityImage falls back to brand art when no image is uploaded yet).
  const leadArt = groups[0]?.images?.[0] ?? null;

  return (
    <>
      <section
        aria-labelledby="obra-heading"
        className="border-b border-ink/8 bg-linen"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:py-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-teal">
              <span className="h-px w-8 bg-marigold" aria-hidden="true" />
              Obra ni Ate Ko
            </p>
            <h1
              id="obra-heading"
              className="max-w-[20ch] text-display font-display font-extrabold text-ink"
            >
              {page?.heading ?? "Art that funds healing."}
            </h1>
            <div className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-70">
              {page?.intro ? (
                <PortableText value={page.intro} />
              ) : (
                "Donated works by and for the young women of New Beginnings. Every piece sold helps fund their recovery and their journey toward independent living."
              )}
            </div>
          </div>

          <figure className="overflow-hidden rounded-2xl bg-band shadow-lift ring-1 ring-ink/10">
            <div className="aspect-[4/5]">
              <SanityImage
                source={leadArt}
                alt={leadArt?.alt ?? ""}
                width={720}
                height={900}
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                fallbackMotif="bloom"
                fallbackTone="band"
                className="h-full w-full object-cover"
              />
            </div>
          </figure>
        </div>
      </section>

      {/* in-page category jump nav: teal-only, sticky under the header. */}
      {groups.length > 0 && (
        <nav
          aria-label="Categories"
          className="sticky top-0 z-30 border-b border-ink/8 bg-paper/90 backdrop-blur"
        >
          <ul className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-2 px-5 py-3 font-mono text-xs uppercase tracking-wider sm:px-8">
            {groups.map((group) => (
              <li key={group._id}>
                <a
                  href={`#${anchorId(group)}`}
                  className="text-ink-50 transition-colors hover:text-teal"
                >
                  {group.name}
                  <span className="ml-1.5 text-ink-50">
                    {group.images?.length ?? 0}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        {groups.length === 0 ? (
          <p className="text-ink-50">
            The gallery is being prepared. Please check back soon.
          </p>
        ) : (
          <div className="space-y-20">
            {groups.map((group) => {
              const id = anchorId(group);
              return (
                <section
                  key={group._id}
                  id={id}
                  aria-labelledby={`${id}-heading`}
                  className="scroll-mt-20"
                >
                  <Reveal className="mb-8 flex items-baseline gap-3">
                    <h2
                      id={`${id}-heading`}
                      className="text-h2 font-display font-bold text-ink"
                    >
                      {group.name}
                    </h2>
                    <span className="font-mono text-sm text-ink-50">
                      {group.images?.length ?? 0}
                    </span>
                  </Reveal>

                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {group.images?.map((img, i) => (
                      <Reveal
                        as="li"
                        key={img._key}
                        delayMs={(i % 4) * 50}
                        className="overflow-hidden rounded-xl border border-ink/8 bg-band shadow-card"
                      >
                        <div className="aspect-[4/5]">
                          <SanityImage
                            source={img}
                            alt={img.alt ?? ""}
                            width={480}
                            height={600}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="h-full w-full object-cover"
                            fallbackMotif={
                              FALLBACK_MOTIFS[i % FALLBACK_MOTIFS.length]
                            }
                            fallbackTone="band"
                          />
                        </div>
                      </Reveal>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
