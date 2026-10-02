import type { Element, Root } from "hast"
import { visit } from "unist-util-visit"

/**
 * Retags the attribution line of a blockquote from <p> to <cite>.
 *
 * Markdown has no way to say "this line is the source". The convention is the
 * one a printed page uses — the attribution is the last paragraph of the quote
 * and opens with an em dash:
 *
 *     > Tudo que precisava ser dito já foi dito.
 *     >
 *     > — André Gide
 *
 * IT RETAGS; IT NEVER REWRITES. The element's tagName changes and nothing else
 * does: no text is added, removed, trimmed or substituted, and the em dash
 * stays inside the <cite> because that is how the old block renderer printed it
 * ("— {cite}"). That property is the reason this is safe under the rule in
 * AGENTS.md that no machine edits a letter's prose — keep it true.
 *
 * Done in rehype rather than by inspecting React children because HAST is plain
 * data, while a blockquote's React children are whitespace strings and opaque
 * element objects that are miserable to match against.
 */

/** Em dash, en dash, or a typed double hyphen. */
const ATTRIBUTION = /^\s*(?:—|–|--)/

function textOf(node: Element): string {
  let out = ""
  visit(node, "text", (text) => {
    out += text.value
  })
  return out
}

export function rehypeQuoteCite() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "blockquote") return

      const paragraphs = node.children.filter(
        (child): child is Element =>
          child.type === "element" && child.tagName === "p"
      )

      // One paragraph only means the quote has no separate attribution — a
      // quote that happens to open with a dash is left alone.
      if (paragraphs.length < 2) return

      const last = paragraphs[paragraphs.length - 1]
      if (!ATTRIBUTION.test(textOf(last))) return

      last.tagName = "cite"
    })
  }
}
