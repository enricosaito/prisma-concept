"use client"

import { Signature } from "@/components/signature"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Hand-signed sign-off at the foot of each letter.
 *
 * `Signature` traces a real font's outlines with opentype.js, so it needs the
 * font file itself in /public — a webfont/CSS family will not do. Drop
 * `LastoriaBoldRegular.otf` (or any .otf/.ttf, via `fontSrc`) there and the
 * stroke animation turns on; until then the `fallback` below renders instead.
 */
function SignOff({ className }: { className?: string }) {
  return (
    <div className={cn("border-t border-border/70 pt-8", className)}>
      <p className="font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
        Até a próxima
      </p>
      <div className="mt-2 text-foreground">
        <Signature
          text={site.signature}
          // The component's default looks at the public root; the file lives
          // under /fonts alongside the display faces.
          fontSrc="/fonts/LastoriaBoldRegular.otf"
          color="currentColor"
          fontSize={52}
          duration={1.2}
          inView
          // Full column width, capped at the 32rem that keeps it from
          // outgrowing the 42rem reading measure. It scales down with the
          // column on phones instead of being clipped by it.
          className="max-w-[32rem]"
          fallback={
            <p className="font-heading text-3xl italic">{site.signature}</p>
          }
        />
      </div>
    </div>
  )
}

export { SignOff }
