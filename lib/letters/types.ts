/**
 * The letter content model. Pure types — no filesystem, no React, no
 * `server-only` — so a client component can import these without dragging the
 * loader into its bundle. That is also why there is no barrel file in this
 * directory: the import path says which side of the boundary you are on.
 */

export type Category = "Tecnologia" | "Arte" | "Design" | "Escrita"

/**
 * A letter is only public once it says so. `parse.ts` defaults a missing
 * `status` to "draft" rather than "published" — forgetting the key costs you a
 * letter that did not go out, not one that went out before it was ready.
 */
export type LetterStatus = "draft" | "published"

/**
 * Cover image for a letter. `src` is a path under /public, so next/image can
 * optimise it at build time — a remote URL would also need a matching entry in
 * `images.remotePatterns` in next.config.ts.
 *
 * It is rendered with `fill` inside a fixed box rather than at its intrinsic
 * size, so one asset serves both the listing and the article header without
 * either being locked to the file's own proportions. Crop to taste with
 * `position` when the subject is not centred.
 */
export type Cover = {
  src: string
  /**
   * What the image shows, for someone who cannot see it. Use "" only when the
   * image is purely decorative and the title already carries the meaning.
   */
  alt: string
  /** object-position, e.g. "top" or "50% 30%". Defaults to centre. */
  position?: string
  /**
   * CSS aspect-ratio for the box, e.g. "3 / 5". Defaults to 3 / 2.
   *
   * Give it the file's own dimensions when the image must not be cropped at
   * all — a bordered card or anything with text near an edge. Give it a
   * rounder ratio when you would rather the crop absorb differences between
   * one letter's art and the next.
   */
  ratio?: string
}

/**
 * Everything about a letter except the letter.
 *
 * Listings, the sitemap and `generateMetadata` take this rather than `Letter`,
 * so a card component cannot accidentally depend on a body it never renders.
 */
export type LetterMeta = {
  /**
   * Issue number, shown bare as 1. Explicit rather than derived from sort order
   * so inserting an older letter never renumbers the ones already published.
   *
   * It doubles as the letter's stable identity. A UUID on a slug-addressed
   * filesystem publication would be ceremony: the number is author-assigned,
   * ordered and already printed on the page.
   */
  issue: number
  /** Taken from the filename, never written in the frontmatter. */
  slug: string
  status: LetterStatus
  title: string
  /** One-line standfirst shown under the title in listings. */
  dek: string
  category: Category
  /** ISO date, YYYY-MM-DD. Sorts the archive and fills the <time> element. */
  date: string
  /** Set only when a published letter is revised. Feeds `dateModified`. */
  updated?: string
  readingMinutes: number
  /** Runs at the head of the letter itself. Without one it goes text-only. */
  cover?: Cover
  /**
   * Shown where the letter is listed instead of `cover`, for art that suits a
   * narrow upright slot better than a wide one. Falls back to `cover`.
   */
  thumb?: Cover
  /** Overrides `title` in the <title> tag when the title is long for a SERP. */
  seoTitle?: string
  /** Overrides `dek` in the meta description. */
  seoDescription?: string
}

/**
 * A letter with its prose. `body` is the raw Markdown exactly as the author
 * wrote it — never a parsed tree. Parsing happens in `letter-body.tsx`, which
 * keeps the loader free of React and leaves the renderer swappable.
 */
export type Letter = LetterMeta & { body: string }
