export const site = {
  name: "PRISMA",
  wordmark: "PRISMA",
  // Alimenta o título padrão das páginas, montado em app/(site)/layout.tsx.
  // Por morar aqui e não lá, trocar esta linha troca o título em todo lugar
  // que o derive.
  tagline: "Enxergue além",
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
 * The one emphasised action, rendered as the rainbow button in the header and
 * at the foot of the mobile sheet.
 *
 * Note this leaves /assinar with no link anywhere on the site — it still
 * resolves, and the subscribe forms on /cartas and on each letter still work,
 * but the page itself is now reachable only by typing the URL.
 */
export const navCta = { href: "/cartas", label: "Ler cartas" } as const
