function SiteFooter() {
  return (
    // No rule across the top — the footer just fades out under the content.
    <footer className="mt-24">
      <p className="mx-auto max-w-5xl px-5 py-10 text-center font-ui text-sm tracking-[0.14em] text-muted-foreground/45 sm:px-8">
        © {new Date().getFullYear()} The Prisma Concept
      </p>
    </footer>
  )
}

export { SiteFooter }
