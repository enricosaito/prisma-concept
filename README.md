# Prisma

Newsletter / blog / hub sobre **tecnologia, arte, design e escrita**.
Next.js 16 (App Router) + Tailwind v4 + shadcn (`base-nova`).

## Rodando

```bash
npm run dev        # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

## Vercel

A pasta está ligada ao projeto `enricosaito/prisma-concept` (`.vercel/`, fora do
Git). Comandos:

```bash
npm run deploy          # produção
npm run deploy:preview  # URL de preview
npm run env:pull        # baixa as env vars para .env.local
npm run logs            # logs de runtime
```

> **O projeto ainda não está conectado ao GitHub.** Hoje só sobe pelo CLI — um
> `git push` não publica nada. Para ligar o deploy automático:
> `vercel git connect`.

## A marca

`components/wordmark.tsx` desenha **PRISMΛ** — o "A" sem a barra do meio.

O Λ é o próprio "V" da Playfair girado 180°, não um desenho novo: assim ele
mantém o contraste de traço da fonte (diagonal fina à esquerda, grossa à
direita) e as serifas caem nos pés, exatamente onde o "A" da Playfair as tem.
O caractere grego literal (U+039B) não serve — a Playfair Display não tem
subset grego, então ele cairia para Times New Roman e destoaria do resto.

Detalhe que custa caro se for esquecido: o Λ fica **fora** do `GradientWaveText`.
Aquele componente pinta o gradiente com `background-clip: text`, e o navegador
calcula esse recorte a partir do texto **sem** a rotação — um glifo girado lá
dentro aparece como um "V" em pé. Fora do recorte, ele pinta normal.

## Estrutura

| Caminho                  | O que é                                              |
| ------------------------ | ---------------------------------------------------- |
| `app/page.tsx`           | Home — hero, última carta, prévia do arquivo, CTA    |
| `app/carta/page.tsx`     | Arquivo completo                                     |
| `app/carta/[slug]/`      | Página de leitura (pré-renderizada por slug)         |
| `app/assinar/page.tsx`   | Página de assinatura                                 |
| `app/api/subscribe/`     | Route handler que recebe o e-mail                    |
| `lib/posts.ts`           | **Os textos.** Fonte de verdade do conteúdo          |
| `lib/site.ts`            | Nome, tagline, links sociais, itens do menu          |
| `components/`            | Header, footer, cards, formulário, marca             |

## Publicando uma carta nova

Adicione um objeto ao array `posts` em `lib/posts.ts`. A rota, o arquivo e a
home se atualizam sozinhos — `generateStaticParams` cria a página a partir do
`slug`.

```ts
{
  slug: "titulo-em-kebab-case",
  title: "Título da carta",
  dek: "Uma linha que aparece nas listagens.",
  category: "Design",           // Tecnologia | Arte | Design | Escrita
  date: "2026-09-18",           // ISO; ordena da mais nova para a mais velha
  readingMinutes: 6,
  featured: true,               // opcional: fixa como "última carta" na home
  content: [
    { type: "p", text: "..." },
    { type: "h2", text: "..." },
    { type: "quote", text: "...", cite: "opcional" },
    { type: "list", items: ["...", "..."] },
  ],
}
```

O estilo do texto longo mora na classe `.prose-letter` em `app/globals.css`.

## Componentes Spell UI

Vindos do registry `@spell` (`components.json`), ficam soltos em `components/`:

| Componente          | Onde aparece                                             |
| ------------------- | -------------------------------------------------------- |
| `GradientWaveText`  | Wordmark PRISMΛ no header — varredura de espectro         |
| `BlurReveal`        | Hero da home (olho, título, descrição)                    |
| `TiltCard`          | Cards de carta nas grades (home e "Continue lendo")       |
| `FlowButton`        | Botão "Assinar" do formulário                             |
| `LabelInput`        | Campo de e-mail, com label flutuante                      |
| `Spinner`           | Estado de envio do formulário                             |
| `Signature`         | Assinatura no fim de cada carta (`components/sign-off`)   |

`perspective-book.tsx` também foi instalado, mas ainda não é usado.

### Ajustes feitos neles

São componentes copiados para o repositório (modelo shadcn), então foram
adaptados à paleta em vez de sobrepostos com `!important`:

- **`label-input`** — trocou `bg-white`/`dark:bg-neutral-950` por tokens do tema.
  A label flutuante usa `--label-surface` porque ela pinta por cima da borda e
  precisa combinar com o painel atrás: use
  `containerClassName="[--label-surface:var(--secondary)]"` em cima de um painel
  creme. Ganhou também `inputClassName` para controlar altura/raio.
- **`flow-button`** — `@keyframes dash-flow` foi para `globals.css` (antes cada
  botão injetava sua própria tag `<style>`), o traço agora mede o botão com um
  `ResizeObserver`, e `--rotating-border-color` está definido como o bronze.
  Depende de `@radix-ui/react-slot`, que **não** veio junto e foi instalado.
- **`tilt-card`** — respeita `prefers-reduced-motion`.
- **`gradient-wave-text`** — removido um `setState` dentro de `useEffect` que o
  lint do React Compiler rejeitava.
- **`signature`** — ganhou `fontSrc` e `fallback` (veja abaixo).

### ⚠️ A assinatura precisa de um arquivo de fonte

`Signature` desenha o traço lendo os contornos da fonte com `opentype.js`, então
precisa do **arquivo** `.otf`/`.ttf` em `public/` — uma webfont via CSS não
serve. Ele procura `public/LastoriaBoldRegular.otf`, que não veio na instalação.
Sem ele, `components/sign-off.tsx` mostra o nome em Playfair itálico como
fallback. Coloque o arquivo em `public/` (ou aponte `fontSrc` para outro) e a
animação de escrita liga sozinha.

## ⚠️ O formulário de assinatura ainda não guarda ninguém

`app/api/subscribe/route.ts` valida o e-mail e responde com sucesso, mas **não
persiste nada** — só escreve no log do servidor. Antes de divulgar o site,
conecte um provedor (Resend Audiences, Buttondown, Loops, ConvertKit…) no `TODO`
marcado nesse arquivo.

## Personalizando

- **Textos do site, Instagram, e-mail:** `lib/site.ts`
- **Cores:** tokens em `app/globals.css` (`:root` e `.dark`). A paleta atual é
  papel `#f6f7f8`, tinta `#101112` e bronze `#b89062`.
- **Fontes:** Playfair Display (títulos) + Inter (texto) + Geist Mono (rótulos),
  configuradas em `app/layout.tsx`.
- **Tema:** claro/escuro seguem o sistema; `d` alterna manualmente.
