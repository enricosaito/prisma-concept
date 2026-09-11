import { cn } from "@/lib/utils"

/**
 * The brand glyph: one beam entering a triangle, three beams leaving it.
 * Drawn with currentColor for the prism and the accent token for the spectrum.
 */
function PrismMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-6", className)}
      {...props}
    >
      <path
        d="M13 3.5 21.5 19H4.5L13 3.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M1 12.5h8.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <g stroke="var(--accent)" strokeWidth="1.25" strokeLinecap="round">
        <path d="M17 12.5h13" opacity="0.9" />
        <path d="M17 9h11" opacity="0.6" />
        <path d="M17 16h11" opacity="0.6" />
      </g>
    </svg>
  )
}

export { PrismMark }
