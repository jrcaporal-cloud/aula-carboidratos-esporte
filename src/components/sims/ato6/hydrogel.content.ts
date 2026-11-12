/**
 * Slide 108 · Formato e Hidrogel. HEAR2022, PFEI2010G, SUTEHALL2020 (repouso), SUTE2022, MCCU2020, ROWE2022 e os
 * nulos da tabela K (Baur 2019, Mears 2020), dossiê 03, blocos E e K. Rowe 2022 é POSITIVO: nunca chamar de nulo.
 */

/** Hearris 2022: pico de oxidação exógena a 120 g/h por formato (g/min; diferença ns). */
export const FORMATS = [
    { name: 'bebida', ox: 1.56, text: '1,56' },
    { name: 'gel', ox: 1.58, text: '1,58' },
    { name: 'goma', ox: 1.59, text: '1,59' },
    { name: 'combinação', ox: 1.66, text: '1,66' },
] as const;

/** Eixo das barras de oxidação (g/min). */
export const OX_MAX = 1.8;

/** Sutehall 2020: meia-vida de esvaziamento gástrico em repouso (min). */
export const EMPTYING = [
    { label: 'hidrogel', min: 21 },
    { label: 'bebida', min: 37 },
] as const;

/** A pilha de nulos da balança (de baixo para cima) e o positivo isolado. */
export const NULL_PILE = [
    'meta-análise',
    'McCubbin 2020',
    'Mears 2020',
    'Baur 2019',
] as const;

export interface HydroStep {
    tab: string;
    headline: string;
    text: string;
    chip: string;
    sources: readonly string[];
}

export const HYDRO_STEPS: readonly HydroStep[] = [
    {
        tab: 'Formato',
        headline: 'O formato não mexe na oxidação',
        text: 'Hearris 2022: 9 treinados, 120 g/h de maltodextrina/glicose + frutose (1:0,8) por 180 min, em bebida, gel, goma ou tudo junto. Pico de oxidação exógena igual (ns), eficiência de 72–75%, sintomas mínimos. Pfeiffer 2010, 108 g/h: gel com água = bebida.',
        chip: 'medidas repetidas · n = 9 · ¹³C',
        sources: ['Hearris 2022, J Appl Physiol', 'Pfeiffer 2010, MSSE'],
    },
    {
        tab: 'No estômago',
        headline: 'Hidrogel: um mecanismo plausível',
        text: 'Alginato de sódio e pectina na bebida viram gel no ácido do estômago. Em repouso, o esvaziamento foi mais rápido (meia-vida de 21 × 37 min), sem mudar a glicemia. É um mecanismo medido sem exercício: ainda não é desempenho.',
        chip: 'mecanismo · medido em repouso',
        sources: ['Sutehall 2020, MSSE'],
    },
    {
        tab: 'Meta-análise',
        headline: 'Na meta-análise, nada se move',
        text: 'Sutehall 2022, contra bebida isocalórica: desempenho p = 0,59 (5 estudos, I² = 0%), oxidação p = 0,71 e glicemia p = 0,66 (7 estudos). McCubbin 2020, com placebo pareado: sintomas GI em 100% nos dois braços. Vários estudos usaram intensidade baixa demais.',
        chip: 'meta-análise · 5–7 estudos · I² = 0%',
        sources: ['Sutehall 2022, Sports Med Open', 'McCubbin 2020, IJSNEM', 'Mears 2020 · Baur 2019'],
    },
    {
        tab: 'O positivo',
        headline: 'Um positivo contra a pilha',
        text: 'Rowe 2022, duplo-cego, 11 corredores, 90 g/h por 120 min e depois 5 km: hidrogel 2,1% mais rápido que a solução comum (19:29 × 19:54; p = 0,033), oxidação exógena 68,6 × 63,4 g. Real, mas isolado: mecanismo plausível não é efeito medido.',
        chip: 'ECR cruzado · n = 11 · duplo-cego',
        sources: ['Rowe 2022, MSSE'],
    },
];

/** Livro de estudos: entra no passo `at` e fica. */
export const HYDRO_LEDGER = [
    { at: 0, study: 'Hearris 2022', n: 'n = 9', result: '4 formatos: ns', tone: 'null' },
    { at: 0, study: 'Pfeiffer 2010', n: 'n = 8', result: 'gel 1,44 × bebida 1,42', tone: 'null' },
    { at: 1, study: 'Sutehall 2020', n: 'repouso', result: 't½ 21 × 37 min', tone: 'mech' },
    { at: 2, study: 'Sutehall 2022', n: '5–7 est.', result: 'p = 0,59 · 0,71 · 0,66', tone: 'null' },
    { at: 2, study: 'McCubbin 2020', n: 'n = 9', result: '722 × 756 s, ns', tone: 'null' },
    { at: 3, study: 'Rowe 2022', n: 'n = 11', result: '+2,1% nos 5 km', tone: 'pos' },
] as const;
