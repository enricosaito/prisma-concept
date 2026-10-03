"use client"

import { useEffect } from "react"

/**
 * The error boundary for everything under the root layout. Must be a client
 * component — that is the convention, not a choice.
 *
 * The site is almost entirely prerendered, so the realistic way a reader lands
 * here is a transient failure in the subscribe form's route. `reset()` retries
 * the segment without a full page load, which is usually enough.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Vercel collects this; the digest is what ties it to the server log, since
    // the message itself is redacted in production.
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-start px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
      <p className="font-label text-[0.7rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        Algo quebrou
      </p>
      <h1 className="mt-5 font-heading text-4xl leading-tight font-medium text-balance sm:text-5xl">
        Não foi possível carregar esta página.
      </h1>
      <p className="mt-5 max-w-prose text-lg leading-relaxed text-pretty text-muted-foreground">
        O erro é nosso, não seu. Tente de novo — se insistir, volte daqui a
        pouco.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground underline decoration-accent underline-offset-4 transition-colors outline-none hover:text-accent focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Tentar de novo
      </button>
      {error.digest ? (
        <p className="mt-6 font-label text-[0.65rem] tracking-[0.16em] text-muted-foreground/60 uppercase">
          Referência {error.digest}
        </p>
      ) : null}
    </div>
  )
}
