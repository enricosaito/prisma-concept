import { parse as parseYaml } from "yaml"

/**
 * Splits a letter file into its YAML frontmatter and its Markdown body.
 *
 * `yaml` (eemeli) rather than gray-matter/js-yaml, for one concrete reason:
 * js-yaml defaults to the YAML 1.1 schema, which has a timestamp tag, so
 * `date: 2026-10-01` comes back as a `Date` object. Every date in this codebase
 * is a string — `a.date.localeCompare(b.date)` sorts the archive, and
 * `<time dateTime={date}>` prints it. The YAML 1.2 core schema this package
 * defaults to has no timestamp tag, so the same line parses to the string
 * "2026-10-01" and nothing downstream has to know. `parse.ts` still normalises
 * `Date` defensively, so swapping the engine back could not reintroduce it.
 *
 * `\r?\n` throughout: these files are authored on Windows.
 */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/

export type RawLetterFile = {
  /** Whatever the frontmatter parsed to. Validated in `parse.ts`, not here. */
  data: Record<string, unknown>
  /** The Markdown below the closing `---`, verbatim but for a trimmed edge. */
  body: string
}

export function splitFrontmatter(
  source: string,
  /** Only used to name the file in an error message. */
  file: string
): RawLetterFile {
  // A BOM would otherwise stop the `^---` from matching, and the author's
  // editor is free to write one.
  const text = source.replace(/^﻿/, "")
  const match = FRONTMATTER.exec(text)

  if (!match) {
    throw new Error(
      `${file}: frontmatter não encontrada. O arquivo precisa começar com uma linha "---", ` +
        `os metadados em YAML, e outra linha "---" antes do texto da carta.`
    )
  }

  let data: unknown
  try {
    data = parseYaml(match[1])
  } catch (cause) {
    throw new Error(
      `${file}: a frontmatter não é YAML válido. ` +
        `Lembre-se de colocar todo texto entre aspas — um título com ": " quebra o YAML.`,
      { cause }
    )
  }

  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${file}: a frontmatter precisa ser uma lista de campos "chave: valor".`)
  }

  return {
    data: data as Record<string, unknown>,
    body: text.slice(match[0].length).trim(),
  }
}
