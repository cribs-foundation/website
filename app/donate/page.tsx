import type { Metadata } from "next";

import { AbstractDonateQR } from "@/components/abstract-art";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { PortableText } from "@/components/portable-text";
import { Reveal } from "@/components/reveal";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { DONATION_INFO_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Ways to Give",
  description:
    "Support CRIBS Foundation by bank transfer (BPI Peso, USD and EUR) or QR Ph / GCash. Your gift becomes a safe place for a child to grow up.",
};

export default async function DonatePage() {
  const donation = await sanityFetch({ query: DONATION_INFO_QUERY });

  const qrUrl = donation?.qrImage?.asset
    ? urlFor(donation.qrImage).width(320).height(320).fit("max").url()
    : null;

  return (
    <>
      <PageHeader
        eyebrow="Help our cause"
        title={donation?.heading ?? "Your gift becomes a safe place to grow up."}
        lede={
          donation?.intro ? (
            <PortableText value={donation.intro} />
          ) : (
            "A single donation gives an abandoned baby a crib, a meal, and a chance at a future. Give by bank transfer or QR Ph below."
          )
        }
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* ---------- BANK DETAILS (clean styled text) ---------- */}
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-ink">
              Give by bank transfer
            </h2>
            <p className="mt-1 text-sm text-ink-50">
              Tap Copy, or select any detail to copy it manually.
            </p>

            <ul className="mt-6 space-y-4">
              {(donation?.bankAccounts ?? []).map((acct) => (
                <li
                  key={acct._key}
                  className="rounded-2xl border border-ink/8 bg-linen p-5 shadow-card"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-bold text-ink">
                      {acct.bankName}
                    </span>
                    <span className="rounded-full bg-teal/10 px-2.5 py-0.5 font-mono text-xs font-medium text-teal">
                      {acct.currency}
                    </span>
                  </div>
                  {acct.accountName && (
                    <p className="mt-2 text-sm text-ink-70">
                      {acct.accountName}
                    </p>
                  )}
                  {acct.accountNumber && (
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <code className="select-all font-mono text-lg text-ink">
                        {acct.accountNumber}
                      </code>
                      <CopyButton
                        value={acct.accountNumber}
                        label={`${acct.bankName} ${acct.currency} account number`}
                      />
                    </div>
                  )}
                  {acct.swift && (
                    <div className="mt-2 flex items-center justify-between gap-3 border-t border-ink/8 pt-2">
                      <span className="text-xs text-ink-50">
                        SWIFT{" "}
                        <code className="select-all font-mono text-sm text-ink-70">
                          {acct.swift}
                        </code>
                      </span>
                      <CopyButton
                        value={acct.swift}
                        label={`${acct.bankName} SWIFT code`}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ---------- QR / GCASH ---------- */}
          <Reveal delayMs={120}>
            <h2 className="font-display text-2xl font-bold text-ink">
              Give by QR Ph / GCash
            </h2>
            <p className="mt-1 text-sm text-ink-50">
              Scan the code with any QR Ph-enabled banking app.
            </p>

            <div className="mt-6 rounded-2xl border border-ink/8 bg-linen p-6 shadow-card sm:p-8">
              <div className="flex flex-col items-center gap-4 rounded-xl border border-ink/8 bg-paper p-6 text-center">
                {qrUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrUrl}
                    alt="QR code to donate to CRIBS Foundation"
                    width={200}
                    height={200}
                    className="size-48 rounded-lg"
                  />
                ) : (
                  <>
                    <AbstractDonateQR className="size-48 rounded-lg" />
                    <p className="font-mono text-xs uppercase tracking-wider text-ink-50">
                      QR code coming soon
                    </p>
                  </>
                )}
                <p className="max-w-[32ch] text-sm text-ink-70">
                  {donation?.qrCaption ??
                    "Scan with any QR Ph-enabled banking app."}
                </p>
              </div>

              {donation?.gcashInfo && (
                <p className="mt-5 rounded-xl bg-band p-4 text-sm leading-relaxed text-ink-70">
                  {donation.gcashInfo}
                </p>
              )}

              {donation?.diasporaNote && (
                <p className="mt-4 rounded-xl bg-teal/8 p-4 text-sm leading-relaxed text-ink-70">
                  {donation.diasporaNote}
                </p>
              )}
            </div>
          </Reveal>
        </div>

        {/* ---------- TAX NOTE ---------- */}
        {donation?.taxDeductibilityNote &&
          donation.taxDeductibilityNote.length > 0 && (
            <div className="mt-14 border-t border-ink/8 pt-10">
              <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-marigold-ink">
                Tax deductibility
              </h2>
              <PortableText value={donation.taxDeductibilityNote} />
            </div>
          )}
      </section>
    </>
  );
}
