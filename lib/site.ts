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

/** Plain text links in the bar. */
export const nav = [{ href: "/", label: "Início" }] as const

/**
 * A única ação destacada, o botão do espectro no cabeçalho e no pé da gaveta
 * do mobile.
 *
 * Sem `href`: o botão abre o diálogo de assinatura (components/subscribe-dialog)
 * em vez de navegar. Era /cartas com o rótulo "Ler cartas"; com uma carta
 * publicada, o arquivo não tinha o que arquivar, e pedir assinatura vale mais
 * do que oferecer uma lista de um item.
 */
export const navCta = { label: "Inscrever-se" } as const
