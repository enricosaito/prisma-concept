import { addressFrom } from "@/lib/newsletter-token"
import { unsubscribe } from "@/lib/newsletter"

/**
 * O descadastro de um clique, do jeito que o Gmail e o Outlook esperam.
 *
 * O cabeçalho `List-Unsubscribe-Post` (RFC 8058) faz o próprio cliente de
 * e-mail dar um POST aqui quando o leitor usa o botão "cancelar inscrição" que
 * aparece ao lado do remetente. Ninguém abre página, ninguém confirma nada — e é
 * exatamente por isso que o Gmail trata quem oferece isso como remetente sério.
 *
 * A alternativa é o leitor não achar a saída e usar o botão de spam, que custa
 * reputação do domínio e afeta a entrega para todos os outros assinantes.
 *
 * O GET não descadastra ninguém. Pré-carregadores de link, antivírus de e-mail e
 * o próprio Gmail buscam URLs de mensagens para inspecioná-las; se o GET
 * mudasse estado, metade da lista cairia fora sem ninguém ter clicado. Ele
 * manda para a página que pede a confirmação.
 */

export const dynamic = "force-dynamic"

function tokenDe(request: Request): string | null {
  return new URL(request.url).searchParams.get("t")
}

export async function POST(request: Request): Promise<Response> {
  const token = tokenDe(request)
  const address = token ? addressFrom(token) : null

  // 200 mesmo sem token válido, de propósito: o cliente de e-mail mostra o erro
  // ao leitor, e um token velho ou já usado não é problema que ele possa
  // resolver. O que importa é que a baixa aconteça quando o token presta.
  if (!address) return new Response("ok", { status: 200 })

  await unsubscribe(address)
  return new Response("ok", { status: 200 })
}

export async function GET(request: Request): Promise<Response> {
  const token = tokenDe(request)
  const destino = new URL("/descadastrar", request.url)
  if (token) destino.searchParams.set("t", token)
  return Response.redirect(destino, 303)
}
