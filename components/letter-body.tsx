import type { Components } from "react-markdown"
import Markdown from "react-markdown"

import { rehypeQuoteCite } from "@/lib/letters/rehype-quote-cite"

/**
 * Renders a letter's Markdown.
 *
 * Almost nothing is overridden, and that is the design: Markdown's output *is*
 * the tag set `.prose-letter` already styles in globals.css — p, h2, h3,
 * blockquote, a, ul. The look of a letter is still one class in one stylesheet,
 * not a component map, so this file can be swapped for a different renderer (or
 * a CMS's own body format) without touching the typography.
 *
 * This runs on the server. `react-markdown` is a plain function component with
 * no state, so none of it reaches the browser — the client gets HTML.
 *
 * Raw HTML in the source is NOT enabled (no rehype-raw), and no typographic
 * transform is installed: a letter renders the characters its author typed.
 */

const components: Components = {
  /**
   * A "# " in a body would be a second <h1> — the page already owns the first,
   * which is the letter's title. Demoting keeps the heading hierarchy honest
   * instead of making the author remember. Sections are "## " either way.
   */
  // `node` is react-markdown's HAST node. It is handed to every override and is
  // not a DOM attribute, so it has to come off before the rest is spread —
  // otherwise it renders as node="[object Object]" in the HTML.
  h1: ({ node, children, ...props }) => {
    void node
    return <h2 {...props}>{children}</h2>
  },

  /**
   * Classes lifted verbatim from the block renderer this replaces, so the
   * attribution line under a quote is byte-identical to what shipped before.
   * `rehypeQuoteCite` is what produces the element; see that file for why it
   * retags rather than rewrites.
   */
  cite: ({ node, children, ...props }) => {
    void node
    return (
      <cite
        {...props}
        className="mt-2 block font-label text-xs font-medium tracking-wide text-muted-foreground not-italic"
      >
        {children}
      </cite>
    )
  },

  /**
   * next/image needs intrinsic dimensions that Markdown has no way to carry, so
   * an in-body image is a plain lazy <img>. The image that matters — the
   * cover — goes through LetterCover and next/image, which is unaffected.
   *
   * A Markdown title, `![alt](src "a legenda")`, becomes the caption.
   */
  img: ({ src, alt, title }) =>
    typeof src === "string" ? (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className="w-full rounded-xl border border-border"
        />
        {title ? <figcaption>{title}</figcaption> : null}
      </figure>
    ) : null,
}

function LetterBody({ markdown }: { markdown: string }) {
  return (
    <div className="prose-letter">
      <Markdown components={components} rehypePlugins={[rehypeQuoteCite]}>
        {markdown}
      </Markdown>
    </div>
  )
}

export { LetterBody }
