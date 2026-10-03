# O editor

Um editor no navegador, em `/keystatic`, sobre os mesmos arquivos `.md` de
sempre. Não é um CMS que guarda o conteúdo em outro lugar: é uma interface
sobre `content/cartas/`. Editar pelo editor e editar no seu editor de texto são
a mesma coisa, e nada no site precisou saber que ele existe.

Foi escolhido no lugar de um CMS hospedado porque a prosa continua sendo um
arquivo seu, versionado no git frase por frase — a propriedade em que a regra
do `AGENTS.md` se apoia.

```bash
npm run dev     # depois abra http://localhost:3000/keystatic
```

---

## Escrever

**New Carta** cria uma carta. O formulário à direita é a frontmatter; o painel
à esquerda é o texto, com negrito, itálico, links, listas e citação com campo
próprio para a fonte.

**Save** grava no arquivo. Continua sendo você quem commita — o editor mexe no
disco, não no git.

Enquanto **Situação** for *Rascunho*, a carta não existe para o site publicado:
não é gerada, não entra na contagem do arquivo, não entra no sitemap, e a URL
dá 404. Trocar para *Publicada* e commitar é o que a põe no ar.

### Duas coisas que vão te morder, e a saída de cada uma

**Campos vazios ou valores estranhos ao abrir uma carta.** O editor guarda as
alterações não salvas no navegador (IndexedDB) e as restaura por cima do
arquivo. Depois de uma mudança de schema, esse rascunho velho não bate mais.
Limpe os dados do site em localhost e recarregue. O arquivo está certo.

**Erro 500 ao abrir a carta, com "Jest worker encountered child process
exceptions".** O servidor de desenvolvimento travou — acontece quando ele fica
rodando através de várias mudanças de rota ou de schema. Não é o editor nem o
arquivo:

```bash
# pare o servidor, e então
rm -rf .next && npm run dev
```

---

## O editor é dono do formato da frontmatter

Ao salvar, o Keystatic reescreve a frontmatter no formato dele: reordena as
chaves, tira as aspas das que não precisam, quebra textos longos em blocos YAML
dobrados (`>-`), e omite os campos opcionais vazios. O arquivo fica com outra
cara.

**O que ele não muda é o conteúdo.** Medido num salvamento real, comparando o
que `lib/letters/parse.ts` lê dos dois arquivos: de doze campos, **só mudou o
que eu editei**. Título, resumo, as duas descrições de imagem e a proporção do
thumb leem idênticos apesar da reformatação. O corpo da carta sai igual, com uma
única diferença — um espaço no fim das linhas `>` vazias dentro de citações,
inerte em Markdown e invisível na página.

Isso foi verificado contra o site: as quatro páginas saem com HTML idêntico ao
de antes, depois de o arquivo ter passado pelo editor.

`lib/letters/parse.ts` trata campo vazio e nulo como ausente, então os dois
formatos — o escrito à mão e o escrito pelo editor — produzem o mesmo modelo em
memória. Você pode continuar escrevendo à mão; o primeiro save normaliza.

---

## O caminho das imagens é texto

O campo de imagem do Keystatic quer gerir o arquivo ele mesmo e não reconheceu
os caminhos que a frontmatter já guardava: lia vazio, e salvar teria apagado as
capas. Por isso `cover.src` e `thumb.src` são campos de texto.

Na prática: capa nova vai para `public/covers/` e o caminho se escreve no campo,
como `/covers/minha-capa.jpg`. Para arte preparada fora em 3:5, isso já era o
fluxo.

`npm run cartas:check` avisa se um caminho apontar para um arquivo que não
existe.

---

## O editor tem a própria raiz

O app tem dois layouts raiz, via grupos de rota: `(site)` e `(editor)`. Não é
preferência — dentro do layout da PRISMA o Keystatic renderizava um documento
vazio, sem erro nenhum no console. Grupos de rota não aparecem na URL, então
nenhum endereço mudou.

`app/(editor)/layout.tsx` de propósito **não** importa `globals.css`: as cores e
a tipografia da PRISMA são para as cartas, e aplicá-las por cima do editor só
faria os dois brigarem.

---

## Editar de qualquer lugar, depois

Hoje o editor é local: roda com `npm run dev`, na sua máquina. Para escrever de
qualquer navegador sem clonar o repositório, o Keystatic tem o modo GitHub — ele
commita por você, e aí publicar é apertar Save e esperar o deploy.

A troca é em `keystatic.config.ts`:

```ts
storage: { kind: "github", repo: "enricosaito/prisma-concept" }
```

Mais um GitHub App (criado por você em github.com/settings/apps) e três
variáveis de ambiente. Vale fazer quando a vontade de escrever longe do
computador aparecer — não antes.
