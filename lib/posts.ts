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
  {
    issue: 1,
    slug: "tudo-que-precisava-ser-dito-ja-foi-dito",
    title:
      "Tudo que precisava ser dito já foi dito, mas ninguém estava ouvindo",
    dek: "Nada é completamente original — e por que essa deveria ser a melhor notícia do seu dia.",
    category: "Arte",
    date: "2026-06-26",
    readingMinutes: 5,
    content: [
      {
        type: "p",
        text: "Li essa frase pela primeira vez em Roube como um artista: 10 coisas que ninguém te conta sobre criatividade, do Austin Kleon. Ela não é dele. Kleon pega emprestado de André Gide, que escreveu algo muito parecido em 1891 — o que, para uma frase sobre originalidade, é provavelmente a coisa mais honesta que ela poderia fazer.",
      },
      {
        type: "quote",
        text: "Tudo que precisava ser dito já foi dito. Mas, como ninguém estava ouvindo, é preciso dizer tudo de novo.",
        cite: "André Gide, citado por Austin Kleon em Roube como um artista",
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
      { type: "h2", text: "Por que isso é uma boa notícia" },
      {
        type: "p",
        text: "Se tudo que precisava ser dito já foi dito, mas ninguém estava ouvindo, então tudo precisa ser dito de novo. Algumas pessoas acham essa ideia deprimente. A mim ela enche de esperança.",
      },
      {
        type: "p",
        text: "Porque ela devolve o trabalho ao tamanho certo. Livres do peso de tentar ser totalmente originais, podemos parar de tentar criar algo do nada e passar a abraçar as influências, em vez de fugir delas. O que sobra não é menos: é a sua versão, dita com a sua voz, para quem ainda não estava ouvindo.",
      },
      {
        type: "p",
        text: "Ninguém está esperando uma cor nova. Está esperando o seu ângulo.",
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
