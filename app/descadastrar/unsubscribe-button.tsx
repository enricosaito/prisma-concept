"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

/**
 * O botão que dá o POST. Cliente porque precisa de estado para não repetir o
 * envio e para dizer o que aconteceu sem recarregar a página.
 */
function UnsubscribeButton({ token }: { token: string }) {
  const [estado, setEstado] = React.useState<"parado" | "enviando" | "pronto">(
    "parado"
  )

  if (estado === "pronto") {
    return (
      <p className="mt-8 rounded-[10px] border border-accent/40 bg-accent/10 px-4 py-3.5 text-sm">
        Pronto. Você saiu da lista.
      </p>
    )
  }

  return (
    <Button
      size="lg"
      className="mt-8"
      disabled={estado === "enviando"}
      onClick={async () => {
        setEstado("enviando")
        try {
          await fetch(`/api/unsubscribe?t=${encodeURIComponent(token)}`, {
            method: "POST",
          })
        } catch {
          // A rota responde 200 mesmo quando não consegue dar baixa, e aqui um
          // erro de rede não tem o que oferecer ao leitor além de um botão que
          // ele já clicou. Dizer "pronto" e registrar do lado do servidor é
          // menos pior do que pedir que ele tente de novo sem saber se já foi.
        }
        setEstado("pronto")
      }}
    >
      {estado === "enviando" ? "Cancelando…" : "Cancelar a inscrição"}
    </Button>
  )
}

export { UnsubscribeButton }
