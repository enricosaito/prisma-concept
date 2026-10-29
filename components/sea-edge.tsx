import { cn } from "@/lib/utils"

/**
 * A linha d'água: onde o papel termina e o mar do fim da página começa.
 *
 * Uma faixa no azul Oxford recortada em onda por uma máscara (`.sea-edge` em
 * globals.css), posta logo acima de um bloco `dark oxford`. Acima da onda
 * aparece o fundo da página; abaixo, a faixa encosta no azul do bloco, e a
 * página entra no mar por uma onda em vez de uma régua.
 *
 * A máscara se repete com período fixo, e não esticada pela largura: uma onda
 * esticada ficava larga no desktop e espremida no celular.
 *
 * O `-mb-px` faz o bloco de baixo cobrir o último pixel da onda. A junta cai
 * em fração de pixel (o texto acima dá alturas como 549.25px), e sem a
 * sobreposição o antisserrilhado deixava um fio de papel entre os dois azuis.
 */
function SeaEdge({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "dark oxford sea-edge -mb-px h-3 bg-background sm:h-4",
        className
      )}
    />
  )
}

export { SeaEdge }
