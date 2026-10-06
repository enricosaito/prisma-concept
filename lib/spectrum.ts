/**
 * O espectro disperso — frio, de prata a ametista.
 *
 * Era quente, de bronze a azul-aço. A troca acompanha o accent, que deixou de
 * ser bronze: um degradê dourado ao lado de uma seta prateada lia como duas
 * paletas na mesma página.
 *
 * A luminosidade é a MESMA nas cinco, e isso é o ponto. Um prisma dispersa por
 * matiz, não por brilho — a rampa antiga variava os dois, e as bandas claras
 * (o ouro em 2.10:1) sumiam contra o papel. Aqui a matiz sobe de 240 a 292 e o
 * croma abre de 0.008 a 0.045, enquanto a luminosidade fica em 0.604. Luz
 * branca que vai se abrindo em cor, que é a figura que o nome da publicação
 * promete.
 *
 * Todas as cinco entregam entre 3.62:1 e 3.67:1 contra o papel claro e perto
 * de 4.85:1 contra o escuro. A rampa antiga ia de 2.10 a 3.38 no claro, e o
 * Highlight usa as pontas como TEXTO.
 *
 * Estes cinco também são espelhados como `--color-1..5` em `app/globals.css`,
 * nos dois temas. Mantenha as duas listas em sincronia.
 */
export const SPECTRUM = [
  "#7d8286", // 1 prata
  "#7a828c", // 2 névoa
  "#798193", // 3 ardósia
  "#7c7f98", // 4 violeta
  "#817d9b", // 5 ametista
] as const

/**
 * Each issue takes the next band of the spectrum, so a grid of letters reads
 * as one beam split across them rather than as a column of identical copper.
 * Cycles every five.
 */
export function issueColor(issue: number): string {
  const band =
    (((issue - 1) % SPECTRUM.length) + SPECTRUM.length) % SPECTRUM.length
  return `var(--color-${band + 1})`
}
