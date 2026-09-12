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

O projeto **está conectado ao GitHub**: um push na `main` já dispara deploy de
produção sozinho, e cada PR ganha uma URL de preview. Os scripts acima servem
para publicar fora desse fluxo.

## A marca

`components/wordmark.tsx` desenha **PRISMΛ** — o "A" sem a barra do meio.

O Λ é o próprio "V" da Playfair girado 180°, não um desenho novo: assim ele
mantém o contraste de traço da fonte (diagonal fina à esquerda, grossa à
direita) e as serifas caem nos pés, exatamente onde o "A" da Playfair as tem.
O caractere grego literal (U+039B) não serve — a Playfair Display não tem
subset grego, então ele cairia para Times New Roman e destoaria do resto.

### Por que o Λ é montado de um jeito estranho

`background-clip: text` calcula o recorte a partir do texto **sem** a rotação.
Um glifo girado dentro do span recortado dá dois problemas: ele aparece em pé
(um "V") *e* deixa um fantasma de si mesmo no começo da palavra. Por isso o Λ:

- vai no slot `trailing` do `GradientWaveText` — dentro da raiz animada (para
  herdar o `--gi` que roda a varredura), mas fora do span recortado;
- pinta **o próprio** gradiente recortado, senão não teria cor nenhuma;
- usa o gradiente na direção invertida (`flip`), porque a rotação de 180° vira
  o fundo dele junto;
- corrige o `background-position` em `0.11em`, cancelando o empurrão de
  baseline abaixo — sem isso a faixa do Λ sai deslocada das outras letras.

A varredura é **linear e vertical** (`radial: false`), não radial: um gradiente
radial se centraliza na caixa de cada elemento, e o Λ (estreito) brilharia fora
de compasso com o PRISM (largo).

Há ainda um **kern óptico** de `-0.12em` antes do Λ. Não é correção de métrica:
rasterizando as duas grafias e varrendo as colunas de pixel, a tinta do Λ já cai
a 0,005em de onde cairia um "A" de verdade. Mas o "A" fecha o contraforma com a
barra e o Λ deixa aberta, então aquele branco se junta ao entreletra e o vão
*parece* maior. O kern fecha essa impressão sem espremer o M.

O empurrão de baseline existe porque girar 180° pivota no centro da caixa, o que
joga os pés do glifo abaixo da linha de base em
`(fontBoundingBoxAscent − fontBoundingBoxDescent) − capHeight`. Medido na
Playfair via `measureText` no canvas, dá 11% do tamanho da fonte; a
entrelinha se cancela na conta, então essa constante vale em qualquer tamanho.

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

## Componentes Magic UI

| Componente              | Onde aparece                                          |
| ----------------------- | ----------------------------------------------------- |
| `rainbow-button`        | "Assinar" do header e do menu mobile (`outline`)      |
| `animated-gradient-text`| `components/highlight.tsx` — palavras em destaque      |
| `light-rays`            | Fundo do hero da home                                  |

Os três foram retunados para o espectro discreto da marca em vez dos padrões
neon de fábrica. Dois ajustes que valem nota:

- **`light-rays`** sorteava os raios com `Math.random()` dentro de um
  `useEffect` — o que o lint do React Compiler rejeita e ainda arrisca
  divergência entre servidor e cliente. Agora usa um PRNG com semente
  (`seed`), então os raios são construídos no render, iguais dos dois lados.
  Ganhou também `blend`: o `mix-blend-screen` original só clareia e sumia no
  tema claro, então o hero usa `normal` no claro e `screen` no escuro.
- **`animated-gradient-text`** pinta com `background-clip: text`. Aqui ele
  envolve um `BlurReveal`, cujos caracteres são `inline-block` animados —
  diferente do Λ, esses assentam em transform zero, então o recorte fecha
  certo. Conferido no navegador, sem faixas por letra.

`dia-text-reveal.tsx` também está instalado, ainda sem uso, e **reprova no
lint** (escreve em refs durante o render).

## Botões

Todos usam Playfair em caixa alta com `tracking-[0.16em]` — a regra está na base
dos três componentes (`ui/button`, `flow-button`, `ui/rainbow-button`), não nos
pontos de uso.

O "Assinar" do header e do menu mobile é o **rainbow button do Magic UI**
(`npx shadcn add https://magicui.design/r/rainbow-button.json`), na variante
`outline` com raio de `10px`, com dois ajustes:

- `--color-1..5` em `globals.css` passaram do arco-íris saturado de fábrica para
  o mesmo espectro discreto do wordmark — um prisma dispersando luz, e não um
  degradê neon em cima de uma paleta editorial;
- as cores do corpo saíram de valores fixos (`#121213`/`#fff` na `default`,
  `#ffffff`/`#0a0a0a` na `outline`) para `var(--primary)` e `var(--background)`,
  que já viram sozinhos com o tema; com isso o `dark:` das duas variantes foi
  removido. A `outline` também trocou `text-accent-foreground` por
  `text-foreground`: neste tema o primeiro é tinta escura nos **dois** modos, o
  que deixaria o texto invisível no botão escuro.

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
