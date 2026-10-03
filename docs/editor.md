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

**Só em desenvolvimento.** `/keystatic` dá 404 em produção, e o porquê — junto
com o que seria preciso para funcionar publicado — está no fim deste documento.

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

**Uma carta aparece na lista sem título nem data.** Acontece com arquivos
escritos à mão que o editor ainda não salvou — a lista fica em branco nessas
colunas, mas a carta abre e edita normalmente, e o primeiro Save resolve.
Não achei a causa; é cosmético.

**"NotFoundError: Not found" apontando para `page.tsx`, na linha do
`<Editor />`.** Não é a guarda de desenvolvimento dessa linha. O Keystatic tem
um `notFound()` próprio, que ele lança quando a entrada aberta não existe —
tipicamente uma carta apagada cuja URL ficou na barra de endereços. Ele captura
o erro no próprio error boundary, por isso aparece como "Recoverable".

O Next atribui o erro ao componente React mais próximo que sabe nomear, que é a
página do editor. Volte para a lista de cartas; o que você estava editando foi
salvo.

**Erro 500 ao abrir a carta, com "Jest worker encountered child process
exceptions".** Corrigido — e a correção não era reiniciar o servidor, como eu
cheguei a achar na primeira vez que isso apareceu.

A causa está no log do `next dev`, algumas linhas acima do 500: *"Failed to
generate static paths for /keystatic/[[...params]]"*. O Next tentava analisar as
rotas do editor para gerar caminhos estáticos e, para isso, carregava o módulo
da página num processo filho. Esse módulo puxa a interface inteira do Keystatic;
o filho morria, e tudo que chegasse na rota virava 500.

`export const dynamic = "force-dynamic"` na página e na rota de API resolve: não
há nada a gerar estaticamente ali, e o Next para de tentar.

Se voltar a acontecer, procure essa linha no log antes de qualquer outra coisa —
ela diz qual rota o Next não conseguiu analisar.

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

## O editor só existe em desenvolvimento

`/keystatic` responde 404 em produção, de propósito. Não é uma limitação
contornável com configuração: com `storage: local`, o Keystatic lê e grava **o
disco do servidor que o roda**. Isso só faz sentido quando esse disco é o seu
repositório.

Num deploy da Vercel o disco é somente-leitura e refeito a cada publicação —
o editor não leria (é por isso que `prismaconcept.com.br/keystatic` mostrava
zero cartas) e, se pudesse gravar, o que você escrevesse sumiria no deploy
seguinte. E a rota ficava de pé, aberta, no domínio público.

A guarda está em `app/(editor)/keystatic/[[...params]]/page.tsx` e na rota de
API ao lado. Ela testa `NODE_ENV === "development"`, e não "não é a Vercel",
para falhar fechada: qualquer ambiente que não seja o seu `npm run dev` não tem
editor.

## Editar de qualquer lugar, depois

Para escrever de qualquer navegador sem clonar o repositório, o Keystatic tem o
**modo GitHub**: em vez do disco, ele lê e grava o repositório pela API do
GitHub e **commita por você**. Aí ele faz sentido publicado, e publicar vira
apertar Save e esperar o deploy.

O que muda:

1. Em `keystatic.config.ts`:
   ```ts
   storage: { kind: "github", repo: "enricosaito/prisma-concept" }
   ```
2. Um GitHub App, criado por você em github.com/settings/apps, com permissão de
   leitura e escrita em Contents.
3. Três variáveis de ambiente na Vercel: `KEYSTATIC_GITHUB_CLIENT_ID`,
   `KEYSTATIC_GITHUB_CLIENT_SECRET` e `KEYSTATIC_SECRET`.
4. A guarda acima sai — o editor passa a existir em produção, protegido pelo
   login do GitHub e pela sua permissão no repositório.

Vale fazer quando a vontade de escrever longe do computador aparecer. Enquanto
escrever for sentar na mesa, o modo local é menos peça para manter.
