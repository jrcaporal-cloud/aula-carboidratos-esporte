# Refação slide a slide (12/11/2026) — instrução comum dos agentes

O professor (Rinaldo Caporal, nutricionista; aula de pós ONLINE por videochamada) olhou a aula "Carboidratos no Esporte" e achou os slides
pobres: "eu quero slides mais ricos em detalhes, animações e transições melhores, parecido com o que você fez nas aulas de nitrato,
tamponantes e doping". Ele aprovou o protótipo da Glicólise e liberou loops (com limites). Sua tarefa: REFAZER os simuladores do seu grupo
nesse padrão. Não é polimento: é refazer a composição para ficar no nível de detalhe e de impacto das aulas de referência.

Projeto: `/Users/mac/projetos claude/aula-carboidratos-esporte`.

## Leia antes de começar (de verdade)
1. `docs/BRIEF-CONSTRUCAO.md` inteiro (regras de videochamada, conteúdo, técnica, "Formato palco + painel" e "Refação de 12/11 — trabalho em paralelo").
2. A referência viva: `src/components/sims/GlycolysisSim.tsx` + `ato3/GlycolysisMap.tsx` + `ato3/glycolysis.content.ts`.
3. Referências externas (abra 3–4 simuladores de cada e capture 1 ou 2 com o servidor delas se quiser ver: nitrato roda em `http://localhost:5368/aula-nitrato-esporte/?sim=<Nome>` e tamponantes em `http://localhost:5367/aula-tamponantes-esporte/?sim=<Nome>`, versões compiladas): `/Users/mac/projetos claude/aula-nitrato-esporte/src/components/sims/` (ex.: EnterosalivarySim, CascadeSim, OxygenCostSim, NitriteReductasesSim, PharmacokineticsSim) e `/Users/mac/projetos claude/aula-tamponantes-esporte/src/components/sims/`. Repare: abas com nome, palco grande com mecanismo desenhado com rigor, painel com título colorido + texto de pós + dado-chave + selos + fonte, quadro final rico.
4. A revisão slide a slide `docs/REVISAO-VISUAL-2026-11-12.md` (procure seus slides pelo TÍTULO; os "sNN" são posição, não id): ela lista o detalhe que falta, com fonte, e a ideia de wow.
5. Para cada slide seu: o simulador atual e o `ato<N>/*.content.ts` dele, as notas em `docs/fragmentos/ato-<N>.notas.json` (campo "mensagem" = o que o professor fala, com os números) e o fragmento `docs/fragmentos/ato-<N>.json` (fontes do slide), e os dossiês em `docs/dossie/` que ele cita (FONTE ÚNICA dos números; nada `[NÃO CONFIRMADO]` nem da seção "Não citar"), e `docs/ROTEIRO.md` na parte do seu ato.
6. Skills de visual: `~/.claude/skills/emil-design-eng/SKILL.md` e `~/.claude/skills/impeccable/reference/craft-floor.md` + `reference/animate.md`.

## O padrão (resumo; o BRIEF manda)
- Abas com nome (`StepTabs`) + selos à direita; palco à esquerda ~55–62% com a arte/mecanismo/gráfico desenhado com rigor (eixos com unidade, nomes de enzimas/transportadores, desenho do estudo); painel à direita com título colorido do passo, texto de pós (n, desenho, resultado, limitação), dado-chave (CountUp/KeyFact/BigStat) ou livro-caixa/tabela, fonte acumulada no pé (`sourcesUpTo`).
- O ÚLTIMO PASSO ACUMULA: nada do que foi mostrado some. Densidade de pós (~300–450 palavras na tela no fim). Sem teto de palavras.
- Animação com propósito a cada clique (≤ 1,2 s): a molécula percorre o trecho novo, a linha se desenha, a barra cresce, o número conta. Loop permitido SÓ para um fluxo que é o conteúdo (regras no BRIEF).
- Varie a composição entre slides vizinhos (nem todo slide precisa ser 60/40 idêntico: há gráfico grande + painel, tríptico, linha do tempo + painel, mapa + livro-caixa…), mas sempre com o painel explicativo e a riqueza de pós.
- Mesmos nomes de componente (o deck carrega `[[COMP:Nome]]`). Mantenha a altura do simulador ≤ 516 px de projeto e a largura 1136.
- Caso fictício (Marina, Diego, Lara, Tiago, Paulo) sempre com `FictionChip`. Sem protocolo de doping.

## Verificação obrigatória
- `node scripts/qa/sim-check.mjs <Nome> 5360 <pasta-sua-em-/private/tmp/claude-501/...-ou-scratch> 1280x720` e depois `1920x1080`: zero erro de console, zero estouro, zero texto < 14 px.
- ABRA com Read a captura de TODOS os passos de cada simulador e olhe como o professor olharia no projetor: legível a distância, nada sobreposto, nada cortado, detalhe de pós, quadro final rico, sem brilho/degradê. Corrija e capture de novo. Renderizar não é olhar.
- `npx tsc -p tsconfig.app.json --noEmit` limpo nos SEUS arquivos; `npx eslint <seus arquivos>` limpo.
- Remendos de título/subtítulo/fontes/notas em `docs/fragmentos/_remendos/<id>.json` (formato no BRIEF). Atualize a "mensagem" das notas quando a tela ganhar número novo, para o professor saber o que falar.

## Resposta final (≤ 15 linhas)
Para cada slide: o que mudou (composição, recurso visual, quantos passos) e o número de palavras aproximado no quadro final; checagens; remendos gravados; dúvidas de conteúdo (fonte não confirmada etc.).
