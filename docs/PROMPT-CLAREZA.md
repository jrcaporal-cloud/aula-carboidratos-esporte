# Passada de clareza (12/11/2026) — instrução comum

O professor (Rinaldo; aula de pós ONLINE por videochamada) está achando vários slides CONFUSOS depois da refação. Ele mesmo apontou
"Por que a Gordura Trava no Alto", "O Preço do Oxigênio", "O Resgate pela Veia" e "Três Dietas, Nove Estudantes"; esses quatro já foram
refeitos e são a REFERÊNCIA do que conserta. Leia o código deles antes de começar:
- `src/components/sims/FatBrakeSim.tsx` + `ato3/FatGate.tsx` (uma cena única que muda de estado a cada passo, tudo rotulado, legenda das fichas);
- `src/components/sims/OxygenPriceSim.tsx` + `ato3/OxygenFlow.tsx` e `src/components/sims/RescueSim.tsx` + `ato3/RescueFlow.tsx`
  (cadeia de causa em 4 FAIXAS numeradas, uma por elo, componente comum `ato3/chainStrip.tsx` — `ChainCell` e `ScaleBar`, pode importar);
- `src/components/sims/ThreeDietsSim.tsx` + `ato4/DietChart.tsx` (gráfico como herói; limitações saíram de cima do gráfico para o texto).

## O que deixava confuso (procure isto no seu slide)
1. Dois ou mais estudos com escalas/unidades diferentes no MESMO desenho como se fossem comparáveis.
2. Passo fora da pergunta do título (mova para as notas ou para o slide certo; não precisa mostrar tudo).
3. Fichas, cores, traços, ícones SEM legenda.
4. Painel de números soltos sem a linha de causa ("isso → por isso → logo").
5. Eixo sem unidade, escala errada, rótulo encostando/em cima de outro, desenho apertado.
6. Número que não bate entre palco e painel (confira no content e no dossiê; às vezes é só contador fotografado no meio — aí não é erro).

## O conserto
- UMA ideia por slide, lida na ordem certa em ~10 s: cena única que muda de estado OU faixas numeradas da cadeia de causa.
- Cada elemento com rótulo; cada elo com UM estudo e o desenho dele (n, desenho) — se o estudo é de outra escala, é outro elo, não o mesmo gráfico.
- O painel da direita CONTA a cadeia (título do passo + texto de pós + livro-caixa que acumula), não repete números soltos.
- Continua valendo tudo do `docs/BRIEF-CONSTRUCAO.md` (videochamada: sem brilho/degradê, texto ≥ 16 px, último passo acumula, números só do dossiê,
  selos de honestidade, loops só de fluxo). Densidade de pós continua, mas CLAREZA vem antes de quantidade: pode cortar o que estava sobrando.
- Mesmo nome de componente; caixa ≤ 516 px de altura; não mexa no `Model3DHint` se o slide tiver um.

## Regras de trabalho
- Servidor único já rodando: `http://localhost:5360/aula-carboidratos-esporte/`. NÃO suba outro vite.
- `node scripts/qa/sim-check.mjs <Nome> 5360 <pasta-sua-no-scratchpad> 1280x720` e `1920x1080`: zero estouro, zero texto < 14 px, zero erro.
  ABRA com Read as capturas de TODOS os passos e olhe como o professor olharia. `node scripts/qa/svg-text-scan.mjs` pega SVG encolhido.
- `npx tsc -p tsconfig.app.json --noEmit` (sem -b) e `npx eslint <seus arquivos>` limpos.
- Só os seus slides. Arquivo compartilhado de um ato: confira com grep quem importa antes de editar; se for de outro slide, crie um novo.
- Mudou título/subtítulo/fontes/notas: remendo em `docs/fragmentos/_remendos/<id>.json` (formato no BRIEF; se o arquivo já existe, LEIA e
  edite mantendo o resto). Atualize a "mensagem" das notas quando a tela mudar.

## Resposta final (≤ 12 linhas)
Por slide: o que estava confuso, o que você fez (em 1 linha), checagens; dúvidas de conteúdo.
