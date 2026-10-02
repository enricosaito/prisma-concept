/**
 * Proves content/cartas/*.md says exactly what lib/posts.ts said.
 *
 * Throwaway, like its sibling. Two checks, both exact:
 *   1. metadata  — the parsed LetterMeta deep-equals the old object's fields
 *   2. prose     — the Markdown body walked back into blocks is character-for-
 *                  character identical to the old `content` array
 *
 * If this passes, no word of the letter changed in the move. That is the point:
 * AGENTS.md asks for the migration to be mechanical and verifiable, and an
 * assertion is verifiable where "I was careful" is not.
 *
 *   node scripts/verify-migration.mjs
 */

import fs from "node:fs"
import path from "node:path"
import assert from "node:assert/strict"

const CONTENT_DIR = path.join(process.cwd(), "content", "cartas")

async function loadPosts() {
  const src = fs.readFileSync("lib/posts.ts", "utf8")
  const start = src.indexOf("export const posts")
  const end = src.indexOf("\nconst byDateAsc")
  const body = src
    .slice(start, end)
    .replace(/^export const posts: Post\[\] = /, "const posts = ")
  const mod = await import(
    "data:text/javascript," + encodeURIComponent(`${body}\nexport default posts`)
  )
  return mod.default
}

/** The inverse of migrate-posts.mjs: Markdown back into the old block shape. */
function blocksFrom(markdown) {
  const blocks = []
  for (const chunk of markdown.trim().split(/\n\n+/)) {
    if (chunk.startsWith("## ")) {
      blocks.push({ type: "h2", text: chunk.slice(3) })
      continue
    }
    if (chunk.startsWith("> ")) {
      const lines = chunk.split("\n").map((l) => l.replace(/^>\s?/, ""))
      const text = lines[0]
      const citeLine = lines.find((l, i) => i > 0 && l.startsWith("— "))
      blocks.push(
        citeLine
          ? { type: "quote", text, cite: citeLine.slice(2) }
          : { type: "quote", text }
      )
      continue
    }
    if (/^- /.test(chunk)) {
      blocks.push({
        type: "list",
        items: chunk.split("\n").map((l) => l.replace(/^- /, "")),
      })
      continue
    }
    blocks.push({ type: "p", text: chunk })
  }
  return blocks
}

// parse.ts is TypeScript, so re-split the frontmatter here with the same rules
// rather than importing it. The build's own parser is exercised by `next build`.
const { parse: parseYaml } = await import("yaml")
function split(source) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(
    source.replace(/^﻿/, "")
  )
  return { data: parseYaml(m[1]), body: source.slice(m[0].length).trim() }
}

const posts = await loadPosts()
let failures = 0

for (const post of posts) {
  const file = path.join(CONTENT_DIR, `${post.slug}.md`)
  const { data, body } = split(fs.readFileSync(file, "utf8"))

  try {
    // 1. Metadata.
    assert.equal(data.issue, post.issue, "issue")
    assert.equal(data.title, post.title, "title")
    assert.equal(data.dek, post.dek, "dek")
    assert.equal(data.category, post.category, "category")
    assert.equal(data.date, post.date, "date")
    assert.equal(typeof data.date, "string", "date deve ser string, não Date")
    assert.equal(data.readingMinutes, post.readingMinutes, "readingMinutes")
    assert.equal(data.status, "published", "status")
    assert.deepEqual(data.cover ?? undefined, post.cover, "cover")
    assert.deepEqual(data.thumb ?? undefined, post.thumb, "thumb")

    // 2. Prose, exactly.
    assert.deepEqual(blocksFrom(body), post.content, "content")

    console.log(
      `ok  ${post.slug}  —  ${post.content.length} blocos idênticos, metadados idênticos`
    )
  } catch (error) {
    failures++
    console.error(`FALHOU  ${post.slug}: ${error.message}`)
    if (error.actual !== undefined) {
      console.error("  esperado:", JSON.stringify(error.expected)?.slice(0, 200))
      console.error("  obtido  :", JSON.stringify(error.actual)?.slice(0, 200))
    }
  }
}

console.log(
  failures
    ? `\n${failures} carta(s) divergem.`
    : `\n${posts.length} carta(s) verificada(s). Nenhuma palavra mudou.`
)
process.exit(failures ? 1 : 0)
