import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { getContactInfo } from "@/lib/sanity/chrome";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach CRIBS Foundation in Antipolo, Rizal by phone, email, or the contact form. Office hours Monday to Friday, 9am to 5pm.",
};

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// render per-request so "today" tracks the real date, not build time.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contact = await getContactInfo();

  const hours = [...(contact?.officeHours ?? [])].sort(
    (a, b) => DAY_ORDER.indexOf(a.day ?? "") - DAY_ORDER.indexOf(b.day ?? ""),
  );

  // office is in Antipolo, Rizal — compute today in the org's timezone.
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Asia/Manila",
  }).format(new Date());

  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="We'd love to hear from you."
        lede="Whether you want to volunteer, donate, or ask about our programs, reach out. A member of our team will get back to you."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ---------- DETAILS ---------- */}
          <Reveal>
            <div className="space-y-8">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-widest text-marigold-ink">
                  Reach us
                </h2>
                <address className="mt-4 space-y-3 text-base not-italic text-ink-70">
                  {contact?.orgName && (
                    <p className="font-display text-lg font-bold text-ink">
                      {contact.orgName}
                    </p>
                  )}
                  {contact?.address && (
                    <p className="whitespace-pre-line">{contact.address}</p>
                  )}
                  {contact?.email && (
                    <p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-teal underline decoration-1 underline-offset-2 hover:text-harbor"
                      >
                        {contact.email}
                      </a>
                    </p>
                  )}
                  {(contact?.phones ?? []).map((ph) => (
                    <p key={ph._key}>
                      {ph.label && (
                        <span className="text-ink-50">{ph.label}: </span>
                      )}
                      {ph.number && (
                        <a
                          href={`tel:${ph.number.replace(/\s+/g, "")}`}
                          className="text-ink hover:text-teal"
                        >
                          {ph.number}
                        </a>
                      )}
                    </p>
                  ))}
                </address>
              </div>

              {hours.length > 0 && (
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-marigold-ink">
                    Office hours
                  </h2>
                  <dl className="mt-4 space-y-1.5 text-sm">
                    {hours.map((h) => {
                      const isToday = h.day === today;
                      return (
                        <div
                          key={h._key}
                          className={`flex items-center justify-between py-1.5 ${
                            isToday
                              ? "-mx-3 rounded-md bg-teal/8 px-3"
                              : "border-b border-ink/8"
                          }`}
                        >
                          <dt
                            className={`flex items-center gap-2 font-medium ${
                              isToday ? "text-teal" : "text-ink"
                            }`}
                          >
                            {h.day}
                            {isToday && (
                              <span className="rounded-full bg-teal/12 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-teal">
                                Today
                              </span>
                            )}
                          </dt>
                          <dd
                            className={`font-mono ${
                              isToday ? "text-teal" : "text-ink-70"
                            }`}
                          >
                            {h.closed
                              ? "Closed"
                              : `${h.opens ?? "?"} - ${h.closes ?? "?"}`}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              )}

              {contact?.mapLink && (
                <a
                  href={contact.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-semibold text-teal underline decoration-1 underline-offset-4 hover:text-harbor"
                >
                  Open in maps
                </a>
              )}
            </div>
          </Reveal>

          {/* ---------- FORM ---------- */}
          <Reveal delayMs={120}>
            <div className="rounded-2xl border border-ink/8 bg-linen p-6 shadow-card sm:p-8">
              <h2 className="mb-6 font-display text-2xl font-bold text-ink">
                Send us a message
              </h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
