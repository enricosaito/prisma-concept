# O e-mail de boas-vindas

Sai uma vez, no instante em que alguém assina. É o único e-mail que o site
dispara sozinho.

## Onde mexer em cada coisa

O e-mail está partido em dois arquivos, e a divisão não é arbitrária: **o que a
caixa de entrada mostra antes de abrir** fica num lugar, **o que está dentro da
mensagem** fica no outro.

| O que você quer mudar                 | Arquivo                | O que procurar                                  |
| ------------------------------------- | ---------------------- | ----------------------------------------------- |
| O assunto                             | `lib/newsletter.tsx`   | `subject:`                                      |
| Quem aparece como remetente           | variável `RESEND_FROM` | não é código — está no `.env.local` e na Vercel |
| A linha de prévia na caixa de entrada | `emails/welcome.tsx`   | `<Preview>`                                     |
| Os textos da mensagem                 | `emails/welcome.tsx`   | os `<Text>` e o `<Heading>`                     |
| O selo no topo                        | `emails/welcome.tsx`   | `<Img ... prisma-selo-email.png>`               |
| Cores e fontes                        | `emails/theme.ts`      | —                                               |
| **A versão em texto puro**            | `lib/newsletter.tsx`   | `welcomeText()`                                 |

### A pegadinha: são dois textos, não um

Todo e-mail sai em duas versões dentro do mesmo envelope — HTML e texto puro —,
e os clientes escolhem qual mostrar. **Elas não são geradas uma da outra.** Se
você mudar um parágrafo no `welcome.tsx` e esquecer o `welcomeText()`, metade dos
leitores vê o texto novo e a outra metade vê o antigo, e nada acusa isso.

A versão em texto não é opcional: um e-mail só-HTML pontua pior em todo filtro de
spam, porque é o formato de quem manda em massa sem se dar o trabalho.

## Regras do meio

E-mail não é a web. O que vale no site não vale aqui:

- **Nada de SVG.** O Gmail remove `<svg>` da mensagem e o Outlook não sabe
  desenhá-lo. Imagem é PNG ou JPG, hospedada numa URL absoluta.
- **Nada de variável CSS, `currentColor` ou tema claro/escuro.** Por isso o
  `emails/theme.ts` existe: são os tokens do site achatados em hexadecimal, à
  mão. Se a paleta do site mudar, esse arquivo não acompanha sozinho.
- **Largura e altura de imagem em atributo**, não em CSS. O Outlook ignora o CSS
  e mostra a imagem no tamanho real.
- **Sem `border-radius` confiável.** O selo tem os cantos arredondados gravados
  no próprio PNG, com o fundo dos cantos no branco do papel e sem canal alfa.
- **Espaçamento com linhas de tabela, não com margem.** O motor do Word, que
  desenha o Outlook, descarta margens em tabelas. É por isso que há `<Section>`
  servindo de espaçador com um `&nbsp;` dentro.

## Trocar o selo

```bash
node --input-type=module -e '
import sharp from "sharp";
import fs from "node:fs";
const arte = fs.readFileSync("public/icons/svg/prisma-icon-white-transparent.svg","utf8");
const paths = arte.slice(arte.indexOf("<g"), arte.indexOf("</g>")+4);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><rect width="256" height="256" rx="44" fill="#1B1C1E"/>${paths}</svg>`;
await sharp(Buffer.from(svg)).resize(96,96).flatten({background:"#ffffff"})
  .png({compressionLevel:9,palette:false}).toFile("public/brand/prisma-selo-email.png");
'
```

96 pixels para exibir em 48: o dobro, por causa das telas retina. O `rx=44` em
256 é o mesmo arredondamento de 17% do selo da barra do site.

## Ver antes de enviar

Não há servidor de preview instalado. O jeito honesto é enviar para você mesmo:

```bash
npm run build && npm start
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com"}'
```

**Só funciona na primeira vez por endereço.** Quem já está na lista recebe o
estado `already` e nenhum e-mail — é o que impede alguém de ser saudado duas
vezes. Para repetir, descadastre-se primeiro pelo link do rodapé e assine de
novo: o estado `resubscribed` dispara o e-mail outra vez.

A imagem do selo aponta para o domínio de produção. Num teste local ela só
aparece se o arquivo já estiver publicado lá.

## Se o e-mail não chegar

Ele **nunca derruba a inscrição** — `sendWelcome` captura o erro e só registra, de
propósito, porque o leitor está na lista de todo jeito e dizer o contrário só o
faria enviar o formulário outra vez.

O custo disso é que uma falha é silenciosa. Onde procurar, em ordem:

1. O log do servidor, por `[subscribe] welcome email failed`
2. O painel do Resend, em Emails — ele mostra o estado real de cada mensagem
3. As variáveis: sem `RESEND_API_KEY` ou sem o id do segmento, o `subscribe()`
   devolve `unconfigured` e **descarta o endereço em silêncio**, respondendo
   "Pronto! Você está na lista" assim mesmo

## Entregabilidade

O que já está de pé: DKIM e SPF verificados no domínio, descadastro de um clique
(RFC 8058), versão em texto puro, zero imagens de rastreamento.

O que depende do DNS: um registro `_dmarc` TXT com `v=DMARC1; p=none;`. O Gmail
exige uma política DMARC declarada de remetentes em massa desde 2024.

Vale lembrar que o assunto conta. Frases de elogio ou de urgência — "você é
incrível", "última chance" — são sinal que os filtros pesam, ainda que leve.
