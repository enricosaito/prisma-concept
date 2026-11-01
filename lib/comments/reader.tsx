"use client"

import * as React from "react"

import type { Reader } from "./types"

/**
 * Who is commenting — the authentication boundary of the comment section.
 *
 * The section asks only two things of it: who the reader is (`reader`), and to
 * sign them in when they try to publish (`requestSignIn`). Everything about
 * how that happens lives behind this context. Swapping in a real provider —
 * a managed auth service with magic links or social login — means writing a
 * different provider with the same value, not touching the components.
 *
 * Today the only implementation is PrototypeReaderProvider, below.
 */
type ReaderContextValue = {
  reader: Reader | null
  /**
   * Start signing in. Resolves with the reader once they are in, or `null`
   * if they gave up. A real provider may leave the page to do this (a magic
   * link, an OAuth redirect), which is why the composer keeps its draft in
   * sessionStorage rather than only in memory.
   *
   * `draft` is what the reader is about to publish, so the sign-in step can
   * show them what it is for. A provider is free to ignore it.
   */
  requestSignIn: (draft?: string) => Promise<Reader | null>
  signOut: () => void
}

const ReaderContext = React.createContext<ReaderContextValue | null>(null)

function useReader() {
  const value = React.useContext(ReaderContext)
  if (!value) throw new Error("useReader precisa de um ReaderProvider acima.")
  return value
}

const SESSION_KEY = "prisma:prototype-reader:v1"

function readSession(): Reader | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Reader) : null
  } catch {
    return null
  }
}

/**
 * PROTÓTIPO. A "entrada" é só um nome digitado num diálogo marcado como
 * simulação: não cria conta, não verifica ninguém, não envia e-mail e não
 * guarda senha. O leitor fica no sessionStorage da aba, com `verified: false`.
 *
 * `SignIn` é o diálogo. Vem de fora para que este arquivo seja só estado —
 * o visual é de PrototypeSignInDialog.
 */
type SignInProps = {
  open: boolean
  draft: string
  onComplete: (name: string) => void
  onCancel: () => void
}

function PrototypeReaderProvider({
  children,
  SignIn,
}: {
  children: React.ReactNode
  SignIn: React.ComponentType<SignInProps>
}) {
  const [reader, setReader] = React.useState<Reader | null>(null)
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const pending = React.useRef<((reader: Reader | null) => void) | null>(null)

  // Depois da montagem, para que o HTML do servidor e o primeiro render do
  // cliente concordem (o servidor não tem sessionStorage).
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setReader(readSession()))
    return () => cancelAnimationFrame(frame)
  }, [])

  const settle = React.useCallback((value: Reader | null) => {
    pending.current?.(value)
    pending.current = null
    setOpen(false)
  }, [])

  const complete = React.useCallback(
    (name: string) => {
      const next: Reader = {
        id: `prototype-${crypto.randomUUID()}`,
        name: name.trim(),
        verified: false,
      }
      try {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
      } catch {}
      setReader(next)
      settle(next)
    },
    [settle]
  )
  const cancel = React.useCallback(() => settle(null), [settle])

  const value = React.useMemo<ReaderContextValue>(
    () => ({
      reader,
      requestSignIn: (text = "") => {
        if (reader) return Promise.resolve(reader)
        setDraft(text)
        setOpen(true)
        return new Promise((resolve) => {
          pending.current = resolve
        })
      },
      signOut: () => {
        try {
          window.sessionStorage.removeItem(SESSION_KEY)
        } catch {}
        setReader(null)
      },
    }),
    [reader]
  )

  return (
    <ReaderContext.Provider value={value}>
      {children}
      <SignIn
        open={open}
        draft={draft}
        onComplete={complete}
        onCancel={cancel}
      />
    </ReaderContext.Provider>
  )
}

export { PrototypeReaderProvider, useReader }
