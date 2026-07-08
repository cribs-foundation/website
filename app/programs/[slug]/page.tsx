import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";

import { PortableText } from "@/components/portable-text";
import { Reveal } from "@/components/reveal";
import { SanityImage } from "@/components/sanity-image";
import { PROGRAM_CATEGORY_LABEL } from "@/lib/labels";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  PROGRAM_BY_SLUG_QUERY,
  PROGRAM_SLUGS_QUERY,
} from "@/lib/sanity/queries";

// prerender the known programs; new slugs fall back to on-demand rendering.
export async function generateStaticParams() {
  const rows = await sanityFetch({ query: PROGRAM_SLUGS_QUERY });
  return rows
    .map((r) => r.slug)
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = await sanityFetch({
    query: PROGRAM_BY_SLUG_QUERY,
    params: { slug },
  });
  if (!program) return { title: "Program not found" };
  return {
    title: program.title ?? "Program",
    description: program.summary ?? undefined,
  };
}

function humanSize(bytes?: number | null) {
  if (!bytes) return null;
  const kb = bytes / 1024;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export default async function ProgramDetailPage({
  params,
}: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = await sanityFetch({
    query: PROGRAM_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!program) notFound();

  const forms = (program.downloadableForms ?? []).filter(
    (f) => f.file?.asset?.url,
  );

  return (
    <main>
      {/* ---------- HEADER ---------- */}
      <section className="border-b border-ink/8 bg-linen">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-16">
          <div>
            <Link
              href="/programs"
              className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-teal hover:text-harbor"
            >
              ← All programs
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal/10 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-teal">
                {PROGRAM_CATEGORY_LABEL[program.category ?? ""] ??
                  program.category}
              </span>
              {program.ageRange && (
                <span className="font-mono text-xs text-ink-50">
                  Ages {program.ageRange}
                </span>
              )}
              {program.capacity != null && (
                <span className="font-mono text-xs text-ink-50">
                  Up to {program.capacity} children
                </span>
              )}
            </div>
            <h1 className="mt-4 text-display font-display font-extrabold text-ink">
              {program.title}
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-70">
              {program.summary}
            </p>
          </div>

          <div className="aspect-[16/11] overflow-hidden rounded-2xl shadow-card">
            <SanityImage
              source={program.image}
              alt={program.title ?? "Program"}
              width={800}
              height={550}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
              fallbackMotif="hearth"
              fallbackTone="teal"
            />
          </div>
        </div>
      </section>

      {/* ---------- BODY ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            {program.body && program.body.length > 0 ? (
              <PortableText value={program.body} />
            ) : (
              <p className="text-ink-70">
                More detail on this program is coming soon.
              </p>
            )}
          </div>

          {/* downloadable forms rail */}
          {forms.length > 0 && (
            <aside>
              <div className="rounded-2xl border border-ink/8 bg-linen p-6 shadow-card">
                <h2 className="font-mono text-xs uppercase tracking-widest text-marigold-ink">
                  Downloadable forms
                </h2>
                <ul className="mt-4 space-y-2">
                  {forms.map((f) => {
                    const size = humanSize(f.file?.asset?.size);
                    return (
                      <li key={f._key}>
                        <a
                          href={f.file!.asset!.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 rounded-lg border border-ink/8 bg-paper p-3 transition-colors hover:border-teal"
                        >
                          <DownloadSimple
                            size={20}
                            className="mt-0.5 shrink-0 text-teal"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-ink">
                            {f.label}
                            {size && (
                              <span className="mt-0.5 block font-mono text-xs font-normal text-ink-50">
                                {size}
                              </span>
                            )}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          )}
        </div>

        <div className="mt-14 border-t border-ink/8 pt-10">
          <Reveal className="flex flex-wrap items-center gap-4">
            <Link
              href="/donate"
              className="rounded-full bg-teal px-7 py-3.5 text-base font-semibold text-linen shadow-lift transition-colors hover:bg-harbor"
            >
              Donate
            </Link>
            <Link
              href="/contact"
              className="text-base font-semibold text-teal underline decoration-1 underline-offset-4 hover:text-harbor"
            >
              Volunteer or ask a question
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
