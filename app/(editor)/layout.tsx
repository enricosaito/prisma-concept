import type { Metadata } from "next"

/**
 * A raiz do editor.
 *
 * O Keystatic monta a interface inteira dele e precisa de um documento próprio
 * — dentro do layout do site ele renderizava literalmente nada. Por isso o app
 * tem duas raízes, via grupos de rota: `(site)` para a PRISMA e `(editor)` para
 * esta tela. Grupos de rota não aparecem na URL, então nenhum endereço mudou.
 *
 * De propósito, este arquivo NÃO importa `globals.css`: as cores, a tipografia
 * e o reset da PRISMA são para as cartas, e aplicá-los por cima do Keystatic só
 * faria os dois brigarem. O editor traz o visual dele.
 */
export const metadata: Metadata = {
  title: "Editor — PRISMA",
  // Nada aqui tem por que ser indexado, e esta rota nem existe em produção.
  robots: { index: false, follow: false },
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
