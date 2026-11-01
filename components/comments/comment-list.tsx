"use client"

import { formatFull, formatRelative } from "@/lib/comments/format"
import type { Comment } from "@/lib/comments/types"

/**
 * Oldest first, the way a conversation is read. No avatars and no counters:
 * a name, when, and what they said, separated by the same hairline the
 * letter uses between sections.
 */
function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <ol className="divide-y divide-border border-t border-border">
      {comments.map((comment) => (
        <li key={comment.id} className="py-6">
          <article aria-labelledby={`comment-${comment.id}-author`}>
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3
                id={`comment-${comment.id}-author`}
                className="text-[0.9375rem] font-medium text-foreground"
              >
                {comment.authorName}
              </h3>
              {comment.sample ? (
                <span className="font-label text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Exemplo
                </span>
              ) : null}
              <time
                dateTime={comment.createdAt}
                title={formatFull(comment.createdAt)}
                className="font-label text-xs text-muted-foreground"
              >
                {formatRelative(comment.createdAt)}
              </time>
            </header>
            {/* `pre-line` keeps the reader's line breaks and paragraphs;
                `break-words` keeps a pasted URL from widening the page. */}
            <p className="mt-2 text-base leading-relaxed break-words whitespace-pre-line text-foreground/85 dark:text-foreground/92">
              {comment.body}
            </p>
          </article>
        </li>
      ))}
    </ol>
  )
}

export { CommentList }
