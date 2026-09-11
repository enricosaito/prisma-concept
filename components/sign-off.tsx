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
          text={site.author}
          color="currentColor"
          fontSize={52}
          duration={1.2}
          inView
          className="h-16 w-auto"
          fallback={
            <p className="font-heading text-3xl italic">{site.author}</p>
          }
        />
      </div>
    </div>
  )
}

export { SignOff }
