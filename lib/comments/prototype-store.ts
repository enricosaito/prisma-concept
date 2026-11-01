import type { Comment, CommentStore, NewComment, Reader } from "./types"

/**
 * PROTÓTIPO. Comentários guardados no localStorage do próprio leitor.
 *
 * Não é um banco de dados: o que um leitor publica só existe no navegador
 * dele, ninguém mais vê, e qualquer um pode editar ou apagar pelo console.
 * Serve para demonstrar a seção enquanto não há backend. A troca é escrever
 * outro `CommentStore` (um cliente de API) e passá-lo para CommentSection.
 */

const KEY_PREFIX = "prisma:prototype-comments:v1:"

/** A short pause, so the loading and sending states are visible in the demo
 *  the way they will be over a network. */
const LATENCY_MS = 350

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function read(essayId: string): Comment[] {
  const raw = window.localStorage.getItem(KEY_PREFIX + essayId)
  if (!raw) return []
  const parsed: unknown = JSON.parse(raw)
  return Array.isArray(parsed) ? (parsed as Comment[]) : []
}

/**
 * Amostras para ver a lista povoada, só com `?comentarios=exemplo` na URL.
 * Sem o parâmetro a seção mostra o que de fato existe — de início, nada, e o
 * estado vazio. Cada uma vem marcada como `sample` e aparece com "exemplo"
 * ao lado do nome: são texto de demonstração, não leitores.
 */
function samples(essayId: string): Comment[] {
  if (
    new URLSearchParams(window.location.search).get("comentarios") !== "exemplo"
  )
    return []

  const hoursAgo = (h: number) =>
    new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
  const sample = (
    n: number,
    authorName: string,
    body: string,
    createdAt: string
  ): Comment => ({
    id: `sample-${n}`,
    essayId,
    authorId: null,
    authorName,
    body,
    createdAt,
    parentCommentId: null,
    sample: true,
  })

  return [
    sample(
      1,
      "Leitora de exemplo",
      "Um comentário de demonstração, para mostrar como um texto de dois ou três períodos se assenta na coluna.\n\nE como um segundo parágrafo, separado por uma linha em branco, aparece logo abaixo.",
      hoursAgo(26)
    ),
    sample(
      2,
      "Leitor de exemplo",
      "Outro comentário de demonstração, mais curto.",
      hoursAgo(3)
    ),
  ]
}

const prototypeStore: CommentStore = {
  async list(essayId) {
    await wait(LATENCY_MS)
    return [...samples(essayId), ...read(essayId)]
  },

  async create(input: NewComment, author: Reader) {
    await wait(LATENCY_MS)
    const comment: Comment = {
      id: crypto.randomUUID(),
      essayId: input.essayId,
      // A real server takes this from the session. The prototype has no
      // identity to give, only the name typed in the simulated sign-in.
      authorId: author.verified ? author.id : null,
      authorName: author.name,
      body: input.body.trim(),
      createdAt: new Date().toISOString(),
      parentCommentId: input.parentCommentId,
    }
    const all = read(input.essayId)
    window.localStorage.setItem(
      KEY_PREFIX + input.essayId,
      JSON.stringify([...all, comment])
    )
    return comment
  },
}

export { prototypeStore }
