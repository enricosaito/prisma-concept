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

O wordmark é **PRISMA** em `Mermaid1001` (`public/fonts/`, carregada com
`next/font/local` como `--font-display`), sem entreletra — a palavra fecha em
bloco. É texto puro, sem cirurgia de glifo, e a varredura do gradiente
atravessa todas as letras de uma vez.

Na pasta também estão `against regular.otf` (a fonte anterior, de contraste
alto e "A" sem barra) e `Mermaid Swash Caps.ttf`. A Swash Caps foi testada e
**não serve para o header**: os swashes passam da largura de avanço, então as
letras se sobrepõem em qualquer entreletra normal e só se separam perto de
`0.5em` — e o "P" ainda invade a margem esquerda.

### Por que o wordmark tem um empurrão de 0.083em

Flex centraliza a **caixa de linha**, não a tinta. A Mermaid1001 reserva uma
descida grande (13px a 36px) que caixa alta nunca usa, então a palavra subia:
medidos 15,5px de folga acima dos glifos e 21,5px abaixo. O desequilíbrio é
`(fontBoundingBoxDescent − fontBoundingBoxAscent) + (inkAscent − inkDescent)`,
pela metade — a entrelinha se cancela, então uma constante em `em` vale nos dois
tamanhos do header. Agora fica 18,49 / 18,51.

### O PRISM + Λ da Playfair ficou para trás

Enquanto o wordmark era Playfair, o "A" sem barra era o próprio "V" da fonte
girado 180°. Esse truque não transfere: medido na `Mermaid1001`, o "V" é 14%
mais estreito e 3% mais baixo que o "A", e a correção de baseline inverteria de
sinal (`-0.165em` contra `0.12em` da Playfair). O Λ sairia menor e desalinhado
em relação às outras capitais.

Toda a lógica (e o porquê de cada constante) está comentada no topo de
`components/wordmark.tsx`, para não precisar ser redescoberta se a fonte mudar
de novo. O resumo: `background-clip: text` calcula o recorte a partir do texto
**sem** a rotação, então o glifo girado não podia morar dentro do span
recortado; e as duas constantes (`0.12em` de baseline, `-0.15em` de kern
óptico) vinham de medição no canvas, não de chute.

## Estrutura

| Caminho                  | O que é                                              |
| ------------------------ | ---------------------------------------------------- |
| `app/page.tsx`           | Home — hero, última carta, prévia do arquivo, CTA    |
| `app/biblioteca/page.tsx`| Biblioteca — arquivo completo                        |
| `app/biblioteca/[slug]/` | Página de leitura (pré-renderizada por slug)         |
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

> A seção se chamava **Carta** e vivia em `/carta`. Virou **Biblioteca** em
> `/biblioteca`; `next.config.ts` redireciona `/carta` e `/carta/:slug` com 308,
> então qualquer link já compartilhado continua funcionando. As edições em si
> continuam sendo "cartas" — a Biblioteca é onde elas ficam.

O estilo do texto longo mora na classe `.prose-letter` em `app/globals.css`.

## Componentes Spell UI

Vindos do registry `@spell` (`components.json`), ficam soltos em `components/`:

| Componente          | Onde aparece                                             |
| ------------------- | -------------------------------------------------------- |
| `GradientWaveText`  | Wordmark PRISMA no header — varredura de espectro         |
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
| `animated-theme-toggler` | Troca de tema no header (`components/theme-toggle`)   |
| `grid-pattern`          | Grade tracejada no fundo do hero                      |
| `shine-border`          | Borda animada do campo de e-mail                      |

Os três foram retunados para o espectro discreto da marca em vez dos padrões
neon de fábrica. Dois ajustes que valem nota:

- **`light-rays`** foi trocada pela `grid-pattern` no hero e **não é mais
  usada** (o arquivo fica, já corrigido: PRNG com semente em vez de
  `Math.random()` dentro de um `useEffect`, mais um prop `blend`).
- **`animated-theme-toggler`** é usado em modo **controlado**. Solto, ele grava
  `localStorage.theme` e observa a classe `dark` por conta própria, brigando com
  o next-themes — que é a fonte da verdade aqui — e os dois divergiriam no
  reload ou numa troca de tema do sistema. Controlado, ele só roda a view
  transition e devolve o valor novo. `components/theme-toggle.tsx` também adia a
  renderização até montar, porque `resolvedTheme` é `undefined` no servidor.
- **`animated-gradient-text`** pinta com `background-clip: text`. Aqui ele
  envolve um `BlurReveal`, cujos caracteres são `inline-block` animados —
  diferente do Λ, esses assentam em transform zero, então o recorte fecha
  certo. Conferido no navegador, sem faixas por letra.

`dia-text-reveal.tsx` também está instalado, ainda sem uso, e **reprova no
lint** (escreve em refs durante o render).

## O espectro como cor de destaque

O cobre deixou de ser o único destaque. `lib/spectrum.ts` é a fonte única das
cinco cores (espelhadas como `--color-1..5` em `globals.css`, nos dois temas)
e mapeia **uma faixa por categoria** — um prisma dividindo a luz nas quatro
coisas sobre as quais a carta fala:

| Categoria  | Faixa           |
| ---------- | --------------- |
| Tecnologia | azul-aço        |
| Arte       | bronze          |
| Design     | violeta-ardósia |
| Escrita    | ouro quente     |

Usada em: o rótulo de categoria e a seta Ler de cada card, os quatro pontos
da lista de temas no hero, a borda do campo de e-mail (`ShineBorder`), o
wordmark e os destaques em itálico. A régua do header e o sublinhado do link
ativo usam a rampa inteira (`var(--spectrum)`), mascarada nas pontas.

`--accent` continua sólido (bronze) onde uma cor única é obrigatória: anéis de
foco, bordas, links do texto longo. O bronze é uma das faixas, então isso não
briga com o resto.

## Botões

Todos usam **Jost** (`--font-ui`) em caixa alta com `tracking-[0.16em]` — a regra
está na base dos três componentes (`ui/button`, `flow-button`,
`ui/rainbow-button`), não nos pontos de uso. Os links do menu usam a mesma
fonte. Jost é geométrica (linha Futura), o par clássico de um display de
contraste alto: soa como outra voz em vez de disputar com o wordmark, o que
acontecia quando nav e logo eram os dois serifados.

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
- **Fontes:** `Mermaid1001` (wordmark) + Jost (nav/botões) + Playfair Display
  (títulos) + Inter
  (texto) + Geist Mono (rótulos), configuradas em `app/layout.tsx`.
- **Tema:** claro/escuro seguem o sistema; o botão no header alterna (o atalho
  de tecla `d` do scaffold foi removido).
