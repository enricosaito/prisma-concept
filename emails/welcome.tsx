import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

import { email as c, mono, sans, serif } from "@/emails/theme"
import { site } from "@/lib/site"
import { SPECTRUM } from "@/lib/spectrum"

/**
 * Sent once, the moment someone joins the list.
 *
 * Everything here is inline styles on tables — that is not a stylistic choice,
 * it is what Outlook and Gmail actually render. The layout stays one column so
 * it needs no breakpoints: a phone and a desktop client get the same letter.
 */
function WelcomeEmail({ url = site.url }: { url?: string }) {
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head />
      <Preview>
        A primeira carta chega em breve. Enquanto isso, o arquivo está aberto.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* The dispersed spectrum, as a rule. Five cells of a table is the
              only gradient a mail client can be trusted with — and each one
              needs a character in it, or Outlook collapses an empty cell to
              nothing whatever its height says. */}
          <Row>
            {SPECTRUM.map((band) => (
              <Column key={band} style={{ ...bandCell, backgroundColor: band }}>
                &nbsp;
              </Column>
            ))}
          </Row>
          {/* A spacer row, not a margin: the Word engine behind Outlook drops
              margins on tables. */}
          <Section style={spacer}>&nbsp;</Section>

          <Section style={sheet}>
            <Text style={wordmark}>{site.wordmark}</Text>

            <Heading as="h1" style={heading}>
              Você está na lista.
            </Heading>

            <Text style={paragraph}>
              Obrigado por assinar. A cada quinze dias chega aqui uma carta
              sobre um assunto só — virado devagar, até aparecer o que sempre
              esteve junto.
            </Text>

            <Text style={paragraph}>
              Não é um resumo de notícias e não é uma lista. É um texto, escrito
              para ser lido em menos de dez minutos, sobre cultura, filosofia,
              tecnologia e arte — sempre pelo que essas coisas têm em comum, não
              pelo que as separa.
            </Text>

            <Text style={paragraph}>
              Enquanto a próxima não sai, tudo o que já saiu continua aberto:
            </Text>

            <Section style={{ marginTop: 24, marginBottom: 8 }}>
              <Link href={`${url}/biblioteca`} style={button}>
                Ler a biblioteca
              </Link>
            </Section>

            <Hr style={rule} />

            <Text style={signOffLabel}>Até a próxima</Text>
            <Text style={signature}>{site.signature}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Você recebeu este e-mail porque assinou a {site.signature} em{" "}
              <Link href={url} style={footerLink}>
                {url.replace(/^https?:\/\//, "")}
              </Link>
              .
            </Text>
            <Text style={footerText}>
              Para sair da lista, é só responder a esta mensagem — quem lê é uma
              pessoa.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const bandCell: React.CSSProperties = {
  height: 3,
  fontSize: 1,
  lineHeight: "3px",
}

const spacer: React.CSSProperties = {
  height: 32,
  fontSize: 1,
  lineHeight: "32px",
}

const body: React.CSSProperties = {
  backgroundColor: c.background,
  color: c.foreground,
  fontFamily: sans,
  margin: 0,
  padding: "32px 0",
}

const container: React.CSSProperties = {
  maxWidth: 560,
  margin: "0 auto",
  padding: "0 20px",
}

const sheet: React.CSSProperties = {
  backgroundColor: c.paper,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  padding: "36px 32px 32px",
}

const wordmark: React.CSSProperties = {
  fontFamily: serif,
  fontSize: 15,
  letterSpacing: "0.36em",
  textTransform: "uppercase",
  color: c.foreground,
  margin: "0 0 28px",
}

const heading: React.CSSProperties = {
  fontFamily: serif,
  fontSize: 30,
  lineHeight: "1.15",
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: c.foreground,
  margin: "0 0 20px",
}

const paragraph: React.CSSProperties = {
  fontSize: 16,
  lineHeight: "1.7",
  color: "#33363a",
  margin: "0 0 16px",
}

// Mail clients ignore most button markup, so this is a padded inline link —
// which every client does render, and which still reads as a button.
const button: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: c.foreground,
  color: c.background,
  fontSize: 13,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  textDecoration: "none",
  padding: "13px 24px",
  borderRadius: 4,
}

const rule: React.CSSProperties = {
  border: "none",
  borderTop: `1px solid ${c.border}`,
  margin: "32px 0 20px",
}

const signOffLabel: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: c.muted,
  margin: "0 0 6px",
}

const signature: React.CSSProperties = {
  fontFamily: serif,
  fontStyle: "italic",
  fontSize: 26,
  color: c.foreground,
  margin: 0,
}

const footer: React.CSSProperties = {
  padding: "24px 8px 0",
}

const footerText: React.CSSProperties = {
  fontSize: 12,
  lineHeight: "1.6",
  color: c.muted,
  margin: "0 0 6px",
}

const footerLink: React.CSSProperties = {
  color: c.muted,
  textDecoration: "underline",
}

// Resend renders this component on the server; the default export is what the
// `react-email` preview server picks up if it is ever pointed at /emails.
export default WelcomeEmail
export { WelcomeEmail }
