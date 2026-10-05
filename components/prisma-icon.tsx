import { cn } from "@/lib/utils"

/**
 * O símbolo da PRISMA: a pena vista como um prisma, em traço cheio.
 *
 * Mesma arte do favicon — `public/icons/svg/prisma-icon-white-transparent.svg`
 * —, com uma diferença que é o motivo deste arquivo existir: ali o preenchimento
 * é `#EFEAE0` fixo, e aqui é `currentColor`. Na barra isso importa, porque o
 * símbolo precisa virar escuro no tema claro junto com o resto do texto, em vez
 * de desaparecer no fundo.
 *
 * Sem fundo próprio, de propósito: ele se apoia no vidro da barra. O retângulo
 * escuro da variante opaca é para o favicon, onde não há fundo em que se apoiar.
 */
function PrismaIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-7", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M42.08 213.92Q86.25 135.41 115.12 50.08L200 56L205.92 140.88Q120.59 169.75 42.08 213.92ZM79.72 185.55Q124 128.6 133.75 56.28Q160.02 58.1 186.28 59.95Q179.39 101.52 191.99 141.74Q133.54 159.37 80.88 189.93Q77.31 190.4 79.72 185.55Z"
      />
      <path d="M73.78 180.24L119.25 134.77Q140.97 113.06 142.08 100.32A12.56 12.56 0 1 1 155.68 113.92Q142.94 115.03 121.23 136.75L75.76 182.22ZM153.61 100.42L189.68 64.34L191.66 66.32L155.58 102.39Z" />
    </svg>
  )
}

export { PrismaIcon }
