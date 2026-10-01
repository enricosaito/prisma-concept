"use client"

import { usePathname } from "next/navigation"

import { Signature } from "@/components/signature"
import { site } from "@/lib/site"

/** A letter's own URL: /cartas/<slug>, but not the /cartas archive above it. */
const LETTER_ROUTE = /^\/cartas\/[^/]+$/

function SiteFooter() {
  const pathname = usePathname()

  // A letter already closes with the signature, set large and at full contrast
  // under "Até a próxima". Repeating it a few hundred pixels lower reads as a
  // page that does not know it has finished, so the footer there is the
  // copyright line and nothing else.
  const afterALetter = LETTER_ROUTE.test(pathname)

  return (
    // No rule across the top — the footer just fades out under the content.
    <footer className="mt-16 sm:mt-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-10 sm:px-8">
        {afterALetter ? null : (
          /* Drawn once when the footer scrolls into view. It takes the column's
             width up to 23rem, so it shrinks with the gutters on a narrow phone
             rather than running past them. */
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
        )}

        <p className="text-center font-label text-sm font-medium tracking-[0.16em] text-muted-foreground/45 uppercase">
          © {new Date().getFullYear()} The Prisma Concept.
        </p>
      </div>
    </footer>
  )
}

export { SiteFooter }
