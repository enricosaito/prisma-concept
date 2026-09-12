import { RiInstagramLine } from "@remixicon/react"

import { Signature } from "@/components/signature"
import { site } from "@/lib/site"

function SiteFooter() {
  return (
    // No rule across the top — the footer just fades out under the content.
    <footer className="mt-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-10 sm:px-8">
        <a
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          // The icon alone is the link, so it carries the handle as its
          // accessible name rather than a bare "Instagram".
          aria-label={`${site.instagramHandle} no Instagram`}
          className="rounded-sm p-1 text-muted-foreground/45 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <RiInstagramLine className="size-5" />
        </a>

        {/* Drawn once when the footer scrolls into view. It takes the column's
            width up to 23rem, so it shrinks with the gutters on a narrow phone
            rather than running past them. */}
        <Signature
          text={site.signature}
          fontSrc="/fonts/LastoriaBoldRegular.otf"
          color="currentColor"
          fontSize={40}
          duration={1.4}
          inView
          className="max-w-[23rem] text-muted-foreground/45"
          fallback={
            <p className="font-heading text-2xl text-muted-foreground/45 italic">
              {site.signature}
            </p>
          }
        />

        <p className="text-center font-ui text-sm tracking-[0.16em] text-muted-foreground/45 uppercase">
          © {new Date().getFullYear()} The Prisma Concept.
        </p>
      </div>
    </footer>
  )
}

export { SiteFooter }
