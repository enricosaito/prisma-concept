"use client"

import { Signature } from "@/components/signature"
import { cn } from "@/lib/utils"

/**
 * "Prisma Concept" hand-signed at the foot of the site, in place of the
 * wordmark.
 *
 * `Signature` traces a font's real outlines with opentype.js, so it needs the
 * font *file* in /public — a CSS webfont will not do. Without
 * `LastoriaBoldRegular.otf` it renders the `fallback` below instead of an
 * empty SVG. See also [[sign-off]], which signs each letter.
 */
function FooterSignature({ className }: { className?: string }) {
  return (
    <div className={cn("text-foreground", className)}>
      <Signature
        text="Prisma Concept"
        color="currentColor"
        fontSize={44}
        duration={1.4}
        inView
        className="h-14 w-auto"
        fallback={
          <p className="font-heading text-2xl italic">Prisma Concept</p>
        }
      />
    </div>
  )
}

export { FooterSignature }
