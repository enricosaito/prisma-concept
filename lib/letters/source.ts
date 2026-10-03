import "server-only"

import fs from "node:fs"
import path from "node:path"
import { cache } from "react"

import { parseLetter } from "./parse.ts"
import type { Letter, LetterMeta } from "./types.ts"

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
 * Drafts are visible where the author works, and nowhere a reader can reach.
 *
 * Two places qualify. `next dev`, obviously. And Vercel preview deployments,
 * where `VERCEL_ENV` is "preview" — every branch build, on a URL that is not
 * the custom domain.
 *
 * The preview case is safe because of a project setting, not a hope: this
 * project has Vercel Authentication on for `all_except_custom_domains`, so an
 * unauthenticated request to a preview URL is redirected to the Vercel login
 * (verified: 302, against 200 on www.prismaconcept.com.br). A crawler cannot
 * authenticate, so a draft on a preview is unreachable and unindexable. **If
 * that protection is ever turned off, this line has to go with it.**
 *
 * Production is neither of those, so a draft is never built into the site a
 * reader sees. It is not hidden at request time; it does not exist.
 */
const SHOW_DRAFTS =
  process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"

/** Files already complained about in this process. See the warning below. */
const warned = new Set<string>()

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
    // Tudo aqui dentro é carta: o guia do autor mora em docs/, justamente para
    // que esta pasta não precise de exceções — e para que o editor, que lista
    // o diretório inteiro, não mostre um arquivo de documentação como carta.
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const file = `content/cartas/${name}`
      const source = fs.readFileSync(path.join(CONTENT_DIR, name), "utf8")
      const slug = name.replace(/\.md$/, "")

      try {
        return parseLetter(source, slug, file)
      } catch (error) {
        // A letter that will be published must parse, full stop — a broken one
        // fails the build, which is the whole point of validating at all.
        //
        // A draft is different. It is half-written by definition, it is not
        // part of the site being deployed, and it must not be able to stop you
        // shipping a change that has nothing to do with it. So in a build that
        // hides drafts, an unparseable one is dropped with a warning instead.
        //
        // `looksPublished` reads the raw frontmatter rather than the parsed
        // letter, because the parse is what just failed. It errs towards
        // publishing: anything it cannot read as an explicit draft is treated
        // as published, and still throws.
        if (SHOW_DRAFTS || looksPublished(source)) throw error

        // `next build` collects pages in several worker processes, and each one
        // reads the directory, so without this the same warning prints six
        // times and buries the rest of the output.
        if (!warned.has(file)) {
          warned.add(file)
          console.warn(
            `[cartas] ${file} foi ignorado: ${(error as Error).message}\n` +
              `         É um rascunho, então o build segue. Rode \`npm run cartas:check\`.`
          )
        }
        return undefined
      }
    })
    .filter((letter): letter is Letter => letter !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date) || a.issue - b.issue)

  // Two letters claiming the same URL, or the same number, is a mistake worth
  // failing the build over — the alternative is one of them silently winning.
  assertUnique(letters, (l) => l.slug, "slug")
  assertUnique(letters, (l) => String(l.issue), "issue")

  return letters
})

/**
 * Does this file claim to be published, judging only by its raw text?
 *
 * Used on the error path, where the real parse has already failed, so it cannot
 * rely on anything structured. It fails towards strictness: no readable
 * `status: draft` line means "treat it as published", and a published letter
 * that does not parse always stops the build.
 */
function looksPublished(source: string): boolean {
  return !/^\s*status\s*:\s*["']?draft["']?\s*$/m.test(source)
}

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
