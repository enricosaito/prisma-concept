import type { NextRequest } from "next/server"

import { makeRouteHandler } from "@keystatic/next/route-handler"

import config from "@/keystatic.config"

/**
 * O que o editor usa para ler e gravar, e também o que faz o login do GitHub.
 *
 * Além de ler e commitar, este handler serve as rotas de OAuth que o Keystatic
 * precisa — `github/login`, `github/oauth/callback`, `github/created-app`,
 * `github/refresh-token`. É por isso que o editor não precisou de nenhum
 * sistema de autenticação nosso: quem autentica é o GitHub, e quem autoriza é
 * a sua permissão de escrita neste repositório.
 */

export const dynamic = "force-dynamic"

const VARIAVEIS = [
  "KEYSTATIC_GITHUB_CLIENT_ID",
  "KEYSTATIC_GITHUB_CLIENT_SECRET",
  "KEYSTATIC_SECRET",
] as const

/**
 * O handler é criado na primeira requisição, não quando o módulo carrega.
 *
 * `makeRouteHandler` lança se faltar alguma credencial do GitHub, e no escopo
 * do módulo isso derruba o `next build` inteiro — "Failed to collect page data"
 * — mesmo que ninguém vá usar o editor naquele deploy. Sem variáveis
 * configuradas, o site não compilaria.
 *
 * Adiando a criação, um deploy sem as variáveis publica normalmente e só o
 * editor fica fora do ar, com uma mensagem que diz o que falta. O editor acende
 * sozinho quando as variáveis existirem, sem precisar de outro commit.
 */
let handlers: ReturnType<typeof makeRouteHandler> | undefined

function obterHandlers() {
  if (!handlers) handlers = makeRouteHandler({ config })
  return handlers
}

function faltando() {
  // Em desenvolvimento nada é exigido: é por aqui que passa o fluxo que cria o
  // GitHub App (`github/created-app`), e exigir as credenciais para poder
  // configurá-las seria circular.
  if (process.env.NODE_ENV === "development") return []
  return VARIAVEIS.filter((nome) => !process.env[nome])
}

function naoConfigurado() {
  return Response.json(
    {
      erro: "O editor ainda não está configurado.",
      faltando: faltando(),
      comoResolver:
        "Crie o GitHub App e preencha estas variáveis — em .env.local para rodar local, e nas Environment Variables da Vercel para o editor publicado. Passo a passo em docs/editor.md.",
    },
    { status: 503 }
  )
}

export async function GET(request: NextRequest) {
  if (faltando().length) return naoConfigurado()
  return obterHandlers().GET(request)
}

export async function POST(request: NextRequest) {
  if (faltando().length) return naoConfigurado()
  return obterHandlers().POST(request)
}
