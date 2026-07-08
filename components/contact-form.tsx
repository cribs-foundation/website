"use client";

import { useActionState, useId } from "react";

import { submitContact, type ContactState } from "@/app/contact/actions";

const initialState: ContactState = null;

// front-end contact form wired to a stub Server Action (no backend transport
// yet, see app/contact/actions.ts). accessible: labels above inputs, teal
// focus ring from globals, aria-live status region.
export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const heardId = useId();
  const messageId = useId();

  const field =
    "mt-1.5 w-full rounded-lg border border-ink/15 bg-linen px-4 py-3 text-ink placeholder:text-ink-50 focus:border-teal";
  const label =
    "font-mono text-xs uppercase tracking-widest text-ink-70";

  if (state?.ok) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-teal/20 bg-teal/8 px-6 py-8 text-center text-ink"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className={label}>
            Name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            autoComplete="name"
            className={field}
          />
        </div>
        <div>
          <label htmlFor={emailId} className={label}>
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </div>
        <div>
          <label htmlFor={phoneId} className={label}>
            Phone <span className="normal-case text-ink-50">(optional)</span>
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={field}
          />
        </div>
        <div>
          <label htmlFor={heardId} className={label}>
            How did you hear about us?{" "}
            <span className="normal-case text-ink-50">(optional)</span>
          </label>
          <input id={heardId} name="heard" type="text" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor={messageId} className={label}>
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={5}
          className={`${field} resize-y`}
        />
      </div>

      {state && !state.ok && (
        <p role="alert" className="text-sm font-medium text-harbor">
          {state.message}
        </p>
      )}

      <div aria-live="polite" className="sr-only">
        {pending ? "Sending your message" : ""}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-teal px-7 py-3.5 text-base font-semibold text-linen shadow-lift transition-colors hover:bg-harbor disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
