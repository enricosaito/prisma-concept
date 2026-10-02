/**
 * One-shot migration: lib/posts.ts -> content/cartas/<slug>.md
 *
 * Throwaway. Deleted at the end of the refactor; it exists so the move is a
 * mechanical transform with assertions rather than a human retyping prose.
 *
 * The rule it enforces: prose is copied character for character. If a string
 * contains anything Markdown would interpret, the script FAILS rather than
 * escaping it — escaping would be the machine editing the letter, which is
 * exactly what AGENTS.md forbids. A human decides what to do instead.
 *
 *   node scripts/migrate-posts.mjs
 */

import fs from "node:fs"
import path from "node:path"

const OUT_DIR = path.join(process.cwd(), "content", "cartas")

// Characters Markdown gives meaning to anywhere in a line.
const ACTIVE_ANYWHERE = /[*_`[\]#|~<>{}\\]/
// Constructs Markdown only recognises at the start of a line.
const ACTIVE_LEADING = /^\s*(?:[-+*]\s|#{1,6}\s|>\s|\d+\.\s|={3,}\s*$|-{3,}\s*$)/

/** Read the posts array out of lib/posts.ts without importing TypeScript. */
async function loadPosts() {
  const src = fs.readFileSync("lib/posts.ts", "utf8")
  // Strip types and exports so the literal can be eval'd as plain JS.
  const start = src.indexOf("export const posts")
  const end = src.indexOf("\nconst byDateAsc")
  if (start === -1 || end === -1) throw new Error("Não achei o array posts em lib/posts.ts")
  const body = src
    .slice(start, end)
    .replace(/^export const posts: Post\[\] = /, "const posts = ")
  const mod = await import(
    "data:text/javascript," + encodeURIComponent(`${body}\nexport default posts`)
  )
  return mod.default
}

function assertVerbatim(value, where) {
  const anywhere = value.match(ACTIVE_ANYWHERE)
  const leading = value.match(ACTIVE_LEADING)
  if (anywhere || leading) {
    throw new Error(
      `PAROU: ${where} contém sintaxe de Markdown ` +
        `(${anywhere ? `caractere "${anywhere[0]}"` : "início de lista/título"}).\n` +
        `  ${JSON.stringify(value.slice(0, 90))}\n` +
        `  Escapar isso seria editar o texto da carta. Decida você o que fazer.`
    )
  }
}

/** YAML scalar: always quoted, because titles and deks carry ": " and dashes. */
const q = (s) => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`

function coverYaml(key, cover) {
  if (!cover) return []
  const lines = [`${key}:`, `  src: ${cover.src}`]
  if (cover.position) lines.push(`  position: ${q(cover.position)}`)
  if (cover.ratio) lines.push(`  ratio: ${q(cover.ratio)}`)
  lines.push(`  alt: ${q(cover.alt)}`)
  return lines
}

function bodyFor(post) {
  return post.content
    .map((block, i) => {
      const where = `${post.slug} bloco ${i} (${block.type})`
      switch (block.type) {
        case "h2":
          assertVerbatim(block.text, where)
          return `## ${block.text}`
        case "quote": {
          assertVerbatim(block.text, where)
          const lines = [`> ${block.text}`]
          if (block.cite) {
            assertVerbatim(block.cite, `${where} cite`)
            lines.push(">", `> — ${block.cite}`)
          }
          return lines.join("\n")
        }
        case "list":
          block.items.forEach((item) => assertVerbatim(item, where))
          return block.items.map((item) => `- ${item}`).join("\n")
        case "p":
        default:
          assertVerbatim(block.text, where)
          return block.text
      }
    })
    .join("\n\n")
}

const posts = await loadPosts()
fs.mkdirSync(OUT_DIR, { recursive: true })

for (const post of posts) {
  assertVerbatim(post.title, `${post.slug} title`)
  assertVerbatim(post.dek, `${post.slug} dek`)

  const front = [
    "---",
    `issue: ${post.issue}`,
    "status: published",
    `date: ${q(post.date)}`,
    `category: ${post.category}`,
    `readingMinutes: ${post.readingMinutes}`,
    `title: ${q(post.title)}`,
    `dek: ${q(post.dek)}`,
    ...coverYaml("cover", post.cover),
    ...coverYaml("thumb", post.thumb),
    "---",
  ].join("\n")

  const out = path.join(OUT_DIR, `${post.slug}.md`)
  fs.writeFileSync(out, `${front}\n\n${bodyFor(post)}\n`, "utf8")
  console.log(`ok  content/cartas/${post.slug}.md  (${post.content.length} blocos)`)
}

console.log(`\n${posts.length} carta(s) migrada(s), sem uma alteração de texto.`)
