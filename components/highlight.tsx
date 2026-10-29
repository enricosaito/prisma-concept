import { cn } from "@/lib/utils"

/**
 * Accent words in headings: italic, in the sea-blue accent, and still.
 *
 * This used to be an AnimatedGradientText sweeping through the spectrum. A
 * word that keeps moving reads as playful, which is the opposite of what the
 * publication wants to project — trust, seriousness — so the emphasis now
 * comes from the italic and the colour alone.
 */
function Highlight({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <em className={cn("text-accent italic", className)}>{children}</em>
}

export { Highlight }
