import { cn } from "@/lib/utils"

/**
 * O símbolo da PRISMA, em negativo: um selo cheio, com a pena vazada nele.
 *
 * Não existem duas versões do arquivo, uma por tema. O selo é pintado com
 * `currentColor` e a arte com `var(--background)`, e esses dois tokens já
 * trocam de lugar entre os temas:
 *
 *     tema claro   fundo claro, texto escuro  ->  selo escuro, pena clara
 *     tema escuro  fundo escuro, texto claro  ->  selo claro,  pena escura
 *
 * Ou seja, o contraste é sempre contra a página, e sempre no sentido oposto ao
 * dela. É a mesma relação que `prisma-icon-black.svg` e `prisma-icon-white.svg`
 * guardam separados — aqui ela é derivada, não duplicada.
 *
 * O viewBox é o do arquivo, 256 cheios, e não o recorte justo da tinta: a
 * margem vazia em volta da pena é o respiro do selo, e é a mesma proporção do
 * favicon.
 *
 * O `rx` arredonda os cantos em 17% do lado — abaixo dos ~22% de um ícone de
 * app, que a esta altura leria como pastilha. O favicon segue de canto vivo,
 * porque o navegador já recorta o seu como quiser na aba e nos favoritos.
 *
 * A arte é pintada por classe (`fill-background`) e não por `fill="var(--…)"`:
 * variável CSS dentro de atributo de apresentação de SVG tem suporte irregular,
 * enquanto a classe vira declaração CSS de verdade. O selo pode ficar em
 * `currentColor` porque esse valor é parte do SVG desde sempre.
 */
function PrismaIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 256 256"
      aria-hidden="true"
      className={cn("size-7", className)}
      {...props}
    >
      <rect width="256" height="256" rx="44" fill="currentColor" />
      <g className="fill-background">
        <path
          fillRule="evenodd"
          d="M42.08 213.92Q86.25 135.41 115.12 50.08L200 56L205.92 140.88Q120.59 169.75 42.08 213.92ZM79.72 185.55Q124 128.6 133.75 56.28Q160.02 58.1 186.28 59.95Q179.39 101.52 191.99 141.74Q133.54 159.37 80.88 189.93Q77.31 190.4 79.72 185.55Z"
        />
        <path d="M73.78 180.24L119.25 134.77Q140.97 113.06 142.08 100.32A12.56 12.56 0 1 1 155.68 113.92Q142.94 115.03 121.23 136.75L75.76 182.22ZM153.61 100.42L189.68 64.34L191.66 66.32L155.58 102.39Z" />
      </g>
    </svg>
  )
}

export { PrismaIcon }
