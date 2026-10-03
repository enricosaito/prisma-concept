import { makeRouteHandler } from "@keystatic/next/route-handler"

import config from "@/keystatic.config"

/**
 * O que o editor usa para ler e gravar os arquivos.
 *
 * Em `storage: local` isto só funciona com o servidor de desenvolvimento
 * rodando na sua máquina — não há caminho para alguém de fora gravar nada.
 */
export const { POST, GET } = makeRouteHandler({ config })
