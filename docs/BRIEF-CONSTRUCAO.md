# Brief comum de construção — aula "Carboidratos no Esporte"

Projeto: `/Users/mac/projetos claude/aula-carboidratos-esporte` (React 19 + TS estrito + Vite 7 + Tailwind v4 + framer-motion + R3F/drei).
Público: pós-graduação (nutrição/medicina do esporte). Professor: Rinaldo Caporal, nutricionista. Tudo em português do Brasil.
**A aula é dada ONLINE, por videochamada** (tela compartilhada, comprimida pelo codec, vista em notebook). Isso manda no visual.

Leia antes de começar:
1. `docs/ROTEIRO.md`: o fio, os 5 personagens e a linha do SEU ato.
2. Os dossiês em `docs/dossie/` que o seu ato cita. São a FONTE ÚNICA dos números.
3. O kit `src/components/sims/kit/` (lista abaixo).
4. As skills de visual que o professor instalou. Leia e aplique de verdade:
   - `~/.claude/skills/emil-design-eng/SKILL.md`: curvas, durações, molas, o que animar e o que não animar.
   - `~/.claude/skills/impeccable/reference/craft-floor.md`, `reference/animate.md` e `reference/visualize.md`.
   - `~/.claude/skills/taste-skill/SKILL.md`, só a parte de layout e anti-padrões genéricos.

## Liberdade para inovar (pedido explícito do professor)
Não fique preso ao molde das aulas anteriores ("abas + painel + texto"). Ele quer que as skills novas **potencializem a experiência
visual**. Escolha, para cada slide, a forma que melhor CONTA a ideia, por exemplo:
- **Curva que se transforma** (`useMorphPath`): a glicemia do pão vira a da lentilha; a curva de dose vira platô.
- **Cena que se monta**: o enterócito ganha um transportador por passo; a escada da glicólise se acende degrau a degrau.
- **Layout compartilhado** (`layoutId`): o mesmo número viaja do cartão para o gráfico. O tanque da Marina sai do elenco e reaparece.
- **Tipografia cinética**: uma frase grande que se reescreve (Beat), com o número-chave contando até o valor (CountUp, BigStat).
- **Comparação lado a lado que "abre"**: clip-path (`Wipe`) revelando o segundo braço do estudo.
- **Linha do tempo histórica** com objetos desenhados em SVG chapado (a agulha, a bicicleta de uma perna, o cão de Bernard).
- **Interação ao vivo** (slider, clique) quando ela ensina, por exemplo a intensidade no Cruzamento. O passador continua contando a história sozinho.
Varie: dois slides seguidos não devem ter a mesma composição. Cada slide = UMA ideia com começo, virada e consequência.

## O que a videochamada proíbe (regra dura)
- **Sem brilho** (box-shadow/text-shadow/glow/bloom), **sem degradê** de fundo e **sem partícula fina**: o codec transforma em borrão e blocos.
- **Sem hairline**: borda de 1 px com baixo contraste some. Bordas ≥ 2 px ou nenhuma; separe por espaço e por bloco de cor chapada.
- **Sem movimento contínuo em loop** atrás do conteúdo (pulsar, girar, pisca-pisca): na chamada isso vira ruído e trava. Animação = consequência de um passo, e termina.
- **Texto grande**: corpo ≥ 20 px, rótulos ≥ 16 px, nada < 14 px efetivos. A frase-chave do passo em 26–34 px. Números-chave 64–96 px.
- **Baixa densidade**: no máximo ~35 palavras visíveis por passo (fora a linha de fonte). O resto vai para as notas do professor.
- Contraste alto, cores chapadas da paleta. Fundo dos painéis: `PANEL_BG`.

## Regras de conteúdo
- Só números que o dossiê marca como confirmados. Nada marcado `[NÃO CONFIRMADO]` nem da seção "Não citar". O roteiro já avisa vários ("não usar").
- Cálculo próprio vai rotulado (`CalcChip`). Curva ou forma didática com números inventados = `IllustrativeChip`. Personagem = `FictionChip`.
  Dado em animal = `AnimalChip`. Artigo não lido no original = `ViaReviewChip`. Estudo da indústria = `IndustryChip`. Use os selos do kit, não escreva à mão.
- Desenho do estudo visível quando o slide mostra um efeito (`DesignChip`: "ECR cruzado · n = 9 · cego"). A turma é de pós: ela quer saber o n.
- Frases de quem fala com profissionais de saúde. Sem clichê de marketing, sem promessa de efeito, sem exclamação.
- Sem protocolo de doping. Doses de nutriente aparecem como dado de estudo ou diretriz, com a fonte.

## Kit (`src/components/sims/kit/`), use antes de criar algo seu
- `palette.ts`: `C` (glucose âmbar = carboidrato; glycogen violeta = estoque; fructose rosa; fat lima; lactate ciano; insulin azul; protein laranja escuro; risk vermelho; ok verde; co2 ardósia; caveat/stone neutros), `PANEL_BG`, `BODY_FONT`.
- `ui.tsx`: `StepTabs` (abas do passo; opcional, só se ajudar), `Panel`, `Chip`, `Source`, `SvgText` (texto SVG com contorno; size ≥ 16).
- `Beat.tsx`: `Beat` (frase do passo trocando com esmaecimento), `Wipe` (revelação por clip-path), `Grow` (barra por scaleX/scaleY).
- `Tank.tsx`: o tanque de glicogênio (símbolo recorrente). `cast.ts`: `CAST`, `castOf('marina')` (fonte única dos 5 personagens; ícone lucide).
- `Stamp.tsx`: `Stamp` (carimbo mito/verdade/depende com mola) e `BigStat` (número-chave com legenda).
- `useMorphPath.ts`: `useMorphPath(points)` devolve o ref de um `<path>` que se transforma; `toPath`, `sample`.
- `CountUp.tsx` (`CountUp`, `CountSvgText`), `ForestPlot.tsx`, `format.ts` (`br`, `pct`, `signed`: vírgula decimal), `useTween.ts`.
- `chips.tsx`: os selos de honestidade.
- Movimento: `src/lib/motion.ts` (`EASE_OUT`, `EASE_IN_OUT`, `DUR`, `stagger`). Use só esses tokens; mola só para coisas que "pousam" (carimbo, chip que troca de lugar).

## Regras técnicas
- Um arquivo por slide em `src/components/sims/<Nome>.tsx` (export default, SEM props), com o nome EXATO do roteiro. Peças auxiliares em `src/components/sims/ato<N>/`. Arquivos de até ~250 linhas; texto e dados em `ato<N>/<nome>.content.ts`.
- Passos: `const { step, setStep } = useSlideSteps(N)` (`src/store/useSlideSteps.ts`). O passador SEMPRE avança a história; mouse é extra. Normalmente 3–5 passos.
- Caixa do simulador: largura **1136 px de projeto**, altura **≤ 516 px**. O título e o subtítulo do slide ocupam o resto do palco 1280×720. Nada rola nem estoura.
- Dentro de SVG com viewBox: proporção do viewBox = proporção da caixa, fonte ≥ 16 (o viewBox encolhe o texto junto). Prefira texto em HTML sobre o SVG quando der.
- Animação só por transform, opacity e clip-path (e `d` imperativo via `useMorphPath`). NÃO anime atributo geométrico de SVG (r, cx, d, width) com keyframes do framer: dá "Expected length, undefined". Para posição em %, use wrapper de largura zero com `x` em `cqw` e `[container-type:inline-size]` no trilho.
- Tudo o que um passo dispara termina em ≤ 1,2 s. Sem `AnimatePresence mode="wait"` em texto de passo (use `Beat`). Respeite `useReducedMotion()`.
- Lint: `react-hooks/refs` (não ler `.current` no render), `react-hooks/static-components` (não crie componente dentro de render), `react-hooks/immutability` (não mute props).
- Imutabilidade, nomes claros, comentários curtos em português na densidade do kit.
- NÃO edite nada fora do seu escopo (kit, deck, presentation, data, outros atos). Se faltar uma peça, crie na sua pasta `ato<N>/`.

## Entregáveis do seu ato
1. Os simuladores (`.tsx`) do seu ato.
2. `docs/fragmentos/ato-<N>.json` (N em algarismo arábico: 1…10): array na ordem do roteiro, um objeto por slide:
   `{"id": <id>, "sectionName": "Ato <romano> · <nome do ato>", "number": "", "layout": "prose", "title": "...", "subtitle": "...", "content": "[[COMP:Nome]]<h4>Fontes</h4><ul><li>Citação completa — o que o slide usa dela.</li>…</ul>", "cards": []}`.
   Citação: `Autor AB et al. Título. Revista Ano;Vol(N):páginas.` (com DOI ou PMID se o dossiê tiver). Título do slide = o do roteiro; subtítulo = a pergunta ou tese do slide (1 linha, ≤ 90 caracteres).
   Slide de citação (sem simulador): `"title": ""` e `"content": "<p class=\"quote-text reveal\">… <span class=\"hl-glucose\">…</span></p>"` (classes `hl-glucose`, `hl-glycogen`, `hl-fat`, `hl-fructose`, `hl-lactate`, `hl-insulin`, `hl-protein`).
   A capa (id 0) NÃO entra em fragmento: ela já existe.
3. `docs/fragmentos/ato-<N>.notas.json`: `{ "<id>": { "minutos": n, "mensagem": "...", "pergunta": "...", "transicao": "..." } }`. `mensagem` = o que o professor precisa dizer (2–4 frases, com os números e o desenho do estudo); `pergunta` = gancho para a turma (no chat da chamada); `transicao` = a frase que leva ao próximo slide. `minutos` = o do roteiro.

## Verificação obrigatória (antes de responder)
1. Suba seu servidor em segundo plano na SUA porta: `node node_modules/vite/bin/vite.js --port <PORTA> --strictPort` (no diretório do projeto). Derrube-o no fim.
2. Para cada simulador: `node scripts/qa/sim-check.mjs <Nome> <PORTA> <pasta-de-capturas> 1280x720` e de novo com `1920x1080`. Zero erro de console, zero estouro, zero texto < 14 px. A bancada `?sim=Nome` mostra o simulador dentro do slide real.
3. ABRA (ferramenta Read) a captura de TODOS os passos de cada simulador e olhe de verdade: hierarquia, legibilidade a distância, nada sobreposto, cara de aula de pós (não de painel genérico), ≤ 35 palavras por passo, nenhum brilho ou degradê. Renderizar não é olhar. Corrija e capture de novo.
4. `npx tsc -b` e `npx eslint <seus arquivos>` limpos nos SEUS arquivos (erros de outros atos em construção não são seus).
5. Resposta final em ≤ 20 linhas: arquivos criados, o que cada sim faz em 1 linha (e qual recurso visual usa), resultado das checagens, pendências e dúvidas de conteúdo.

## Ajustes de conjunto (revisão de 11/11, valem para todos os atos)
- **Altura:** o palco agora tem piso de 701 px de projeto para todo slide de conteúdo (mesma escala, título sempre no mesmo lugar). O slide inteiro (cabeçalho + simulador + fontes) precisa caber em 701; a caixa do simulador segue ≤ 516.
- **Selo de desenho e fonte, num lugar só:** `DesignChip` (e os outros selos do passo) no canto SUPERIOR DIREITO, alinhado com a frase-chave; a linha `Source` no rodapé, à ESQUERDA, largura total. Não repita no conteúdo um selo que já está no topo.
- **Esmaecer:** o que perde o foco fica com opacidade ≥ 0,6 (o `Panel` do kit já usa 0,6). No último passo, ou fica legível, ou sai da tela.
- **Cor = significado:** âmbar carboidrato, violeta glicogênio, rosa frutose, lima gordura, ciano lactato, azul insulina, laranja-escuro proteína, vermelho risco, verde ok. O que não é nenhum desses (cetona, placebo, dia de treino, escore de aparelho, "train low") usa neutro (`C.stone`, `C.caveat`, `C.co2`) ou o branco.
- **Tecla 3:** use `Model3DHint` (kit) — nunca um chip próprio.
- **Sem número de slide no texto visível** ("veja o slide 124"): os ids não são a posição na aula. Cite pelo título ("no slide do Supernova").
- **Sem sombra/halo próprios:** o `drop-shadow` do contêiner foi removido; não recrie com text-shadow/box-shadow/filter.
- **Bordas:** ≥ 2 px (o `Panel` do kit passou para 2 px; confira se algo apertado estourou 2 px).
