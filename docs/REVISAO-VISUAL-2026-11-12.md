# Revisão visual geral — 12/11/2026

Base: capturas do último passo dos 97 slides (1280×720), comparadas com a aula de tamponantes; notas, `*.content.ts` e dossiês lidos. R = riqueza técnica, I = impacto visual (1–5). Esforço P/M/G. Todo número abaixo sai das notas, dos content.ts ou dos dossiês.

## Diagnóstico

- ~105 palavras de tela por slide (tamponantes ~390, nitrato ~460). Causa: regra "≤ 35 palavras por passo" do BRIEF (l.33 e l.78) — revogar.
- **O último passo apaga os anteriores** (`step === n` troca o conteúdo). O quadro final fica mais pobre que o meio do slide. As notas têm 2–4× mais dado que a tela.
- Sem painel explicativo, sem abas com nome ("Passo 3 de 3" no lugar), desenho do estudo só em selo pequeno, metade da tela vazia em vários finais, mecanismo virou ícone.
- Capturas de QA foram tiradas com contadores ainda animando → a checagem precisa esperar o fim da contagem.

## Erros de conteúdo achados (corrigir de qualquer jeito)

- s34 O Muro em Números: curva da Marina nos passos 3–4 sem o selo "caso fictício".
- s90 Glicose Contínua: curva sem selo "ilustrativa" na tela (só no aria-label).
- s46 82% dos Ensaios: grade de 61 (Stellingwerff) com selo "88 estudos" (Vandenbogaerde) — parece o mesmo conjunto.
- s50 120 g/h: fonte do último passo cita Viribay/Morton, mas as barras são Ravikanti e o 2,15 × 2,20 é Podlogar. s52 idem (formatos somem, fonte de um passo só).
- s33 Fígado: selo "valores ilustrativos" ao lado do ~24, que é dado real.
- s81 Calor e Altitude: termômetro em 16 °C sobrando no fim, sem dado.
- s17 Glicólise: "+4 ATP" num degrau só (sai em dois); NAD⁺ devolvido sem NADH consumido.
- s32 Cálcio: linhas diagonais ligando barras sem relação.
- s94 Mito ou Verdade: 7 "mito", 1 "?", nenhuma "verdade" — o título promete o que não entrega.

## Padrão proposto para toda a aula (palco + painel)

Abas de passo com nome no alto · palco 60–65% à esquerda (o visual de hoje) · painel 35–40% à direita: conclusão em negrito 24–28 px, 35–60 palavras com o estudo (n, desenho, IC), uma linha de limitação, fonte · faixa de conclusão fixa no rodapé · **o último passo acumula tudo** · meta ~200–300 palavras no fim do slide, corpo ≥ 18 px, cores chapadas. Texto já pronto no campo "mensagem" das notas e nas seções "Limitações"/"Ponto de ensino" dos dossiês.

## Propostas de conjunto (wow)

1. Abertura de ato como slide de verdade: numeral enorme, a pergunta do ato, o personagem, o papel aceso (Combustível/Sinal/Escolha), mapa dos 10 atos. M
2. Barra de progresso = maratona 0–42 km; bate no muro no km 32 (~fim do Ato VIII) e cruza a chegada no s97. P–M
3. Chip do papel (Combustível/Sinal/Escolha) em cada slide — o s03 promete isso. P
4. Ritmo: citação de fecho em cada ato (V a IX hoje não têm) + 2 checagens com pergunta no chat. P
5. Um pico por ato: V carga em 24 h; VII fígado transbordando; VIII Supernova; IX as três mortes de 1997 (dossiê 06); X placebo. M
6. 3D no fluxo, não só na tecla 3: zoom corredora → coxa → fibra → grânulo no Ato II; enterócito aberto no s49; fibra no s58 e s75. G
7. Mais votação (mecanismo do s13): palpite no km 32, no placebo e no CGM; placar turma × evidência no s94. M
8. Cold open: a aula começa no km 32, depois a capa. P
9. Fecho: s97 volta ao km 32, a Marina (fictícia) passa inteira; s95 os 5 tanques do s04 voltam e enchem. M

## Por slide

### Atos I–III (s01–s25)
- s02 O Km 32 (R3 I3): grade de 100 corredores, 28 acendem, depois 17. P
- s03 Três Papéis (R2 I2): miolo vazio; mini-diagrama por card (21,1 × 19,6 kJ/L; Impey 8/11 × 4/11; régua 3–12 g/kg). P
- s04 Cinco Tanques (R1 I3): pergunta fisiológica e ato de retorno sob cada tanque. P
- s07 Da Glicose ao Amido (R2 I3): C₆H₁₂O₆, α-1,4/α-1,6, amilose × amilopectina, "oxidam 25–50% menos"; morph que acumula. M
- s08 Claude Bernard (R2 I3): caderno reconstituído 1848 → 1855 → 1857 (paráfrase, Jörgens 2013). M
- s09 Grânulo (R4 I4): glicogenina 10–20 resíduos, ~55.000 glicoses, fosforilase para a 4 do ramo; no 3D a fosforilase "come" a casca. M
- s10 Leloir (R3 I3): Ca²⁺ → calmodulina → fosforilase quinase; glicogênio cheio inibe a sintase; botão "uma enzima só" = ciclo fútil. M
- s11 Quanto Cabe (R3 I3): pull-back da colher de 4 g ao fígado, músculo, gordura; ~4 × ~5 g. P
- s12 Da Boca ao Sangue (R2 I2): enterócito que se monta e não apaga (amilases, dissacaridases, SGLT1+Na⁺, Na⁺/K⁺-ATPase, GLUT5, KHK, GLUT2). M
- s13 Duas Pistas (R4 I4): 1,8 g/min → 0,83 × 1,2 → 0,80 (Jentjens 2004). P
- s14 Frutose e Galactose (R2 I3): título fala de frutose, fim só galactose; 45% oxidada, 41% vira glicose, ~¼ lactato, ~90% depurada no intestino; 3 medidores. M
- s15 IG (R3 I3): régua de Jenkins + carga glicêmica com slider de gramas. P
- s16 GLUT4 (R3 I2): duas cascatas (insulina/PI3K × contração/Ca²⁺/AMPK/Rac1 "em debate"), vesículas à membrana e túbulos T; Lund 5,6/9,0/11,5. M
- s17 Escada da Glicólise (R2 I2): **pior caso**. 10 degraus com enzima, ATP/NADH no degrau certo, 3 portões irreversíveis, circuito NAD⁺⇄NADH pelo LDH, entrada G-1-P do s10. Enzimas/NADH precisam entrar no dossiê com livro-texto. G
- s18 Lactato (R3 I4): 1,1× / 2,5× (Hui 2017); nomear ciclo de Cori. P
- s19 Cruzamento (R4 I4): sobrepor pontos medidos de van Loon (32 → 19 kJ/min). P
- s20 Gordura Trava (R3 I3): 55% × 75% lado a lado, carnitina livre → acetilada, PDH 0,53 → 3,33 (Howlett). M
- s21 Preço do O₂ (R2 I2): FADH₂ P/O 1,5 × NADH 2,5; Burke 2017 +6,6/+5,3/−1,6% (ou só gancho p/ Ato VIII). M
- s22 Fígado (R3 I3): 2× × 7–8× produção e 3–4× consumo; torneira/ralo proporcionais; selo "Marliss 2002". P
- s23 Boston (R2 I3): <4 mmol/L; 200 g, n=2; selo de evidência crescendo por marco. P
- s24 Resgate (R3 I3): tríptico músculo × sangue × cérebro; raias de Coggan 10/26/43 min. M

### Atos IV–V (s26–s44)
- s26 Agulha (R3 I4): zoom coxa → fragmento → lâmina PAS → grânulo; Hultman Nature 1959. M
- s27 Bicicleta (R3 I4): selo "Nature 1966 · autoexperimento · n=2". P
- s28 Três Dietas (R3 I3): fim apaga a dispersão r=0,92; caderno de 1967, reta y=41,6x+36,8, limitações como carimbos, resumo 59/126/189 riscado → tabela 57/114/167. M
- s29 Régua (R2 I1): **pior do bloco**. Morph escala 1967 → 2018 (204 mmol/kg úmido); ±132; +200 → +104; mulheres −30, corrida −70; controle de VO₂máx (+67 por 10 mL/kg/min). Não converter p/ peso seco (fator não confirmado). M
- s30 Gollnick (R3 I4): cortes ATPase × PAS lado a lado; voto por intensidade com botão ">100%". M
- s31 Endereços (R3 I3): zoom com barra de escala cm → µm → nm até a tecla 3. G
- s32 Cálcio (R3 I3): curso no tempo antes → fim → +4 h → +22 h, braço 540→167 × perna 485→331; r=0,30 → 9 de 100 quadrados. M
- s33 Fígado 2º limite (R2 I3): fígado 325→345 × 454→283, músculo 101→60 (Gonzalez 2015). M
- s34 Muro (R3 I4): ~40% por ~10 km, 36% × 23%, >4 milhões de registros. P
- s35 Sinal (R2 I3): funil Impey 73/75/78% → 37%. P
- s37 Escandinava (R3 I4): quem começa cheio gasta mais (5,0–5,1 × 3,1 mmol/kg/km); calendário vira linha do glicogênio. M
- s38 24 h (R2 I3): IC 212–327 × 61–252; efeito menor com basal alto. M
- s39 Rende (R4 I4): 259 × 253 W. P
- s40 Mulher (R3 I4): tempo +45% × +5%; barras em % viram g/kg. P
- s41 Refeição (R2 I3): números pendurados na hora (+42%, 0/45/156/312, 136 × 109 min), veredito de Aird. P
- s42 Rebote (R3 I4): hipoglicemia 2/3/5 de 8, Foster −19%, Kuipers 6 de 19, carimbo "não se repetiu". P
- s43 IG antes (R2 I3): IG 82 × 35, 0,18–2 g/kg, efeitos com × sem CHO durante. P
- s44 Marina (R3 I3): prato 101 g × pilha 578 g em escala; turma troca alimentos. M

### Atos VI–VII (s45–s64)
- s45 Gainesville (R2 I3): Douglas → Shires → Cade, urina, limão, 14×7 LSU; linha do tempo acumulada. P
- s46 82% (R2 I3): corrigir selo; 0,7 + 0,2 + 0,2 g/kg/h; frutose > 0,25 reduz; grade se reordena por duração. P
- s47 Smith (R3 I4): 51 sujeitos, 12 doses, 4 ensaios cada; matriz de blocos incompletos vira a curva. M
- s48 Teto (R3 I3): 25–50% menos; funil 144 g/h → 71 (49%). Conferir atrito com Cox 2010 (s53). M
- s49 Quebrando o Teto (R3 I4): selo "curva composta"; retomar o enterócito 3D e só abrir a 2ª pista; 1,75 = 1:1. M
- s50 120 g/h (R3 I3): corrigir fonte; custo de O₂ −8,1 mL/kg/km (Ravikanti 2025); Hearris. P
- s51 Pelotão (R3 I4): 49% da energia na etapa, 6,7 L/dia. P
- s52 Hidrogel (R3 I3): 4 formatos 1,56–1,66 no fim; balança 1 positivo × pilha de nulos. P
- s53 Intestino Treina (R3 I3): Costa 2017 −60%, H₂ 13 → 6 ppm, +5,2% × −2,1%. M
- s54 Bochecho (R2 I3): tríptico seringa 59,90×60,04 → bochecho 59,57×61,37 → corte sagital com as regiões. M
- s55 Tamanho Real (R1 I2): forest plot crescendo (SMD 0,25 [0,04–0,46], Lane, De Ataide 9/11, nulos). M
- s56 Relógio (R2 I3): faixas no fim, g/h absolutos, ISSN ultra 30–50 g/h, Marina e Diego no mostrador. M
- s57 Vida Real (R4 I4): r = −0,55, faixa 6–136 g/h. P
- s58 Janela (R2 I3): 7,7/2,5/4,1 e 45% de Ivy; fase rápida sem insulina 30–60 min; fibra 3D. M
- s59 Quatro Horas (R2 I3): tanques 269 e 157 até o piso 72–78; cronômetro 48 × 80 min. M
- s60 Proteína (R2 I3): tríade van Loon 16,6/35,4/44,8; Margolis g 0,26 × −0,05; enquete "substitui ou soma". P
- s61 24 Horas (R2 I3): braço deslocado 68×82; forma 198×192, refeições 74,1×94,5, IG 106×71,5; tabela importa/não importa. P
- s62 Fígado Sacarose (R4 I4): Décombaz 8,1/8,6 × 3,7 g/h; Casey +25 × +13 g. P
- s63 Fuchs 2025 (R3 I4): braço em jejum e valores de antes 159/166. P
- s64 Lara (R3 I3): 193/328 × 449 mmol/kg; 32,3 g/h no jogo; faixa 6–10 g/kg/d. P

### Atos VIII–IX (s65–s84)
- s65 Perna com Fome (R2 I3): protocolo Hansen; Bartlett 467×103, p-ACC, p-p53; cascata AMPK → p53 → PGC-1α. M
- s66 Músculo ao Cronômetro (R3 I4): Yeo 2008 CS 45→54, β-HAD 18→23; linha do tempo 2005 → 2021 "até o nulo". M
- s67 Sleep Low (R2 I3): Marquet −2,9 × −0,1%, gordura −8,5 × −2,6%, Gejl, Riis, 6 g/kg/d; relógio de 24 h. M
- s68 Combustível p/ o Trabalho (R3 I4): régua de Areta 462/+102/−253. P
- s69 Promessa da Gordura (R3 I3): desenho sob as barras (Volek transversal 10×10, sem desempenho; Phinney sem controle). P
- s70 Supernova (R3 I4): 21,1 × 19,6 kJ/L, dietas e n; teto de VO₂ com custo subindo 5–8%; virada da Burke 2006 → 2015. M
- s71 Crise Evitada (R3 I4): SN1, SN2, SN3 lado a lado. P
- s72 Torneira Fechada (R2 I3): **mais raso do bloco**. Mecanismo da PDH desenhado; 2,39 → 1,69; glicogenólise 50,5 → 37,3; PDK4. G
- s73 Cetonas (R4 I3): IC da massa gorda, 18 estudos. P
- s74 Osso (R3 I3): cartões Heikura e Hammond no fim; REDs com duas entradas. P
- s75 47% das Fibras (R3 I4): 449 → 255; zoom na fibra 3D (−72% × −45% intramiofibrilar, Vigh-Larsen 2022). M
- s76 CHO no Jogo (R2 I3): 181 → 111 mmol/kg; 294 × 111 tiros; "+265% é erro de conta"; Krustrup, Anderson. M
- s77 Paulo (R2 I3): barras de glicogênio por tipo de fibra; 13 nulos × 6 positivos (Henselmans 2022); forest plot. M
- s78 Insulina × Síntese (R4 I4): desenho Koopman 2007; "~12×" grande. P
- s79 Balança e Água (R2 I3): 1:3 a 1:17; 2 L de suor → ~55 mL; balança em camadas. M
- s80 Depois da Pesagem (R2 I3): Kondo, judô × boxe; duas réguas de horário; as três mortes de 1997 contadas. M
- s81 Calor e Altitude (R2 I2): Jentjens +25/−10%, Febbraio, Péronnet 92 × 78%; mostrador de dois ponteiros. M
- s82 Mulheres e Jovens (R2 I2): Wallis, McNulty, Tarnopolsky 1995 → 2001; "% da energia" vira g/kg. M
- s83 DM1 (R3 I4): bolus −25–33%, lanche 10–20 g abaixo de 5,0 mmol/L. P
- s84 Sorriso (R3 I4): Needleman 45% n=278; Gallagher 80%/94%; fecho prático. P

### Ato X (s85–s97)
- s85 Régua (R3 I3): exemplos de sessão; régua da SBME por cima; pratos em gramas reais. M
- s86 SBME (R3 I3): frase literal "não deve exceder 80g/hora" no fim; barra de 90 g/h atravessa a linha. P–M
- s87 Consumo (R4 I3): véspera (Anderson 2017); Ironman 66,7%; prato proteína 87,1% × CHO 45,7%; cor do 45,7% lê mal. P
- s88 Métodos (R3 I4): CV 9,3% × 4,3%; r 0,93 fabricante × independente; comparador invasividade × precisão. M
- s89 Calorimetria (R3 I3): ±0,3 g/min; RER > 1 pelo CO₂ do bicarbonato (ponte com tamponantes). M
- s90 CGM (R3 I2): selo ilustrativa; Thomas 2016 4/10 e 3 pré-diabetes; voto antes. P
- s91 Desenho (R4 I4): CV 26,6% × 3,35% aqui; dois alvos de tiro. M
- s92 Placebo (R3 I5): +0,5%, −1,1%, IC −3,8 a 4,4; três ciclistas. P
- s93 Indústria (R3 I2): Heneghan 431/104/52,8%/84%/3 de 74; 104 frascos, 3 acendem. P
- s94 Mitos (R3 I4): placar turma × evidência, "a turma acertou X de 8". M
- s95 Planos (R4 I3): "com carbo × sem carbo"; tanques do s04 voltam. M
- s96 Mensagens (R3 I3): unidades nos números; miniatura do slide de origem. M
- s97 Fecho (R2 I3): volta ao km 32, a Marina passa inteira. M
