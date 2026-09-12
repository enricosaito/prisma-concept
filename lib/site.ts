export const site = {
  name: "PRISMA",
  wordmark: "PRISMA",
  tagline: "Novas perspectivas",
  description:
    "PRISMA CONCEPT é uma carta quinzenal sobre cultura, filosofia, tecnologia e arte — e sobre o que acontece quando essas quatro coisas se atravessam.",
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

export const nav = [
  { href: "/", label: "Início" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/assinar", label: "Assinar" },
] as const
