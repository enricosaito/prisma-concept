function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70">
      <p className="mx-auto max-w-5xl px-5 py-8 text-center font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} The Prisma Concept
      </p>
    </footer>
  )
}

export { SiteFooter }
