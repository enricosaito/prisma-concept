export const site = {
  name: "PRISMA",
  wordmark: "PRISMA",
  // Alimenta o título padrão das páginas, montado em app/(site)/layout.tsx.
  // Por morar aqui e não lá, trocar esta linha troca o título em todo lugar
  // que o derive.
  // É o lema, abaixo: um só bordão para a marca.
  tagline: "Aponte contra um mar de problemas",
  description:
    "PRISMA é uma carta semanal onde nos aprofundamos sobre cultura, filosofia, tecnologia e arte — e o que acontece quando essas quatro coisas se atravessam.",
  signature: "Prisma Concept",
  // O lema, nas palavras do autor. É a versão dele do "to take arms against
  // a sea of troubles" do Hamlet, em português e com "aponte" no lugar de
  // "arms" — então não é citação e não leva crédito, e não deve ser
  // "corrigida" para uma tradução do Shakespeare.
  motto: "Aponte contra um mar de problemas",
  // The canonical host, with the `www.` — the apex 308s here, and this feeds
  // `metadataBase`, the OG tags and the link in the welcome email. The bare
  // `prismaconcept.com` that used to sit here belongs to someone else.
  url: "https://www.prismaconcept.com.br",
  instagram: "https://instagram.com/theprismaconcept",
  instagramHandle: "@theprismaconcept",
  // Not shown anywhere on the site: this is the address the welcome email
  // replies to and unsubscribes go to, and the sender when `RESEND_FROM` is
  // unset. It has to be on a domain verified in Resend.
  email: "carta@prismaconcept.com.br",
} as const

/**
 * A única ação da barra, e desde que o link "Início" saiu, a única coisa
 * clicável nela além do nome e do símbolo.
 *
 * Sem `href`: o botão abre o diálogo de assinatura em vez de navegar. O
 * rótulo diz o que o botão oferece, "Newsletter"; o verbo "Assinar" fica
 * para o botão do formulário, dentro do diálogo.
 */
export const navCta = { label: "Newsletter" } as const
