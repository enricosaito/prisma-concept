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
  featured?: boolean
  content: Block[]
}

export const posts: Post[] = [
  {
    issue: 5,
    slug: "o-que-um-prisma-faz-com-a-luz",
    title: "O que um prisma faz com a luz",
    dek: "Sobre separar o que parecia uma coisa só — e por que esta carta existe.",
    category: "Escrita",
    date: "2026-09-04",
    readingMinutes: 6,
    featured: true,
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
    issue: 4,
    slug: "ferramentas-que-pensam-por-voce",
    title: "Ferramentas que pensam por você",
    dek: "Toda ferramenta tem uma opinião embutida. A questão é se você percebeu qual é.",
    category: "Tecnologia",
    date: "2026-08-21",
    readingMinutes: 8,
    content: [
      {
        type: "p",
        text: "Existe uma ilusão confortável de que ferramentas são neutras — que um editor de texto é apenas um editor de texto, que um software de design apenas desenha o que você mandou. Nenhuma ferramenta é neutra. Cada uma torna certas coisas triviais e outras insuportáveis, e é nessa diferença que ela decide o que você vai acabar fazendo.",
      },
      { type: "h2", text: "O caminho de menor resistência é uma opinião" },
      {
        type: "p",
        text: "Quando um programa coloca um recurso a um clique de distância e esconde outro em três submenus, ele não está sendo prático. Está dizendo qual dos dois considera normal. Multiplique isso por milhares de decisões e você tem uma estética inteira produzida por padrões de interface.",
      },
      {
        type: "quote",
        text: "Nós moldamos nossas ferramentas, e depois nossas ferramentas nos moldam de volta.",
        cite: "atribuído a John Culkin",
      },
      { type: "h2", text: "O exercício" },
      {
        type: "p",
        text: "Pegue a ferramenta que você mais usa e liste três coisas que ela torna fáceis e três que ela torna difíceis. Depois pergunte quantas dessas dificuldades você passou a chamar de preferência pessoal.",
      },
      {
        type: "p",
        text: "Não é um argumento para trocar de ferramenta. É um argumento para saber de quem é a opinião que você está executando.",
      },
    ],
  },
  {
    issue: 3,
    slug: "o-espaco-em-branco-nao-e-sobra",
    title: "O espaço em branco não é sobra",
    dek: "Quase todo layout ruim que já vi tinha o mesmo problema: medo de deixar espaço.",
    category: "Design",
    date: "2026-08-07",
    readingMinutes: 5,
    content: [
      {
        type: "p",
        text: "Espaço em branco é a única coisa num layout que todo mundo concorda em cortar primeiro e ninguém sabe explicar por quê. A intuição é que espaço vazio é espaço desperdiçado, e que preencher é aproveitar.",
      },
      {
        type: "p",
        text: "Mas o espaço é o que diz ao olho o que pertence a quê. Dois elementos próximos são lidos como uma coisa; afastados, como duas. Você não está escolhendo entre cheio e vazio — está escolhendo quantos assuntos a página tem.",
      },
      { type: "h2", text: "Agrupar antes de decorar" },
      {
        type: "list",
        items: [
          "Se dois blocos estão relacionados, aproxime-os mais do que qualquer outra coisa na página.",
          "Se não estão, afaste-os até que a separação seja óbvia sem uma linha divisória.",
          "Só depois disso considere bordas, cores de fundo e caixas.",
        ],
      },
      {
        type: "p",
        text: "Boa parte das bordas que existem no mundo são pedidos de desculpa por espaçamento mal resolvido.",
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

const byDateDesc = (a: Post, b: Post) => b.date.localeCompare(a.date)

export function getAllPosts(): Post[] {
  return [...posts].sort(byDateDesc)
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function getFeaturedPost(): Post {
  const all = getAllPosts()
  return all.find((post) => post.featured) ?? all[0]
}

/** Posts after the featured one, newest first. */
export function getRecentPosts(limit?: number): Post[] {
  const featured = getFeaturedPost()
  const rest = getAllPosts().filter((post) => post.slug !== featured.slug)
  return typeof limit === "number" ? rest.slice(0, limit) : rest
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
