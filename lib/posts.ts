export type Category = "Tecnologia" | "Arte" | "Design" | "Escrita"

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] }

export type Post = {
  /**
   * Issue number, shown as #001. Explicit rather than derived from sort order
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
  content: Block[]
}

export const posts: Post[] = [
  {
    issue: 3,
    slug: "o-que-um-prisma-faz-com-a-luz",
    title: "O que um prisma faz com a luz",
    dek: "Sobre separar o que parecia uma coisa só — e por que esta carta existe.",
    category: "Escrita",
    date: "2026-09-04",
    readingMinutes: 6,
    content: [
      {
        type: "p",
        text: "Um prisma não inventa cor nenhuma. A luz já chegava assim, carregando todas elas ao mesmo tempo, e o vidro apenas obriga cada uma a viajar num ângulo ligeiramente diferente. O que sai do outro lado não é mais informação — é a mesma informação, separada o suficiente para que você consiga olhar para uma parte de cada vez.",
      },
      {
        type: "p",
        text: "Durante muito tempo tratei tecnologia, arte, design e escrita como quatro assuntos diferentes, guardados em quatro gavetas diferentes. Era mentira. Eram sempre o mesmo feixe, e eu é que não tinha ângulo para separá-los.",
      },
      { type: "h2", text: "Por que uma carta e não um blog" },
      {
        type: "p",
        text: "Um blog é um lugar onde as coisas ficam. Uma carta é uma coisa que chega. A diferença parece pequena e não é: escrever sabendo que o texto vai aterrissar na caixa de entrada de alguém muda o tom, o tamanho e a honestidade do que se escreve.",
      },
      {
        type: "quote",
        text: "Escrever para ninguém em particular é a forma mais rápida de não dizer nada.",
      },
      {
        type: "p",
        text: "Então: quinzenal, um assunto por vez, sem calendário editorial fingindo que eu sei o que vou pensar daqui a três meses.",
      },
      { type: "h2", text: "O que esperar" },
      {
        type: "list",
        items: [
          "Ensaios curtos sobre ferramentas e o que elas fazem com quem as usa.",
          "Notas de processo — projetos em andamento, inclusive os que não deram certo.",
          "Recortes de coisas que li, vi ou ouvi e não consegui esquecer.",
        ],
      },
      {
        type: "p",
        text: "Se isso soa como algo que você gostaria de receber, assine. Se não, tudo bem — o arquivo fica aberto de qualquer jeito.",
      },
    ],
  },
  {
    issue: 2,
    slug: "copiar-ate-nao-parecer-copia",
    title: "Copiar até não parecer cópia",
    dek: "Sobre referência, plágio e a distância honesta entre os dois.",
    category: "Arte",
    date: "2026-07-24",
    readingMinutes: 7,
    content: [
      {
        type: "p",
        text: "Ninguém começa do zero. Todo trabalho que parece original é uma mistura tão densa de influências que as fontes deixaram de ser identificáveis individualmente. Isso não é um defeito do processo — é o processo.",
      },
      { type: "h2", text: "A diferença está no quê" },
      {
        type: "p",
        text: "Copiar o resultado é plágio. Copiar a decisão é aprendizado. Quando você olha para um trabalho que admira e pergunta o que foi resolvido ali — qual problema, com qual restrição — você leva embora algo que funciona em contextos que o original nunca visitou.",
      },
      {
        type: "quote",
        text: "Imite abertamente. Roube o problema, não a solução.",
      },
      {
        type: "p",
        text: "O sintoma de que você copiou bem é conseguir explicar por que cada escolha está ali. Se a única justificativa é que a referência fazia assim, você copiou a superfície.",
      },
    ],
  },
  {
    issue: 1,
    slug: "escrever-e-descobrir-o-que-voce-pensa",
    title: "Escrever é descobrir o que você pensa",
    dek: "Você não escreve o que pensa. Você descobre pensando por escrito — e quase sempre é outra coisa.",
    category: "Escrita",
    date: "2026-07-10",
    readingMinutes: 6,
    content: [
      {
        type: "p",
        text: "A imagem popular do escritor é a de alguém que já tem a ideia pronta e só precisa transcrevê-la. Na prática é o contrário: a ideia na cabeça é vaga, cheia de buracos escondidos por atalhos que só funcionam porque ninguém pediu para detalhar.",
      },
      {
        type: "p",
        text: "A frase escrita não aceita atalho. Ela obriga ordem, obriga sujeito e verbo, obriga que uma coisa venha antes da outra. É nesse aperto que você descobre que metade do que achava que pensava era só uma sensação bem-arrumada.",
      },
      { type: "h2", text: "Por isso o primeiro rascunho é ruim" },
      {
        type: "p",
        text: "Ele é ruim porque não é o texto — é a ferramenta que você usou para achar o texto. Julgá-lo pelos padrões do resultado final é como reclamar que o andaime está feio.",
      },
      {
        type: "p",
        text: "Escreva o rascunho ruim rápido e sem carinho. O trabalho de verdade começa quando você já sabe o que estava tentando dizer.",
      },
    ],
  },
]

/** Oldest first: the library reads #001 upward. */
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

/** Compact form for tight spots like card grids: "21 ago 2026". */
export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(iso))
    .replace(/\./g, "")
}

/** Issue number as it is shown: 1 -> "#001". */
export function formatIssue(issue: number): string {
  return "#" + String(issue).padStart(3, "0")
}
