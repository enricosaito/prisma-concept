export type Category = "Tecnologia" | "Arte" | "Design" | "Escrita"

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] }

/**
 * Cover image for a letter. `src` is a path under /public, so next/image can
 * optimise it at build time — a remote URL would also need a matching entry in
 * `images.remotePatterns` in next.config.ts.
 *
 * It is rendered with `fill` inside a fixed 3:2 box rather than at its
 * intrinsic size, so one asset serves both the card and the article header
 * without either being locked to the file's own proportions. Crop to taste with
 * `position` when the subject is not centred.
 */
export type Cover = {
  src: string
  /**
   * What the image shows, for someone who cannot see it. Use "" only when the
   * image is purely decorative and the title already carries the meaning.
   */
  alt: string
  /** object-position, e.g. "top" or "50% 30%". Defaults to centre. */
  position?: string
  /**
   * CSS aspect-ratio for the box, e.g. "655 / 1080". Defaults to 3 / 2.
   *
   * Give it the file's own dimensions when the image must not be cropped at
   * all — a bordered card or anything with text near an edge. Give it a
   * rounder ratio when you would rather the crop absorb differences between
   * one letter's art and the next.
   */
  ratio?: string
}

export type Post = {
  /**
   * Issue number, shown bare as 1. Explicit rather than derived from sort order
   * so inserting an older letter never renumbers the ones already published.
   */
  issue: number
  slug: string
  title: string
  /** One-line standfirst shown under the title in listings. */
  dek: string
  category: Category
  /** ISO date, used for sorting and for the <time> element. */
  date: string
  readingMinutes: number
  /** Runs at the head of the letter itself. Without one it goes text-only. */
  cover?: Cover
  /**
   * Shown where the letter is listed instead of `cover`, for art that suits a
   * narrow upright slot better than a wide one. Falls back to `cover`.
   */
  thumb?: Cover
  content: Block[]
}

export const posts: Post[] = [
  {
    issue: 1,
    slug: "tudo-que-precisava-ser-dito-ja-foi-dito",
    title:
      "Tudo que precisava ser dito já foi dito, mas ninguém estava ouvindo",
    dek: "Nada é completamente original — e por que essa deveria ser a melhor notícia do seu dia.",
    category: "Arte",
    date: "2026-10-01",
    readingMinutes: 5,
    cover: {
      src: "/covers/tudo-que-precisava-ser-dito-ja-foi-dito.jpg",
      alt: "Pintura modernista: uma mulher de maiô aponta para o alto enquanto um zepelim, um veleiro e um farol dividem a cena com cardumes, maquinário industrial e o corte de um submarino.",
    },
    thumb: {
      src: "/covers/thefool-fullsize.jpg",
      // 3:5 is the house standard for a letter's cover, and this file is cut to
      // it exactly (639x1065), so nothing is shaved off the card's printed
      // border or the words along its foot. Keep new covers at 3:5 — 1080x1800
      // is the master size — and this stays a constant rather than a per-letter
      // measurement.
      ratio: "3 / 5",
      alt: "A carta O Louco, do tarô, em preto e branco gasto: uma figura de capa caminha para a beira de um penhasco com um cachorro saltando aos seus pés, sob um céu carregado. Ao pé da carta, as palavras THE FOOL.",
    },
    content: [
      {
        type: "p",
        text: "Seja bem-vindo, leitor! Gostaria de começar agradecendo pelo voto de confiança. Esta é a primeira carta que publico, e muito inspirada pela leitura de um livro que irei comentar sobre brevemente.",
      },
      {
        type: "quote",
        text: "Tudo que precisava ser dito já foi dito. Mas, como ninguém estava ouvindo, é preciso dizer tudo de novo.",
        cite: "André Gide",
      },
      { type: "h2", text: "Nada vem do nada" },
      {
        type: "p",
        text: "A ideia por trás dela é simples e um pouco desconfortável: nada é completamente original. Todo trabalho criativo é construído em cima do que veio antes. Não existe página em branco absoluta — existe uma pilha de coisas que você leu, viu e ouviu, e um recorte seu feito em cima dela.",
      },
      {
        type: "p",
        text: "Isso não é uma descoberta moderna, nem um sintoma da internet. Está no Eclesiastes, alguns milhares de anos antes de qualquer discussão sobre plágio em rede social:",
      },
      {
        type: "quote",
        text: "Não há nada novo debaixo do sol.",
        cite: "Eclesiastes 1:9",
      },
      { type: "h2", text: "Quando alguém diz que algo é original" },
      {
        type: "p",
        text: "Repare no que costuma acontecer quando chamam alguma coisa de original: nove em cada dez vezes, quem diz isso apenas não conhece a referência. Não viu a fonte, não sabe de onde aquilo saiu, não reconhece a linhagem. Originalidade, na prática, é muitas vezes o nome que damos a uma influência que não identificamos.",
      },
      { type: "h2", text: "O que acontece a partir de agora" },
      {
        type: "p",
        text: "Se tudo que precisava ser dito já foi dito, mas ninguém estava ouvindo, então tudo precisa ser dito novamente. Algumas pessoas acham essa ideia deprimente. A mim ela enche de esperança.",
      },
      {
        type: "p",
        text: "Porque ela devolve o trabalho ao tamanho certo. Livres do peso de tentar ser totalmente originais, podemos parar de tentar criar algo do nada e passar a abraçar as influências, em vez de fugir delas.",
      },
      {
        type: "p",
        text: "A melhor hora pra começar é agora.",
      },
    ],
  },
]

/** Oldest first: the library reads from issue 1 upward. */
const byDateAsc = (a: Post, b: Post) => a.date.localeCompare(b.date)

export function getAllPosts(): Post[] {
  return [...posts].sort(byDateAsc)
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso))
}

/**
 * Compact form for listings: "21 ago, 2026", which the UI sets in caps.
 *
 * Assembled from parts rather than taking pt-BR's own short format, which
 * renders "21 de ago. de 2026" — two "de"s and an abbreviating point, all of
 * them noise at this size. The comma does the separating instead.
 */
export function formatDateShort(iso: string): string {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(new Date(iso))

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ""

  return `${part("day")} ${part("month").replace(".", "")}, ${part("year")}`
}

/** Issue number as it is shown: plain, unpadded — 1 -> "1". */
export function formatIssue(issue: number): string {
  return String(issue)
}
