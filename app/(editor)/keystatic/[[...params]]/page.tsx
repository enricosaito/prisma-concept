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
export default function Page() {
  if (process.env.NODE_ENV !== "development") notFound()
  return <Editor />
}
