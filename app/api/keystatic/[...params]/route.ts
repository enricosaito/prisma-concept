import { makeRouteHandler } from "@keystatic/next/route-handler"

import config from "@/keystatic.config"

/**
 * O que o editor usa para ler e gravar os arquivos — e, pela mesma razão que a
 * página, só em desenvolvimento.
 *
 * Esta é a metade que importa: a página é só interface, enquanto esta rota é a
 * que toca o disco. Num deploy ela não teria o que ler, mas também não tem por
 * que existir, então responde 404 como qualquer endereço que não existe.
 */
/** Pelo mesmo motivo da página: nada a gerar estaticamente aqui. */
export const dynamic = "force-dynamic"

const handlers = makeRouteHandler({ config })

const disabled = () => new Response("Not Found", { status: 404 })

const ativo = process.env.NODE_ENV === "development"

export const GET = ativo ? handlers.GET : disabled
export const POST = ativo ? handlers.POST : disabled
