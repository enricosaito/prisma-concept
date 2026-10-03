import { collection, config, fields } from "@keystatic/core"

/**
 * O editor das cartas.
 *
 * O Keystatic não é um CMS no sentido de guardar o conteúdo em outro lugar: ele
 * é uma interface sobre os arquivos que já existem. Os mesmos
 * `content/cartas/<slug>.md`, a mesma frontmatter, o mesmo Markdown. Editar
 * pelo navegador e editar no editor de texto são a mesma coisa, e nada no site
 * precisou saber que ele existe.
 *
 * É por isso que ele foi escolhido no lugar de um CMS hospedado: a prosa
 * continua sendo um arquivo seu, versionado no git frase por frase, que é a
 * propriedade em que a regra do AGENTS.md se apoia.
 */

const CATEGORIES = [
  { label: "Tecnologia", value: "Tecnologia" },
  { label: "Arte", value: "Arte" },
  { label: "Design", value: "Design" },
  { label: "Escrita", value: "Escrita" },
] as const

/**
 * Uma imagem de capa: o caminho e a descrição, exatamente como a frontmatter já
 * guarda. `fields.image` cuida do upload — arrastar um arquivo no editor grava
 * em `public/covers/` e escreve o caminho aqui.
 */
const coverField = (label: string, description: string) =>
  fields.object(
    {
      /**
       * O caminho, como texto — não `fields.image`.
       *
       * O campo de imagem do Keystatic quer gerir o arquivo ele mesmo e não
       * reconheceu os caminhos que a frontmatter já guardava: lia vazio, e
       * salvar teria apagado as capas das cartas existentes. Como texto, o
       * caminho vai e volta exatamente como está escrito.
       *
       * O custo é não arrastar um arquivo aqui dentro: capas novas entram em
       * `public/covers/` e o caminho se escreve à mão. Para arte preparada
       * fora, em 3:5, isso é praticamente o fluxo de qualquer jeito.
       */
      src: fields.text({
        label: "Arquivo",
        description: 'Caminho dentro de public/, como "/covers/minha-capa.jpg".',
        validation: { isRequired: true },
      }),
      alt: fields.text({
        label: "Descrição",
        description:
          "O que a imagem mostra, para quem não pode vê-la. Vazio significa decorativa.",
        multiline: true,
      }),
      // Os dois campos opcionais que o tipo Cover já tinha. Precisam estar aqui
      // mesmo quando quase nunca são usados: o Keystatic valida a frontmatter
      // inteira, e uma chave que ele não conhece impede a carta de abrir.
      position: fields.text({
        label: "Enquadramento",
        description: 'object-position, como "top" ou "50% 30%". Vazio centraliza.',
      }),
      ratio: fields.text({
        label: "Proporção",
        description: 'CSS aspect-ratio, como "3 / 5". Vazio usa 3 / 2.',
      }),
    },
    { label, description }
  )

export default config({
  /**
   * O editor fala com o repositório pela API do GitHub, não com o disco.
   *
   * É o que faz o Save virar um commit: você escreve de qualquer navegador, o
   * Keystatic commita no seu lugar, e a Vercel publica. A etapa de
   * `git commit` à mão deixa de existir.
   *
   * Vale igual em desenvolvimento e em produção, de propósito. O modo local
   * seria mais rápido no `npm run dev`, mas aí o Save faria coisas diferentes
   * conforme onde você abriu o editor, e a etapa manual que queríamos eliminar
   * voltaria pela porta dos fundos.
   *
   * Editar os arquivos à mão continua funcionando — e continua sendo o caminho
   * quando você estiver sem rede.
   */
  storage: {
    kind: "github",
    repo: { owner: "enricosaito", name: "prisma-concept" },
  },

  ui: {
    brand: { name: "PRISMA" },
    navigation: { Publicação: ["cartas"] },
  },

  collections: {
    cartas: collection({
      label: "Cartas",
      path: "content/cartas/*",
      // O nome do arquivo é o slug, como sempre foi. O título vai para a
      // frontmatter; a URL sai do nome do arquivo.
      slugField: "title",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "date"],

      schema: {
        title: fields.slug({
          name: { label: "Título", validation: { isRequired: true } },
          slug: {
            label: "URL",
            description: "Vira /cartas/isto. Depois de publicada, mudar quebra links.",
          },
        }),

        status: fields.select({
          label: "Situação",
          description: "Rascunho não existe para o site publicado.",
          options: [
            { label: "Rascunho", value: "draft" },
            { label: "Publicada", value: "published" },
          ],
          defaultValue: "draft",
        }),

        issue: fields.integer({
          label: "Número da edição",
          description:
            "Aparece antes do resumo nas listagens e escolhe a cor da carta no espectro.",
          validation: { isRequired: true, min: 1 },
        }),

        date: fields.date({
          label: "Data da carta",
          description: "Ordena o arquivo e aparece sob o título. Não agenda nada.",
          validation: { isRequired: true },
        }),

        category: fields.select({
          label: "Categoria",
          options: [...CATEGORIES],
          defaultValue: "Escrita",
        }),

        readingMinutes: fields.integer({
          label: "Minutos de leitura",
          validation: { isRequired: true, min: 1 },
        }),

        dek: fields.text({
          label: "Resumo",
          description: "A linha que aparece sob o título nas listagens.",
          multiline: true,
          validation: { isRequired: true },
        }),

        cover: coverField("Capa", "Abre a carta. Fica bem em 3:2."),
        thumb: coverField(
          "Capa das listagens",
          "Para arte em pé. A proporção da casa é 3:5. Sem isto, usa a capa."
        ),

        updated: fields.date({
          label: "Revisada em",
          description: "Só quando você revisa uma carta já publicada.",
        }),

        seoTitle: fields.text({
          label: "Título no Google",
          description: "Só quando o título ficaria longo demais num resultado de busca.",
        }),
        seoDescription: fields.text({
          label: "Descrição no Google",
          multiline: true,
        }),

        /**
         * O texto. Vai abaixo da frontmatter, como Markdown, do mesmo jeito que
         * já está escrito hoje.
         *
         * As opções ligadas são exatamente o que `.prose-letter` sabe desenhar.
         * Tabela, código e divisória ficam desligados de propósito: o site não
         * tem estilo para eles, e um editor que oferece o que a página não
         * desenha é uma armadilha.
         */
        content: fields.markdoc({
          label: "Texto",
          extension: "md",
          options: {
            heading: [2, 3],
            bold: true,
            italic: true,
            link: true,
            blockquote: true,
            orderedList: true,
            unorderedList: true,
            image: { directory: "public/covers", publicPath: "/covers/" },
            code: false,
            codeBlock: false,
            divider: false,
            table: false,
            strikethrough: false,
          },
        }),
      },
    }),
  },
})
