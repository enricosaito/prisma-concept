const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let email: unknown

  try {
    const body = (await request.json()) as { email?: unknown }
    email = body.email
  } catch {
    return Response.json({ message: "Requisição inválida." }, { status: 400 })
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return Response.json(
      { message: "Digite um e-mail válido." },
      { status: 400 }
    )
  }

  // TODO: wire a real provider (Resend audiences, Buttondown, Loops, ConvertKit…)
  // and store the address. Until then nothing is persisted — the address is only
  // echoed to the server log so the flow can be exercised end to end in dev.
  console.info("[subscribe] pending signup:", email.trim().toLowerCase())

  return Response.json({
    message: "Pronto! Você está na lista.",
    stored: false,
  })
}
