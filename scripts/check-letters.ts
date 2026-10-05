/**
 * Valida todas as cartas de uma vez.
 *
 *   npm run cartas:check
 *
 * Por que existe: `parse.ts` já valida, mas só quando o Next renderiza, e para
 * no primeiro erro. Aqui você vê o estado inteiro da pasta num comando de dois
 * segundos, com todos os problemas de todas as cartas listados juntos.
 *
 * Ele importa `lib/letters/parse.ts` de verdade — não há uma segunda cópia das
 * regras que possa discordar do site. O que este arquivo acrescenta são as
 * checagens que o parser não pode fazer sozinho, porque dependem de olhar o
 * disco e o texto: se as imagens existem, se os links internos resolvem, e se o
 * Markdown vai render o que você quis dizer.
 *
 * Roda direto no node, sem build e sem dependência: o Node 22 remove os tipos.
 */

import fs from "node:fs"
import path from "node:path"

import { parseLetter } from "../lib/letters/parse.ts"
import type { Letter } from "../lib/letters/types.ts"

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, "content", "cartas")
const PUBLIC_DIR = path.join(ROOT, "public")

/** O site tem uma rota fixa; o resto de /… precisa ser uma carta. */
const STATIC_ROUTES = new Set(["/"])

type Level = "erro" | "aviso"
type Finding = { level: Level; file: string; message: string; hint?: string }

const findings: Finding[] = []
const add = (level: Level, file: string, message: string, hint?: string) =>
  findings.push({ level, file, message, hint })

/** Agrupa linhas consecutivas iniciadas por ">" — um blockquote cada. */
function blockquotesOf(body: string): string[][] {
  const quotes: string[][] = []
  let current: string[] = []
  for (const line of body.split("\n")) {
    if (/^\s*>/.test(line)) {
      current.push(line.trimStart())
    } else if (current.length) {
      quotes.push(current)
      current = []
    }
  }
  if (current.length) quotes.push(current)
  return quotes
}

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------

const filenames = fs
  .readdirSync(CONTENT_DIR)
  .filter((name) => name.endsWith(".md"))
  .sort()

const letters: Letter[] = []

for (const name of filenames) {
  const file = `content/cartas/${name}`
  const source = fs.readFileSync(path.join(CONTENT_DIR, name), "utf8")
  try {
    letters.push(parseLetter(source, name.replace(/\.md$/, ""), file))
  } catch (error) {
    // Mensagem do parser, já em português e já nomeando o campo.
    add("erro", file, (error as Error).message.replace(`${file}: `, ""))
  }
}

// ---------------------------------------------------------------------------
// Unicidade — o parser valida uma carta de cada vez e não enxerga as outras
// ---------------------------------------------------------------------------

function checkUnique(key: "slug" | "issue") {
  const seen = new Map<string, string>()
  for (const letter of letters) {
    const value = String(letter[key])
    const first = seen.get(value)
    if (first) {
      add(
        "erro",
        `content/cartas/${letter.slug}.md`,
        `${key} duplicado: "${value}" já é de ${first}.md.`,
        key === "slug"
          ? "Duas cartas disputando a mesma URL."
          : "Duas cartas com o mesmo número de edição."
      )
    }
    seen.set(value, letter.slug)
  }
}
checkUnique("slug")
checkUnique("issue")

// ---------------------------------------------------------------------------
// Checagens que dependem do disco e do texto
// ---------------------------------------------------------------------------

const slugs = new Set(letters.map((l) => l.slug))
const publishedSlugs = new Set(
  letters.filter((l) => l.status === "published").map((l) => l.slug)
)
const today = new Date().toISOString().slice(0, 10)

for (const letter of letters) {
  const file = `content/cartas/${letter.slug}.md`

  // --- imagens da frontmatter existem? -------------------------------------
  for (const which of ["cover", "thumb"] as const) {
    const cover = letter[which]
    if (!cover) continue
    const onDisk = path.join(PUBLIC_DIR, cover.src.replace(/^\//, ""))
    if (!fs.existsSync(onDisk)) {
      add(
        "erro",
        file,
        `${which}.src aponta para um arquivo que não existe: ${cover.src}`,
        "Confira a extensão — trocar .png por .jpg já aconteceu aqui."
      )
    }
    if (cover.alt.trim() === "") {
      add(
        "aviso",
        file,
        `${which}.alt está vazio.`,
        'Vazio significa "a imagem é decorativa". Se ela diz algo, descreva.'
      )
    }
  }

  // --- data no futuro ------------------------------------------------------
  if (letter.status === "published" && letter.date > today) {
    add(
      "aviso",
      file,
      `publicada com data no futuro (${letter.date}).`,
      "O site não agenda: ela vai ao ar no próximo deploy, mas aparece como a mais recente."
    )
  }
  if (letter.updated && letter.updated < letter.date) {
    add(
      "erro",
      file,
      `updated (${letter.updated}) é anterior a date (${letter.date}).`
    )
  }

  // --- o corpo -------------------------------------------------------------
  const lines = letter.body.split("\n")
  let inFence = false

  lines.forEach((line, i) => {
    const n = i + 1
    if (/^\s*```/.test(line)) inFence = !inFence
    if (inFence) return

    // "#" vira <h2> no render, mas a intenção quase sempre era "##".
    if (/^#\s+/.test(line)) {
      add(
        "aviso",
        file,
        `linha ${n}: título com "#".`,
        'A carta já tem um <h1> (o título). Use "##" para as seções.'
      )
    }
    // Pular de ## direto para #### não quebra nada, mas desorganiza a hierarquia.
    if (/^#{4,}\s+/.test(line)) {
      add(
        "aviso",
        file,
        `linha ${n}: título de nível 4 ou mais.`,
        "A carta usa ## e ###."
      )
    }
  })

  // --- assinatura de citação ----------------------------------------------
  // rehype-quote-cite só vira <cite> o ÚLTIMO PARÁGRAFO de um blockquote que
  // comece com travessão. Falhar aqui não dá erro nenhum: a linha simplesmente
  // é renderizada como texto comum, e ninguém percebe até abrir a página.
  for (const quote of blockquotesOf(letter.body)) {
    const content = quote.map((l) => l.replace(/^>\s?/, ""))
    const last = content.filter((l) => l.trim() !== "").at(-1)
    if (!last) continue

    const short = last.slice(0, 32) + (last.length > 32 ? "…" : "")

    // "--" o plugin aceita; um hífen sozinho vira item de lista.
    if (/^-\s/.test(last)) {
      add(
        "aviso",
        file,
        `a citação termina em "${short}", com hífen.`,
        "Só travessão (— ou --) vira <cite>. Com hífen a linha vira item de lista."
      )
      continue
    }

    // Parece assinatura, mas está colada no mesmo parágrafo da citação: o
    // plugin exige dois parágrafos, então ela não vai virar <cite>.
    const paragraphs = content.join("\n").split(/\n\s*\n/).length
    if (paragraphs < 2 && /^(—|–|--)/.test(last)) {
      add(
        "aviso",
        file,
        `a assinatura "${short}" está no mesmo parágrafo da citação.`,
        'Separe com uma linha ">" vazia, senão ela não vira <cite>.'
      )
    }
  }

  // --- links e imagens no corpo -------------------------------------------
  for (const [, , target] of letter.body.matchAll(
    /(!?)\[[^\]]*\]\(([^)\s]+)/g
  )) {
    if (/^(https?:|mailto:|#)/.test(target)) continue

    if (
      target.startsWith("/covers/") ||
      /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(target)
    ) {
      if (!fs.existsSync(path.join(PUBLIC_DIR, target.replace(/^\//, "")))) {
        add("erro", file, `imagem inexistente no texto: ${target}`)
      }
      continue
    }

    if (!target.startsWith("/")) {
      add(
        "aviso",
        file,
        `link relativo: ${target}`,
        "Use um caminho absoluto (/cartas/…) ou uma URL completa."
      )
      continue
    }

    const route = target.replace(/[#?].*$/, "").replace(/\/$/, "") || "/"
    if (STATIC_ROUTES.has(route)) continue

    const match = /^\/cartas\/([^/]+)$/.exec(route)
    if (!match || !slugs.has(match[1])) {
      add("erro", file, `link interno quebrado: ${target}`)
    } else if (letter.status === "published" && !publishedSlugs.has(match[1])) {
      add(
        "erro",
        file,
        `link para um rascunho: ${target}`,
        "Em produção esse link dá 404 — a carta de destino ainda não saiu."
      )
    }
  }
}

// ---------------------------------------------------------------------------
// Relatório
// ---------------------------------------------------------------------------

const c = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
}

const errors = findings.filter((f) => f.level === "erro")
const warnings = findings.filter((f) => f.level === "aviso")

console.log("")
if (findings.length) {
  const byFile = new Map<string, Finding[]>()
  for (const f of findings)
    byFile.set(f.file, [...(byFile.get(f.file) ?? []), f])

  for (const [file, list] of [...byFile].sort()) {
    console.log(c.bold(file))
    for (const f of list) {
      const tag = f.level === "erro" ? c.red("erro ") : c.yellow("aviso")
      console.log(`  ${tag}  ${f.message}`)
      if (f.hint) console.log(`         ${c.dim(f.hint)}`)
    }
    console.log("")
  }
}

const published = letters.filter((l) => l.status === "published")
const drafts = letters.filter((l) => l.status === "draft")

console.log(c.bold("No ar"))
for (const l of published.sort((a, b) => a.issue - b.issue)) {
  console.log(`  ${String(l.issue).padStart(3)}  ${l.date}  ${l.title}`)
}
if (!published.length) console.log(c.dim("  nenhuma"))

console.log("")
console.log(c.bold("Rascunhos") + c.dim("  (invisíveis em produção)"))
for (const l of drafts.sort((a, b) => a.issue - b.issue)) {
  console.log(`  ${String(l.issue).padStart(3)}  ${l.date}  ${l.title}`)
}
if (!drafts.length) console.log(c.dim("  nenhum"))

console.log("")
const summary = `${letters.length} carta(s) lida(s), ${errors.length} erro(s), ${warnings.length} aviso(s).`
console.log(
  errors.length
    ? c.red(summary)
    : warnings.length
      ? c.yellow(summary)
      : c.green(summary)
)

// Avisos não derrubam o comando: são coisas que podem estar certas de propósito.
process.exit(errors.length ? 1 : 0)
