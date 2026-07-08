import Link from "next/link";

import type { CONTACT_INFO_QUERYResult, SITE_SETTINGS_QUERYResult } from "@/lib/sanity/types";

// shared footer with the org mark, tagline, socials, contact block and a small
// explore nav. extracted from the old single-page home so every route gets it.
// route links replace the old in-page anchors.
export function SiteFooter({
  settings,
  contact,
  orgName,
  logoUrl,
}: {
  settings: SITE_SETTINGS_QUERYResult;
  contact: CONTACT_INFO_QUERYResult;
  orgName: string;
  logoUrl: string | null;
}) {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-extrabold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl ?? "/cribs-mark.svg"}
              alt=""
              aria-hidden="true"
              width={36}
              height={36}
              className="size-9 shrink-0"
            />
            {orgName}
          </div>
          <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-paper/70">
            {settings?.tagline}
          </p>
          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <ul className="mt-5 flex gap-3">
              {settings.socialLinks.map(
                (s) =>
                  s.url && (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full border border-paper/25 px-3 py-1 text-xs capitalize text-paper/80 transition-colors hover:border-teal-on-ink hover:text-teal-on-ink"
                      >
                        {s.platform}
                      </a>
                    </li>
                  ),
              )}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper/50">
            Contact
          </h2>
          <address className="mt-4 space-y-2 text-sm not-italic text-paper/80">
            {contact?.address && <p>{contact.address}</p>}
            {contact?.email && (
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-teal-on-ink hover:underline"
                >
                  {contact.email}
                </a>
              </p>
            )}
            {(contact?.phones ?? []).map((ph) => (
              <p key={ph._key}>
                {ph.label && <span className="text-paper/50">{ph.label}: </span>}
                {ph.number && (
                  <a
                    href={`tel:${ph.number.replace(/\s+/g, "")}`}
                    className="hover:text-teal-on-ink"
                  >
                    {ph.number}
                  </a>
                )}
              </p>
            ))}
          </address>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper/50">
            Explore
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            {[
              { label: "About CRIBS", href: "/about" },
              { label: "Programs & services", href: "/programs" },
              { label: "Gallery of smiles", href: "/gallery" },
              { label: "Obra ni Ate Ko", href: "/obra-ni-ate-ko" },
              { label: "Donate", href: "/donate" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-teal-on-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/12">
        <div className="mx-auto max-w-7xl px-5 py-6 text-xs text-paper/50 sm:px-8">
          {settings?.footerCopyright ??
            `Copyright © ${new Date().getFullYear()} ${orgName}`}
        </div>
      </div>
    </footer>
  );
}
