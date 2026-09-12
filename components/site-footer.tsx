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

        {/* Drawn once when the footer scrolls into view. h-16 keeps it inside
            the 320px a 360px screen leaves after the gutters — at this
            signature's 4.58 aspect ratio, h-20 would be 366px and overflow. */}
        <Signature
          text={site.signature}
          fontSrc="/fonts/LastoriaBoldRegular.otf"
          color="currentColor"
          fontSize={40}
          duration={1.4}
          inView
          className="h-16 w-auto text-muted-foreground/45 sm:h-20"
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
