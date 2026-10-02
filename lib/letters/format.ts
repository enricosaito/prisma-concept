/**
 * Display helpers for letter metadata.
 *
 * Deliberately in their own module, with no `server-only` and no filesystem:
 * a client component that wants to print a date can import this without
 * pulling the loader in behind it. Moved verbatim from the old `lib/posts.ts`.
 */

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso))
}

/**
 * Compact form for listings: "21 ago, 2026", which the UI sets in caps.
 *
 * Assembled from parts rather than taking pt-BR's own short format, which
 * renders "21 de ago. de 2026" — two "de"s and an abbreviating point, all of
 * them noise at this size. The comma does the separating instead.
 */
export function formatDateShort(iso: string): string {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(new Date(iso))

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ""

  return `${part("day")} ${part("month").replace(".", "")}, ${part("year")}`
}

/** Issue number as it is shown: plain, unpadded — 1 -> "1". */
export function formatIssue(issue: number): string {
  return String(issue)
}
