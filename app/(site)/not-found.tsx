import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Página não encontrada",
  // A 404 has nothing to offer an index, and Next already serves it with a 404
  // status — this just stops a crawler that followed a bad link from keeping it.
  robots: { index: false, follow: true },
}

/**
 * Replaces Next's unstyled default, which until now was what a reader got for
 * a mistyped slug: black-on-white system type in the middle of a dark site.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-start px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
      <p className="font-label text-[0.7rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        Erro 404
      </p>
      <h1 className="mt-5 font-heading text-4xl leading-tight font-medium text-balance sm:text-5xl">
        Esta página não existe.
      </h1>
      <p className="mt-5 max-w-prose text-lg leading-relaxed text-pretty text-muted-foreground">
        Pode ter sido um endereço digitado errado, ou uma carta que ainda não
        saiu.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-accent underline-offset-4 transition-colors outline-none hover:text-accent focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
