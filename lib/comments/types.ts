/**
 * The comment model, shaped for the real backend it will eventually live in
 * rather than for the browser-storage prototype that holds it today.
 *
 * `essayId` is the letter's slug — the same key the routes, the sitemap and
 * the content files already use, so comments follow a letter wherever it goes.
 */
export type Comment = {
  id: string
  essayId: string
  /** The verified account behind the comment. `null` until there is real
   *  authentication: the prototype has names, not identities. */
  authorId: string | null
  authorName: string
  body: string
  /** ISO 8601. */
  createdAt: string
  /** For replies, later. Always `null` today: there is no reply UI. */
  parentCommentId: string | null
  /** A sample comment shipped with the prototype, never a reader's. Rendered
   *  with a visible "exemplo" so it cannot pass as a real one. */
  sample?: boolean
}

/** What the composer hands over to be published. */
export type NewComment = Pick<Comment, "essayId" | "body" | "parentCommentId">

/**
 * The person commenting, as far as the comment section needs to know.
 *
 * `verified` is the line the real system will draw: a reader a provider has
 * vouched for. Nothing in the prototype ever sets it to `true`.
 */
export type Reader = {
  id: string
  name: string
  verified: boolean
}

/**
 * Where comments are read from and written to. The section only talks to this
 * interface, so swapping the browser-storage prototype for an API client is a
 * change to one file.
 *
 * A real `create` runs on the server, which takes the author from the session
 * — never from the request body — and validates the text again there.
 */
export interface CommentStore {
  list(essayId: string): Promise<Comment[]>
  create(input: NewComment, author: Reader): Promise<Comment>
}
