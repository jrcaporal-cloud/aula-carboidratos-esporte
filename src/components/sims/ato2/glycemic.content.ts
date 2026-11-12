import { C } from '../kit/palette';
import { sample, type Pt } from '../kit/useMorphPath';

/**
 * Slide 29 · Índice Glicêmico: o Que Ele Mede. Fonte única dos textos e das curvas.
 * JENKINS1981 (62 alimentos, 5–10 voluntários, 2 h em jejum; médias por grupo; gordura e proteína baixam a curva)
 * · ATKINSON2021 (tabelas: produto e processamento) · BURDON2017 (faixas ≤ 55 e ≥ 70).
 * As curvas são DIDÁTICAS (forma inventada, rotulada): a área sob cada uma bate com o IG médio do grupo.
 * Curva incremental: g(t) = A · (t/τ) · e^(1 − t/τ), de 0 a 120 min.
 */
export const W = 680, H = 424;
export const X0 = 74, X1 = 660;
export const BASE = 232;
const AMP = 168, N = 49;

const shape = (tau: number) => (t: number): number => (t / tau) * Math.exp(1 - t / tau);
const auc = (f: (t: number) => number): number => {
    let s = 0;
    for (let t = 0; t <= 120; t += 1) s += f(t);
    return s;
};
const REF = auc(shape(32));

const mapPt = (t: number, v: number): Pt => [X0 + ((X1 - X0) * t) / 120, BASE - AMP * v];

/** Curva com área = `gi`% da área da glicose. Devolve a linha, a área fechada e o pico (para o rótulo). */
const curve = (gi: number, tau: number) => {
    const f = shape(tau);
    const a = ((gi / 100) * REF) / auc(f);
    const line = sample(N, 0, 120, t => a * f(t), mapPt);
    const area: Pt[] = [[X0, BASE], ...line, [X1, BASE]];
    const peak = line.reduce((p, q) => (q[1] < p[1] ? q : p));
    return { line, area, peak };
};

export interface Food { name: string; gi: number; line: Pt[]; area: Pt[]; peak: Pt }

export const FOODS: readonly Food[] = [
    { name: 'glicose', gi: 100, ...curve(100, 32) },
    { name: 'cereal matinal', gi: 65, ...curve(65, 38) },
    { name: 'leguminosa seca', gi: 31, ...curve(31, 52) },
];

export const TICKS = [0, 30, 60, 90, 120].map(t => ({ t, x: X0 + ((X1 - X0) * t) / 120 }));

/** Régua do IG médio por grupo (Jenkins 1981). `row`: 0 = acima da régua, 1 e 2 = abaixo. */
export const GROUPS: readonly { name: string; gi: number; row: 0 | 1 | 2; anchor: 'start' | 'middle' | 'end' }[] = [
    { name: 'leguminosas', gi: 31, row: 0, anchor: 'end' },
    { name: 'laticínios', gi: 35, row: 1, anchor: 'start' },
    { name: 'frutas', gi: 50, row: 0, anchor: 'middle' },
    { name: 'cereais e biscoitos', gi: 60, row: 2, anchor: 'middle' },
    { name: 'cereais matinais', gi: 65, row: 0, anchor: 'start' },
    { name: 'vegetais', gi: 70, row: 1, anchor: 'start' },
    { name: 'glicose', gi: 100, row: 2, anchor: 'end' },
];

/** Carga glicêmica = IG × gramas de carboidrato da porção ÷ 100 (cálculo pela definição). */
export const cg = (gi: number, grams: number): number => Math.round((gi * grams) / 100);

export interface GiStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    /** Alimento cuja curva está cheia no palco. */
    food: number;
    sources: readonly string[];
}

export const GI_STEPS: readonly GiStep[] = [
    {
        tab: 'Definição', headline: 'A área da glicose vale 100', color: C.glucoseSoft, food: 0,
        text: 'Jenkins 1981: 62 alimentos, cada um testado em grupos de 5 a 10 voluntários em jejum. Mede-se a glicemia por 2 h depois de uma porção com a mesma quantidade de carboidrato que a glicose de referência. O IG é a área sob a curva do alimento como porcentagem da área da glicose.',
        sources: ['Jenkins 1981'],
    },
    {
        tab: 'Cereal', headline: 'Cereal matinal: 65% da área', color: C.glucose, food: 1,
        text: 'A mesma quantidade de carboidrato num cereal matinal sobe menos e mais devagar: a área fica em 65 ± 5% da glicose. O que muda não é o carboidrato, é a velocidade com que ele chega ao sangue (o slide “Da Boca ao Sangue”: amido, enzimas, portas).',
        sources: ['Jenkins 1981'],
    },
    {
        tab: 'Leguminosa', headline: 'Leguminosa seca: 31', color: C.glucose, food: 2,
        text: 'Leguminosas secas ficaram em 31 ± 3%, o mais baixo dos grupos. Na régua de Jenkins, a resposta caiu com a gordura (P < 0,01) e com a proteína (P < 0,001) do alimento, e não com a fibra nem com o açúcar. Limites: grupos pequenos e método anterior à padronização ISO.',
        sources: ['Jenkins 1981'],
    },
    {
        tab: 'Produto', headline: 'O IG é do produto, não do grupo', color: C.caveat, food: 2,
        text: 'As tabelas de 2021 reúnem mais de 4.000 itens (+61% desde 2008), ~2.100 medidos pelo método ISO. Pães, cereais matinais e arroz existem em versões de IG alto, médio e baixo: manda a fabricação. Laticínios, leguminosas, massas e frutas tendem a ≤ 55; a maioria das batatas fica alta.',
        sources: ['Atkinson 2021 (revisão sistemática)', 'Burdon 2017 (faixas)'],
    },
    {
        tab: 'Carga', headline: 'Carga glicêmica: qualidade × quantidade', color: C.glucose, food: 2,
        text: 'O IG fixa a porção pela quantidade de carboidrato; o prato real não. A carga glicêmica multiplica o IG pelos gramas da porção e divide por 100. O mesmo cereal de IG 65 dá 13 com 20 g e 39 com 60 g. Arraste a porção.',
        sources: [],
    },
    {
        tab: 'Limite', headline: 'Mede o sangue parado, não a prova', color: C.glucoseSoft, food: 2,
        text: 'O IG responde a uma pergunta só: quanto a glicemia sobe em quem está parado e em jejum. Se ele prevê o desempenho é outra pergunta, que volta em “A Refeição de 3–4 Horas” e no “Mito ou Verdade?”.',
        sources: [],
    },
];
