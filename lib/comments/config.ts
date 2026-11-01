/**
 * Whether the comment section renders.
 *
 * Off in production unless `NEXT_PUBLIC_COMMENTS_PROTOTYPE=1`. The prototype
 * keeps comments in each reader's own browser, so on the live site a reader
 * would "publish" something nobody else can see — and believe otherwise.
 * It stays on in development and can be switched on for a preview deploy;
 * it goes on for everyone once a real store and real sign-in are behind it.
 */
export const commentsEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_COMMENTS_PROTOTYPE === "1"
