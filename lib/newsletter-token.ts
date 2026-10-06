import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * O token que identifica um assinante num link de descadastro.
 *
 * Existe para que o link não leve o endereço em claro. Sem assinatura, qualquer
 * um poderia descadastrar qualquer pessoa trocando o e-mail na URL — e links de
 * e-mail vazam: ficam no histórico do navegador, em encaminhamentos, nos logs de
 * quem clica.
 *
 * `NEWSLETTER_SECRET` é a chave, e deliberadamente NÃO é a do Resend: uma chave
 * por finalidade significa que vazar uma não compromete a outra, e que trocar a
 * do Resend não invalida todos os links já enviados.
 *
 * Sem o segredo configurado nada aqui funciona, e quem chama trata isso — o
 * e-mail cai para o descadastro por resposta em vez de quebrar.
 */

function secret(): string | null {
  return process.env.NEWSLETTER_SECRET?.trim() || null
}

/** Base64url: o que couber numa URL sem precisar de escape. */
function b64url(input: Buffer): string {
  return input.toString("base64url")
}

function sign(address: string, key: string): string {
  return b64url(createHmac("sha256", key).update(address).digest())
}

/** `<base64url do e-mail>.<assinatura>`, ou null se não houver segredo. */
export function tokenFor(address: string): string | null {
  const key = secret()
  if (!key) return null
  const normalizado = address.trim().toLowerCase()
  return `${b64url(Buffer.from(normalizado, "utf8"))}.${sign(normalizado, key)}`
}

/**
 * Devolve o endereço se o token for íntegro, e null em qualquer outro caso.
 *
 * A comparação é `timingSafeEqual` e não `===` porque comparar strings sai do
 * laço no primeiro byte diferente, e esse tempo conta quantos bytes iniciais
 * estavam certos — o suficiente para forjar uma assinatura byte a byte.
 */
export function addressFrom(token: string): string | null {
  const key = secret()
  if (!key) return null

  const ponto = token.lastIndexOf(".")
  if (ponto <= 0) return null

  const corpo = token.slice(0, ponto)
  const assinatura = token.slice(ponto + 1)

  let address: string
  try {
    address = Buffer.from(corpo, "base64url").toString("utf8")
  } catch {
    return null
  }
  if (!address.includes("@")) return null

  const esperada = Buffer.from(sign(address, key), "utf8")
  const recebida = Buffer.from(assinatura, "utf8")
  if (esperada.length !== recebida.length) return null
  if (!timingSafeEqual(esperada, recebida)) return null

  return address
}
