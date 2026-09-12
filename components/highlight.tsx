import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { cn } from "@/lib/utils"

/**
 * Accent words in headings — the bronze-italic emphasis, now sweeping.
 *
 * Magic UI's defaults are a neon orange→purple; these are the same muted
 * spectrum the wordmark disperses, so a highlight reads as the same light
 * being split rather than as a second, louder accent.
 */
function Highlight({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <AnimatedGradientText
      colorFrom="#b89062"
      colorTo="#6f8a9c"
      speed={0.6}
      className={cn("italic", className)}
    >
      {children}
    </AnimatedGradientText>
  )
}

export { Highlight }
