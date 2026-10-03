import { notFound } from "next/navigation"

import { Editor } from "./editor"

/**
 * O editor só existe em desenvolvimento.
 *
 * Com `storage: local`, o Keystatic lê e grava o disco do servidor que o roda.
 * Isso só faz sentido quando esse disco é o seu repositório. Num deploy da
 * Vercel o disco é somente-leitura e é refeito a cada publicação, então o
 * editor não conseguiria ler nem gravar nada — e ficaria de pé, aberto, no
 * domínio público, que é como esta rota foi parar na internet.
 *
 * A checagem é por `development`, e não por "não é a Vercel", de propósito: ela
 * falha fechada. Qualquer ambiente que não seja o seu `npm run dev` não tem
 * editor. Se um dia o Keystatic passar para o modo GitHub — em que ele commita
 * de verdade e faz sentido publicado —, esta guarda sai junto com a troca.
 */
/**
 * Nada aqui é estático, e dizer isso evita um travamento.
 *
 * Sem esta linha o Next tenta analisar a rota para gerar caminhos estáticos —
 * o log mostra "Failed to generate static paths for /keystatic/[[...params]]" —
 * e para isso carrega o módulo da página num worker. Esse módulo puxa a
 * interface inteira do Keystatic, o worker morre, e tudo que chega na rota
 * vira 500 com "Jest worker encountered child process exceptions".
 */
export const dynamic = "force-dynamic"

/**
 * ⚠️ Um `NotFoundError` apontando para a linha do `<Editor />` abaixo quase
 * nunca vem desta guarda.
 *
 * O `@keystatic/core` tem um `notFound()` próprio, que lança uma classe
 * `NotFoundError` própria — é o que ele faz quando a entrada aberta não existe,
 * tipicamente uma carta apagada cuja URL ainda está na barra de endereços. O
 * Keystatic captura isso no error boundary dele, então o erro é recuperável.
 *
 * O Next não tem como saber disso e atribui o erro ao componente React mais
 * próximo que ele consegue nomear, que é esta página. O stack aponta para cá e
 * a causa está lá dentro. Antes de mexer na linha de baixo, confira se a
 * entrada que o editor tentou abrir ainda existe em `content/cartas/`.
 */
export default function Page() {
  if (process.env.NODE_ENV !== "development") notFound()
  return <Editor />
}
