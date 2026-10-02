import { splitFrontmatter } from "@/lib/letters/frontmatter"
import type {
  Category,
  Cover,
  Letter,
  LetterMeta,
  LetterStatus,
} from "@/lib/letters/types"

/**
 * Turns a raw letter file into a validated `Letter`, or throws.
 *
 * Hand-rolled rather than zod, on purpose. The input is a dozen fields written
 * by one person who also owns the build, and this runs inside
 * `generateStaticParams`, so a malformed letter fails `next build` loudly and
 * never reaches a deploy. What actually matters here is the quality of the
 * message when something is wrong, in Portuguese, naming the file and the
 * field — and customising a ZodError tree to say that costs more than the
 * eighty lines below. Reach for zod when a second content type appears.
 */

const CATEGORIES = ["Tecnologia", "Arte", "Design", "Escrita"] as const
const STATUSES = ["draft", "published"] as const
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Every key the model knows. Anything else is a typo worth mentioning. */
const KNOWN_KEYS = new Set([
  "issue",
  "status",
  "title",
  "dek",
  "category",
  "date",
  "updated",
  "readingMinutes",
  "cover",
  "thumb",
  "seoTitle",
  "seoDescription",
])

function fail(file: string, message: string): never {
  throw new Error(`${file}: ${message}`)
}

function requireString(
  file: string,
  data: Record<string, unknown>,
  key: string
): string {
  const value = data[key]
  if (typeof value !== "string" || value.trim() === "") {
    fail(file, `"${key}" é obrigatório e precisa ser um texto não vazio.`)
  }
  return value
}

function optionalString(
  file: string,
  data: Record<string, unknown>,
  key: string
): string | undefined {
  const value = data[key]
  if (value === undefined || value === null) return undefined
  if (typeof value !== "string" || value.trim() === "") {
    fail(file, `"${key}", se presente, precisa ser um texto não vazio.`)
  }
  return value
}

function requirePositiveInt(
  file: string,
  data: Record<string, unknown>,
  key: string
): number {
  const value = data[key]
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    fail(file, `"${key}" é obrigatório e precisa ser um número inteiro maior que zero.`)
  }
  return value
}

/**
 * Accepts a string or a `Date` and returns YYYY-MM-DD.
 *
 * The `Date` branch should be unreachable with the YAML 1.2 core schema, and is
 * here so that changing the YAML engine cannot silently produce `[object Date]`
 * in a `<time>` attribute.
 */
function requireDate(
  file: string,
  value: unknown,
  key: string,
  required: boolean
): string | undefined {
  if (value === undefined || value === null) {
    if (required) fail(file, `"${key}" é obrigatório, no formato AAAA-MM-DD.`)
    return undefined
  }

  const iso =
    value instanceof Date
      ? value.toISOString().slice(0, 10)
      : typeof value === "string"
        ? value.trim()
        : undefined

  if (iso === undefined || !ISO_DATE.test(iso)) {
    fail(file, `"${key}" precisa estar no formato AAAA-MM-DD — recebido ${JSON.stringify(value)}.`)
  }
  // Rejects 2026-13-45, which matches the pattern but is not a day.
  if (Number.isNaN(new Date(`${iso}T00:00:00Z`).getTime())) {
    fail(file, `"${key}" não é uma data que existe: ${iso}.`)
  }
  return iso
}

function requireCategory(file: string, data: Record<string, unknown>): Category {
  const value = data.category
  if (typeof value !== "string" || !CATEGORIES.includes(value as Category)) {
    fail(
      file,
      `"category" precisa ser uma de ${CATEGORIES.join(", ")} — recebido ${JSON.stringify(value)}.`
    )
  }
  return value as Category
}

/** Absent means draft. Forgetting the key must never publish a letter. */
function readStatus(file: string, data: Record<string, unknown>): LetterStatus {
  const value = data.status
  if (value === undefined || value === null) return "draft"
  if (typeof value !== "string" || !STATUSES.includes(value as LetterStatus)) {
    fail(
      file,
      `"status" precisa ser "draft" ou "published" — recebido ${JSON.stringify(value)}.`
    )
  }
  return value as LetterStatus
}

function optionalCover(
  file: string,
  data: Record<string, unknown>,
  key: "cover" | "thumb"
): Cover | undefined {
  const value = data[key]
  if (value === undefined || value === null) return undefined
  if (typeof value !== "object" || Array.isArray(value)) {
    fail(file, `"${key}" precisa ter os campos src e alt.`)
  }

  const cover = value as Record<string, unknown>
  const src = cover.src
  const alt = cover.alt

  if (typeof src !== "string" || !src.startsWith("/")) {
    fail(
      file,
      `"${key}.src" precisa ser um caminho dentro de /public começando com "/" — ` +
        `recebido ${JSON.stringify(src)}.`
    )
  }
  // "" is allowed: the doc comment on Cover says decorative art takes an empty
  // alt. Missing is not the same as deliberately empty.
  if (typeof alt !== "string") {
    fail(
      file,
      `"${key}.alt" é obrigatório — descreva a imagem, ou use "" se ela for puramente decorativa.`
    )
  }

  const position = cover.position
  const ratio = cover.ratio
  if (position !== undefined && typeof position !== "string") {
    fail(file, `"${key}.position" precisa ser um texto, como "top" ou "50% 30%".`)
  }
  if (ratio !== undefined && typeof ratio !== "string") {
    fail(file, `"${key}.ratio" precisa ser um texto, como "3 / 5".`)
  }

  return {
    src,
    alt,
    ...(position ? { position } : {}),
    ...(ratio ? { ratio } : {}),
  }
}

/**
 * @param slug  Taken from the filename. The frontmatter has no slug key, so
 *              there is nothing for the URL and the file to disagree about.
 * @param file  Repo-relative path, used only to name the file in errors.
 */
export function parseLetter(source: string, slug: string, file: string): Letter {
  if (!SLUG.test(slug)) {
    fail(
      file,
      `o nome do arquivo vira a URL, então precisa ser minúsculas, números e hifens — ` +
        `algo como "titulo-da-carta.md".`
    )
  }

  const { data, body } = splitFrontmatter(source, file)

  for (const key of Object.keys(data)) {
    if (!KNOWN_KEYS.has(key)) {
      // A warning, not a throw: a mistyped key should be noticed, not block a
      // publish late at night.
      console.warn(`${file}: campo desconhecido "${key}" na frontmatter — ignorado.`)
    }
  }

  if (body === "") fail(file, "a carta está sem texto abaixo da frontmatter.")

  // Optional fields are spread in only when present, so an absent key stays
  // absent rather than becoming an explicit `undefined` — which would survive
  // `JSON.stringify` as a key and show up in the migration diff.
  const updated = requireDate(file, data.updated, "updated", false)
  const cover = optionalCover(file, data, "cover")
  const thumb = optionalCover(file, data, "thumb")
  const seoTitle = optionalString(file, data, "seoTitle")
  const seoDescription = optionalString(file, data, "seoDescription")

  return {
    issue: requirePositiveInt(file, data, "issue"),
    slug,
    status: readStatus(file, data),
    title: requireString(file, data, "title"),
    dek: requireString(file, data, "dek"),
    category: requireCategory(file, data),
    date: requireDate(file, data.date, "date", true)!,
    readingMinutes: requirePositiveInt(file, data, "readingMinutes"),
    ...(updated ? { updated } : {}),
    ...(cover ? { cover } : {}),
    ...(thumb ? { thumb } : {}),
    ...(seoTitle ? { seoTitle } : {}),
    ...(seoDescription ? { seoDescription } : {}),
    body,
  }
}

/** Re-exported so callers can type a meta-only view without a second import. */
export type { LetterMeta }
