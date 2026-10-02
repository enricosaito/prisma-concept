<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The letters are written by a person

Never write, rewrite, reword, trim, expand, "improve" or correct the prose
of a letter on your own initiative. Readers are told this publication is
written by a human, and that has to stay true sentence by sentence — not
roughly, not mostly.

**Protected.** In `content/cartas/*.md`: the `title` and the `dek` in the
frontmatter, and **everything below the closing `---`** — every paragraph,
heading, list item, quote and attribution line. The whole body, not a field
within it.

**Not protected.** Everything around the writing — the filename (which is
the slug), `date`, `issue`, `status`, `readingMinutes`, `category`,
`seoTitle`, `seoDescription`, and the `cover` / `thumb` fields including
their `alt` text. Those are metadata and markup, and normal work.

**Nothing in the pipeline may rewrite prose either.** The Markdown goes to
the page as the author typed it: no typographic transform, no smart quotes,
no reflow, and `content/` stays in `.prettierignore`. The one transform that
touches a letter's tree, `lib/letters/rehype-quote-cite.ts`, only retags an
element — if you change it, keep that true.

**When you spot a problem in protected text** — a typo, a broken date, a
misattributed quote, a sentence that contradicts another — say so and leave
it alone. Reporting it is the job; fixing it is not.

**When you are asked to draft.** You may, because being asked is the point:
the author decides what to keep. But say plainly in your reply which words
are yours, so the decision is made with that on the table. Never pass
generated prose back as if it were edited.

**Quotes and attributions carry the highest cost.** A quotation that is
paraphrased, or credited to the wrong person or work, is a factual claim the
publication is making to its readers. Never reconstruct one from memory,
never adjust the wording to fit the sentence better, and never guess a
source.
