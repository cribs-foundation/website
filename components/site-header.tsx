"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavLink = { label: string; href: string };

// sticky header with a teal Donate CTA and a mobile menu. nav items are real
// App Router routes (see lib/nav). logoUrl is the editable siteSettings.logo
// (Sanity); falls back to the bundled crisp vector mark from their official badge.
export function SiteHeader({
  orgName,
  nav,
  logoUrl,
}: {
  orgName: string;
  nav: NavLink[];
  logoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-extrabold leading-none text-ink"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl ?? "/cribs-mark.svg"}
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            className="size-10 shrink-0"
          />
          <span className="hidden sm:inline">{orgName}</span>
          <span className="sm:hidden">CRIBS</span>
        </Link>

        {/* desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-semibold transition-colors hover:text-teal ${
                  active ? "text-teal" : "text-ink-70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/donate"
            className="hidden rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-linen shadow-card transition-colors hover:bg-harbor sm:inline-block"
          >
            Donate
          </Link>

          {/* mobile menu toggle */}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X size={24} weight="bold" aria-hidden="true" />
            ) : (
              <List size={24} weight="bold" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-ink/8 bg-paper lg:hidden"
        >
          <nav
            aria-label="Primary mobile"
            className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-3 text-base font-semibold transition-colors hover:bg-band ${
                  isActive(item.href) ? "text-teal" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-teal px-5 py-3 text-center text-base font-semibold text-linen"
            >
              Donate
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
