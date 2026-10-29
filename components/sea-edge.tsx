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
 *
 * `flip` vira a onda de cabeça para baixo, para pendurá-la embaixo de um bloco
 * azul em vez de pousá-la em cima de um — é como a barra termina.
 */
function SeaEdge({ flip, className }: { flip?: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "dark oxford sea-edge -mb-px h-4 bg-background sm:h-6",
        flip && "-scale-y-100",
        className
      )}
    />
  )
}

export { SeaEdge }
