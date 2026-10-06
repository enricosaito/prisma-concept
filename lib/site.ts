export const site = {
  name: "PRISMA",
  wordmark: "PRISMA",
  // Alimenta o título padrão das páginas, montado em app/(site)/layout.tsx.
  // Por morar aqui e não lá, trocar esta linha troca o título em todo lugar
  // que o derive.
  tagline: "Além do óbvio",
  description:
    "PRISMA é uma carta semanal onde nos aprofundamos sobre cultura, filosofia, tecnologia e arte — e o que acontece quando essas quatro coisas se atravessam.",
  signature: "Prisma Concept",
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
 * rótulo é "Assinar" e não "Inscrever-se" para falar a mesma palavra que o
 * botão do formulário, que sempre disse isso.
 */
export const navCta = { label: "Assinar" } as const
