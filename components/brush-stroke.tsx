import { cn } from "@/lib/utils"

/**
 * Uma pincelada só, atrás do título inteiro, desenhada no hover da carta.
 * Substituiu o sublinhado de 1px, que sumia ao lado de um título de 36px.
 *
 * Uma, e não uma por linha: atravessa o bloco na diagonal, subindo da
 * esquerda para a direita, como uma mão passando o pincel — não acompanha as
 * linhas do texto. Por isso é um SVG solto atrás do título, e não um fundo
 * do <span>: o fundo se repetiria em cada linha.
 *
 * O desenho é o traço correndo (`stroke-dashoffset`, com `pathLength` 1), e
 * a ponta redonda vai na frente, como o pincel puxado. Esticado à caixa, o
 * traço engrossa com a altura do título: um de duas linhas leva uma pincelada
 * mais larga que um de uma.
 *
 * Vai dentro de um pai `relative isolate` e de um `.group`, cujo hover a
 * dispara.
 */
function BrushStroke({ className }: { className?: string }) {
  const draw = cn(
    "transition-[stroke-dashoffset] duration-700 ease-snappy [stroke-dasharray:1] [stroke-dashoffset:1]",
    "group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]",
    "motion-reduce:transition-none"
  )

  return (
    <svg
      aria-hidden
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      fill="none"
      strokeLinecap="round"
      className={cn(
        "pointer-events-none absolute -inset-x-3 inset-y-0 -z-10 h-full w-[calc(100%+1.5rem)] text-accent",
        className
      )}
    >
      {/* O corpo da pincelada. */}
      <path
        d="M12 78C90 74 160 62 230 50S350 30 388 24"
        pathLength={1}
        stroke="currentColor"
        strokeOpacity={0.16}
        strokeWidth={56}
        className={draw}
      />
      {/* As cerdas: dois fios mais finos dentro do corpo, um pouco
          desencontrados, para que a tinta não leia como faixa chapada. */}
      <path
        d="M22 64C100 60 170 50 236 38S352 20 382 14"
        pathLength={1}
        stroke="currentColor"
        strokeOpacity={0.08}
        strokeWidth={12}
        className={cn(draw, "delay-75")}
      />
      <path
        d="M20 94C98 90 168 78 240 66S350 46 380 40"
        pathLength={1}
        stroke="currentColor"
        strokeOpacity={0.07}
        strokeWidth={10}
        className={cn(draw, "delay-100")}
      />
    </svg>
  )
}

export { BrushStroke }
