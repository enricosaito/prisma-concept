/**
 * Limits and checks for comment input.
 *
 * Plain functions with no browser APIs, so a server route can import the same
 * rules later. Until then they only shape the form: a check in the browser is
 * a courtesy to the reader, not a defence.
 */

export const COMMENT_MAX_LENGTH = 4000
export const NAME_MAX_LENGTH = 60

/** The counter only appears past this share of the limit. Below it, it is a
 *  number for a reader to watch instead of their own sentence. */
export const COUNTER_THRESHOLD = 0.8

export function validateBody(body: string): string | null {
  const text = body.trim()
  if (!text) return "Escreva algo antes de publicar."
  if (text.length > COMMENT_MAX_LENGTH)
    return `O comentário passou do limite de ${COMMENT_MAX_LENGTH.toLocaleString("pt-BR")} caracteres.`
  return null
}

export function validateName(name: string): string | null {
  const text = name.trim()
  if (!text) return "Diga como você quer assinar o comentário."
  if (text.length > NAME_MAX_LENGTH)
    return `Use até ${NAME_MAX_LENGTH} caracteres no nome.`
  return null
}
