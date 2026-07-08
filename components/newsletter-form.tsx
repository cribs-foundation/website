"use client";

import { useId, useState } from "react";

// non-functional demo signup. accessible, client-side success state only.
// no backend is wired (see follow-ups).
export function NewsletterForm() {
  const id = useId();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p
        role="status"
        className="rounded-lg bg-linen/10 px-5 py-4 text-linen"
      >
        Thanks! This is a demo signup, so nothing was sent yet.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        id={id}
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-lg border border-linen/25 bg-linen/10 px-4 py-3 text-linen placeholder:text-linen/70 focus:border-linen"
      />
      <button
        type="submit"
        className="rounded-lg bg-linen px-6 py-3 font-semibold text-harbor transition-colors hover:bg-band"
      >
        Subscribe
      </button>
    </form>
  );
}
