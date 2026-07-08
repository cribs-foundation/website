// formats an ISO date string as "8 July 2026" (no dashes in user-visible copy).
// returns null for missing/invalid dates so callers can omit the line.
export function formatEventDate(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  // date-only values ("2026-07-08") parse as UTC midnight; pin the render zone
  // to UTC so they don't shift a day earlier west of UTC.
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
