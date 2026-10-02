import "server-only"

import fs from "node:fs"
import path from "node:path"
import { cache } from "react"

import { parseLetter } from "@/lib/letters/parse"
import type { Letter, LetterMeta } from "@/lib/letters/types"

/**
 * The content access layer, and the only module in the repo that touches the
 * filesystem. Everything above it — pages, components, the sitemap — goes
 * through these five functions.
 *
 * That is the whole point of the boundary: moving the publication onto a CMS
 * later means reimplementing these function bodies behind unchanged
 * signatures, plus swapping the body format in `components/letter-body.tsx`.
 * Nothing in `app/` or `components/` has to change.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "cartas")

/**
 * Drafts are visible while writing and nowhere else.
 *
 * `next build` runs with NODE_ENV=production everywhere — locally, on a Vercel
 * preview, and in production — so a draft never makes it into a deployed
 * artifact at all. It is not hidden at request time; it is never built.
 */
const SHOW_DRAFTS = process.env.NODE_ENV === "development"

/**
 * Every letter on disk, drafts included, oldest first.
 *
 * Not exported, and nothing below it skips the `isVisible` filter — which is
 * what makes "a draft cannot leak" a property of this file rather than a habit
 * of its callers.
 *
 * Memoised with React `cache()` rather than a module-level variable: editing a
 * .md file does not invalidate the compiled module that would hold such a
 * variable, so `next dev` would happily serve prose you had already changed.
 * `cache()` dedupes the readdir across `generateStaticParams`,
 * `generateMetadata` and the page body within one render, then forgets.
 */
const readAll = cache((): Letter[] => {
  let filenames: string[]
  try {
    filenames = fs.readdirSync(CONTENT_DIR)
  } catch (cause) {
    throw new Error(
      `Não consegui ler content/cartas. A pasta precisa existir, mesmo vazia.`,
      { cause }
    )
  }

  const letters = filenames
    .filter((name) => name.endsWith(".md") && name !== "README.md")
    .map((name) => {
      const file = `content/cartas/${name}`
      const source = fs.readFileSync(path.join(CONTENT_DIR, name), "utf8")
      return parseLetter(source, name.replace(/\.md$/, ""), file)
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.issue - b.issue)

  // Two letters claiming the same URL, or the same number, is a mistake worth
  // failing the build over — the alternative is one of them silently winning.
  assertUnique(letters, (l) => l.slug, "slug")
  assertUnique(letters, (l) => String(l.issue), "issue")

  return letters
})

function assertUnique(
  letters: Letter[],
  key: (letter: Letter) => string,
  label: string
) {
  const seen = new Map<string, string>()
  for (const letter of letters) {
    const value = key(letter)
    const first = seen.get(value)
    if (first) {
      throw new Error(
        `content/cartas: ${label} duplicado "${value}" — em ${first}.md e ${letter.slug}.md.`
      )
    }
    seen.set(value, letter.slug)
  }
}

const isVisible = (letter: Letter) =>
  letter.status === "published" || SHOW_DRAFTS

/** Drops the body, so a listing cannot accidentally depend on one. */
function toMeta(letter: Letter): LetterMeta {
  const { body, ...meta } = letter
  void body
  return meta
}

/**
 * Letters a reader can see.
 *
 * Defaults to oldest first, which is how the archive reads — issue 1 upward,
 * as a shelf rather than a feed. The home page asks for "newest".
 */
export const getPublishedLetters = cache(
  (order: "oldest" | "newest" = "oldest"): LetterMeta[] => {
    const visible = readAll().filter(isVisible).map(toMeta)
    return order === "newest" ? visible.reverse() : visible
  }
)

/** The most recent visible letter. Feeds the sitemap's lastModified. */
export const getLatestLetter = cache((): LetterMeta | undefined => {
  const visible = readAll().filter(isVisible)
  return visible.length ? toMeta(visible[visible.length - 1]) : undefined
})

/**
 * A full letter, body included. Returns undefined for an unknown slug and for
 * a draft in a production build, so the page 404s either way.
 */
export const getLetterBySlug = cache((slug: string): Letter | undefined => {
  const letter = readAll().find((item) => item.slug === slug)
  return letter && isVisible(letter) ? letter : undefined
})

/** Metadata only — for `generateMetadata` and JSON-LD, which never need prose. */
export const getLetterMetadata = cache(
  (slug: string): LetterMeta | undefined => {
    const letter = getLetterBySlug(slug)
    return letter ? toMeta(letter) : undefined
  }
)

/**
 * The slugs to prerender. Drafts are absent, so with `dynamicParams = false`
 * on the route a draft URL is a hard 404 with no function invocation.
 */
export const getLetterSlugs = cache((): string[] =>
  readAll().filter(isVisible).map((letter) => letter.slug)
)
