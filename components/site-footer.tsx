import Link from "next/link"
import { RiInstagramLine, RiMailLine } from "@remixicon/react"

import { Wordmark } from "@/components/wordmark"
import { nav, site } from "@/lib/site"

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div className="max-w-xs">
          <div>
            <Wordmark className="font-heading text-xl font-medium tracking-[0.26em]" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {site.tagline}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <span className="font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
            Navegar
          </span>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <span className="font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
            Contato
          </span>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <RiInstagramLine className="size-4" />
            Instagram
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <RiMailLine className="size-4" />
            {site.email}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-10 sm:px-8">
        <p className="border-t border-border/60 pt-6 font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.name} — feito por {site.author}.
        </p>
      </div>
    </footer>
  )
}

export { SiteFooter }
