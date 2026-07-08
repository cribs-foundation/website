"use client";

import { useState } from "react";

// copies a bank detail to the clipboard with an accessible confirmation.
// the underlying value stays selectable text in the parent; this is a shortcut.
export function CopyButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (e.g. insecure context), value is still
      // selectable, so this is a graceful no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-teal/25 px-2.5 py-1 font-mono text-xs font-medium text-teal transition-colors hover:bg-teal hover:text-linen"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
