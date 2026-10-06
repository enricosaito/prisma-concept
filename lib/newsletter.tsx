import { Resend, type ErrorResponse } from "resend"

import { WelcomeEmail } from "@/emails/welcome"
import { tokenFor } from "@/lib/newsletter-token"
import { site } from "@/lib/site"

/**
 * The list itself: adding a reader to Resend and welcoming them.
 *
 * Everything Resend-shaped lives here so `app/api/subscribe/route.ts` stays a
 * thin HTTP wrapper, and so a second entry point (an import script, a form
 * action) can reuse the same rules rather than re-deriving them.
 */

/**
 * Resend's `error` objects serialise to `{}` through most structured loggers,
 * which turns a real failure into a blank line in production. Spell the fields
 * out so the log says what actually went wrong.
 */
function logResendError(what: string, error: ErrorResponse): void {
  console.error(
    `[subscribe] ${what}: ${error.name} (${error.statusCode ?? "no status"}) — ${error.message}`
  )
}

/**
 * Resend renamed Audiences to Segments. Both ids are accepted so this keeps
 * working either side of that migration; the segment API is preferred when
 * both are present.
 */
function listConfig() {
  const segmentId = process.env.RESEND_SEGMENT_ID?.trim()
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim()

  if (segmentId) return { kind: "segment" as const, id: segmentId }
  if (audienceId) return { kind: "audience" as const, id: audienceId }
  return null
}

/** Built per call: the key is read at request time, not at module load. */
function resendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  return apiKey ? new Resend(apiKey) : null
}

function fromAddress(): string {
  return process.env.RESEND_FROM?.trim() || `${site.signature} <${site.email}>`
}

/**
 * O link de descadastro de um clique, ou null se faltar `NEWSLETTER_SECRET`.
 *
 * Sem ele o e-mail sai sem `List-Unsubscribe-Post` e com o endereço de
 * resposta como única saída — funciona, mas perde o sinal de confiança que o
 * Gmail lê. Melhor degradar do que falhar o envio.
 */
function unsubscribeUrl(address: string): string | null {
  const token = tokenFor(address)
  if (!token) return null
  return `${site.url}/api/unsubscribe?t=${encodeURIComponent(token)}`
}

export type SubscribeOutcome =
  /** Added to the list, welcome sent. */
  | { ok: true; state: "subscribed" }
  /** Was on the list already — no second welcome. */
  | { ok: true; state: "already" }
  /** Had unsubscribed before and is back. */
  | { ok: true; state: "resubscribed" }
  /** No Resend credentials in this environment; the address went nowhere. */
  | { ok: true; state: "unconfigured" }
  | { ok: false; state: "error"; reason: string }

/**
 * Idempotent by design: a reader who submits the form twice is told they are
 * already in rather than being welcomed twice.
 */
export async function subscribe(rawEmail: string): Promise<SubscribeOutcome> {
  const address = rawEmail.trim().toLowerCase()
  const resend = resendClient()
  const list = listConfig()

  if (!resend || !list) {
    // Local dev without keys still exercises the whole form flow.
    console.info("[subscribe] Resend not configured; not stored:", address)
    return { ok: true, state: "unconfigured" }
  }

  // Scoping the lookup to a legacy audience is required; segments are
  // account-wide, so the email alone identifies the contact.
  const lookup =
    list.kind === "audience"
      ? { email: address, audienceId: list.id }
      : { email: address }

  try {
    const existing = await resend.contacts.get(lookup)

    if (existing.data && !existing.data.unsubscribed) {
      return { ok: true, state: "already" }
    }

    if (existing.data?.unsubscribed) {
      const revived = await resend.contacts.update({
        ...lookup,
        unsubscribed: false,
      })

      if (revived.error) {
        logResendError("resubscribe failed", revived.error)
        return { ok: false, state: "error", reason: revived.error.message }
      }

      await sendWelcome(resend, address)
      return { ok: true, state: "resubscribed" }
    }

    // `contacts.get` 404s for an unknown address, which is the normal path.
    const created =
      list.kind === "audience"
        ? await resend.contacts.create({
            audienceId: list.id,
            email: address,
            unsubscribed: false,
          })
        : await resend.contacts.create({
            email: address,
            unsubscribed: false,
            segments: [{ id: list.id }],
          })

    if (created.error) {
      logResendError("contact create failed", created.error)
      return { ok: false, state: "error", reason: created.error.message }
    }

    await sendWelcome(resend, address)
    return { ok: true, state: "subscribed" }
  } catch (error) {
    console.error("[subscribe] unexpected Resend failure:", error)
    return { ok: false, state: "error", reason: "network" }
  }
}

/**
 * Nunca falha a inscrição. O leitor está na lista de todo jeito, e dizer o
 * contrário só o faria enviar o formulário de novo.
 */
async function sendWelcome(resend: Resend, address: string): Promise<void> {
  const saida = unsubscribeUrl(address)

  /**
   * Os cabeçalhos de descadastro, em duas camadas.
   *
   * O `mailto:` sempre vai, porque funciona em qualquer cliente e porque uma
   * resposta chega a uma pessoa. O `https:` e o `List-Unsubscribe-Post` só vão
   * quando há segredo para assinar o token: juntos, eles são o que faz o Gmail
   * e o Outlook mostrarem o botão "cancelar inscrição" ao lado do remetente
   * (RFC 8058). Sem esse botão, a saída que o leitor encontra é o botão de
   * spam — e essa marca fica no domínio, não no e-mail.
   */
  const headers: Record<string, string> = {
    "List-Unsubscribe": saida
      ? `<${saida}>, <mailto:${site.email}?subject=unsubscribe>`
      : `<mailto:${site.email}?subject=unsubscribe>`,
  }
  if (saida) headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"

  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: address,
      replyTo: site.email,
      // O assunto mora aqui e não no template, porque quem o lê é a caixa de
      // entrada e não o corpo da mensagem.
      subject: "você é incrível",
      react: (
        <WelcomeEmail url={site.url} unsubscribeUrl={saida ?? undefined} />
      ),
      // A versão em texto puro não é cortesia: um e-mail só-HTML pontua pior em
      // todo filtro de spam, porque é o formato de quem manda em massa sem se
      // dar o trabalho. Ela também é o que alguns leitores realmente mostram.
      text: welcomeText(saida),
      headers,
    })

    if (error) {
      logResendError("welcome email failed", error)
    }
  } catch (error) {
    console.error("[subscribe] welcome email threw:", error)
  }
}

/**
 * O mesmo e-mail em texto puro.
 *
 * Escrito à mão, e não extraído do JSX, porque o que serve numa tela de HTML
 * não serve aqui: sem botão, o link precisa estar escrito; sem régua, a
 * separação é uma linha em branco.
 */
function welcomeText(saida: string | null): string {
  const linhas = [
    "Você está na lista.",
    "",
    "Obrigado por assinar. Toda semana chega aqui uma carta sobre um",
    "assunto só — virado devagar, até aparecer o que sempre esteve junto.",
    "",
    "Não é um resumo de notícias e não é uma lista. É um texto, escrito para ser",
    "lido em menos de dez minutos, sobre cultura, filosofia, tecnologia e arte —",
    "sempre pelo que essas coisas têm em comum, não pelo que as separa.",
    "",
    `Enquanto a próxima não sai, tudo o que já saiu continua aberto: ${site.url}`,
    "",
    "—",
    site.signature,
    "",
    `Você recebeu este e-mail porque assinou a ${site.signature} em ${site.url}.`,
  ]

  if (saida) linhas.push(`Para sair da lista: ${saida}`)

  return linhas.join("\n")
}

/**
 * Marca o contato como descadastrado. Usado pela rota de um clique.
 *
 * Não apaga o contato: o Resend precisa guardar quem pediu para sair, senão um
 * reenvio futuro incluiria essa pessoa de novo. Sem credenciais, só registra —
 * quem chama responde 200 de todo jeito, porque o leitor não tem o que fazer
 * com um erro nosso.
 */
export async function unsubscribe(rawEmail: string): Promise<void> {
  const address = rawEmail.trim().toLowerCase()
  const resend = resendClient()
  const list = listConfig()

  if (!resend || !list) {
    console.info("[unsubscribe] Resend not configured; not stored:", address)
    return
  }

  const lookup =
    list.kind === "audience"
      ? { email: address, audienceId: list.id }
      : { email: address }

  try {
    const { error } = await resend.contacts.update({
      ...lookup,
      unsubscribed: true,
    })
    if (error) logResendError("unsubscribe failed", error)
  } catch (error) {
    console.error("[unsubscribe] unexpected Resend failure:", error)
  }
}
