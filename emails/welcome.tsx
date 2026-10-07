import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
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
 * As cartas que o e-mail de boas-vindas indica.
 *
 * Lista à mão de propósito: "favoritas" é escolha do autor, não as últimas
 * publicadas. Ela não acompanha content/cartas/ sozinha — quando uma carta
 * nova merecer entrar, é aqui.
 */
export const FAVORITAS = [
  {
    slug: "tudo-que-precisava-ser-dito-ja-foi-dito",
    titulo:
      "Tudo que precisava ser dito já foi dito, mas ninguém estava ouvindo",
  },
] as const

/**
 * Sent once, the moment someone joins the list.
 *
 * Everything here is inline styles on tables — that is not a stylistic choice,
 * it is what Outlook and Gmail actually render. The layout stays one column so
 * it needs no breakpoints: a phone and a desktop client get the same letter.
 */
function WelcomeEmail({
  url = site.url,
  unsubscribeUrl,
}: {
  url?: string
  /** Ausente quando falta `NEWSLETTER_SECRET`: o rodapé então não promete. */
  unsubscribeUrl?: string
}) {
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head />
      {/* A linha que aparece na caixa de entrada ao lado do assunto. Sem
          ela o cliente mostra as primeiras palavras do corpo, que aqui
          seriam o wordmark solto. */}
      <Preview>
        Você está recebendo isso porque você acabou de assinar a PRISMA.
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
            {/* PNG e não SVG: o Gmail remove <svg> da mensagem e o motor do
                Word, que desenha o Outlook, não sabe renderizá-lo. Os cantos
                arredondados vêm prontos no arquivo — `border-radius` em
                e-mail não é confiável — e o fundo dos cantos é o branco do
                papel, sem canal alfa, que é o que nenhum cliente erra.

                Largura e altura em atributo, não em CSS: o Outlook ignora o
                CSS e, sem os atributos, mostra a imagem no tamanho real. */}
            <Img
              src={`${url}/brand/prisma-selo-email.png`}
              width="48"
              height="48"
              alt="PRISMA"
              style={selo}
            />
            {/* O wordmark em texto saiu: o selo acima já identifica, e o nome
                repetido logo abaixo dele era a mesma coisa dita duas vezes. */}

            <Heading as="h1" style={heading}>
              Bem-vindo, leitor!
            </Heading>

            <Text style={paragraph}>
              Você está recebendo isso porque acaba de assinar a PRISMA.
            </Text>

            <Text style={paragraph}>
              Como um assinante gratuito você vai receber 1 carta por semana.
            </Text>

            <Text style={paragraph}>
              Essas cartas irão discutir sobre habilidades de alto valor para se
              adquirir na era da internet, mindsets cruciais para adotar,
              oportunidades chave para aproveitar, e nossos conceitos favoritos
              de psicologia, filosofia, tech e arte.
            </Text>

            <Text style={paragraph}>
              Aqui estão algumas das nossas publicações favoritas:
            </Text>

            {/* Escrito à mão, e não gerado da lista de cartas: "favoritas" é
                escolha editorial, não as últimas N. Quando houver mais, é aqui
                que se acrescenta. */}
            <ul style={lista}>
              {FAVORITAS.map((carta) => (
                <li key={carta.slug} style={itemLista}>
                  <Link href={`${url}/cartas/${carta.slug}`} style={linkLista}>
                    {carta.titulo}
                  </Link>
                </li>
              ))}
            </ul>

            <Text style={paragraph}>Nossa filosofia é simples:</Text>

            <Text style={filosofia}>
              Apontar contra um mar de problemas.
              <br />
              Te dar ferramentas para se tornar um pensador mais afiado.
              <br />
              Fazer você enxergar a beleza e os detalhes que sempre estiveram
              nas nossas vidas.
            </Text>

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
            {unsubscribeUrl ? (
              <Text style={footerText}>
                Não quer mais receber?{" "}
                <Link href={unsubscribeUrl} style={footerLink}>
                  Cancele a inscrição
                </Link>
                .
              </Text>
            ) : null}
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

const selo: React.CSSProperties = {
  display: "block",
  margin: "0 0 20px",
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

const lista: React.CSSProperties = {
  margin: "0 0 16px",
  paddingLeft: 20,
}

const itemLista: React.CSSProperties = {
  fontSize: 16,
  lineHeight: "1.65",
  color: c.foreground,
  marginBottom: 6,
}

const linkLista: React.CSSProperties = {
  color: c.foreground,
  textDecoration: "underline",
  textDecorationColor: c.accent,
  textUnderlineOffset: 3,
}

/* As três linhas da filosofia, quebradas por <br> e não por parágrafos: elas
   são uma frase em três tempos, e o espaço entre parágrafos as separaria
   demais. */
const filosofia: React.CSSProperties = {
  fontFamily: serif,
  fontSize: 16,
  lineHeight: "1.8",
  color: c.foreground,
  margin: "0 0 16px",
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
