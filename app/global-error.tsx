"use client"

import { useEffect } from "react"

/**
 * O último recurso: o que aparece quando o próprio layout raiz quebra.
 *
 * Ele SUBSTITUI o layout, e não é renderizado dentro dele — por isso precisa
 * trazer o próprio <html> e <body>. Também é a razão de o estilo estar embutido
 * aqui em vez de vir do globals.css: se a falha foi no layout, assumir que a
 * folha de estilo e as fontes carregaram é assumir justamente o que acabou de
 * não funcionar.
 *
 * Existe porque sem ele o Next mostra a sua própria página, em inglês — "500:
 * This page couldn't load" — num site que é inteiro em português. É raro, e é
 * exatamente no momento raro que a régua aparece.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 1.5rem",
          backgroundColor: "#f5f1e8",
          color: "#0e1624",
          fontFamily: "ui-serif, Georgia, 'Times New Roman', Times, serif",
          lineHeight: 1.6,
        }}
      >
        <title>Algo quebrou — PRISMA</title>
        {/* O tema escuro por media query: sem o layout, não há a classe .dark
            que o next-themes aplicaria. */}
        <style>{`
          @media (prefers-color-scheme: dark) {
            body { background-color: #080f1c !important; color: #f5f1e8 !important; }
            .prisma-sub { color: #c5d0df !important; }
            .prisma-ref { color: #6f6e6b !important; }
          }
        `}</style>

        <main style={{ maxWidth: "32rem" }}>
          <p
            className="prisma-sub"
            style={{
              margin: 0,
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#575e6a",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
            }}
          >
            Algo quebrou
          </p>
          <h1
            style={{
              margin: "1.25rem 0 0",
              fontSize: "2.25rem",
              lineHeight: 1.15,
              fontWeight: 500,
              textWrap: "balance",
            }}
          >
            Não foi possível carregar o site.
          </h1>
          <p
            className="prisma-sub"
            style={{
              margin: "1.25rem 0 0",
              fontSize: "1.0625rem",
              color: "#575e6a",
            }}
          >
            O erro é nosso, não seu. Tente de novo — se insistir, volte daqui a
            pouco.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: 0,
              border: 0,
              background: "none",
              cursor: "pointer",
              font: "inherit",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "inherit",
              textDecoration: "underline",
              textDecorationColor: "#6a6f79",
              textUnderlineOffset: "4px",
            }}
          >
            Tentar de novo
          </button>
          {error.digest ? (
            <p
              className="prisma-ref"
              style={{
                margin: "1.5rem 0 0",
                fontSize: "0.65rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8c8f91",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
              }}
            >
              Referência {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  )
}
