import { C } from '../kit/palette';

/**
 * Slide 113 · A Vida Real do Intestino. PFEI2012 (221 atletas em prova, recordatório pós-prova; abstract),
 * DEOL2014 (revisão: queixas em 30–50%), ARRI2021 (revisão sistemática de ultra-trail, 8 estudos). Dossiê 03, G e K.
 */

export interface EventRow {
    id: string;
    name: string;
    mean: number;
    sd: number;
    /** % com sintomas GI graves (Pfeiffer 2012); "~" quando o abstract dá o valor dos dois Ironman juntos. */
    severe: number;
    approx?: boolean;
    ironman?: boolean;
}

export const EVENTS: readonly EventRow[] = [
    { id: 'imh', name: 'Ironman Havaí', mean: 62, sd: 26, severe: 31, approx: true, ironman: true },
    { id: 'ima', name: 'Ironman Alemanha', mean: 71, sd: 25, severe: 31, approx: true, ironman: true },
    { id: '703', name: 'Ironman 70.3', mean: 65, sd: 25, severe: 14 },
    { id: 'bike', name: 'ciclismo 100–150 km', mean: 53, sd: 22, severe: 4 },
    { id: 'mar', name: 'maratona', mean: 35, sd: 26, severe: 4 },
];

/** Eixo de g/h do gráfico. */
export const GH_MAX = 140;
export const GH_TICKS = [0, 30, 60, 90, 120] as const;
/** Faixa individual (todas as provas). */
export const RANGE = [6, 136] as const;
/** Teto da diretriz para provas > 2,5 h (consenso do COI, slide do Relógio da Prova). */
export const GUIDE = 90;
/** Escala da coluna de sintomas (%). */
export const GI_MAX = 100;

export interface GiStep {
    tab: string;
    headline: string;
    text: string;
    color: string;
    chips: readonly string[];
    sources: readonly string[];
}

const PFEIFFER = 'Pfeiffer et al., Med Sci Sports Exerc 2012';

export const GI_STEPS: readonly GiStep[] = [
    {
        tab: 'O que comem', color: C.glucose, chips: ['observacional · n = 221 · recordatório pós-prova'],
        headline: 'Longe dos 90 g/h',
        text: 'Pfeiffer 2012 perguntou a 221 atletas, logo depois da prova, o que comeram e beberam. As médias ficaram entre 35 e 71 g/h, com dispersão enorme: de 6 a 136 g/h entre indivíduos. É recordatório, não medida direta.',
        sources: [PFEIFFER],
    },
    {
        tab: 'Maratona', color: C.glucose, chips: ['observacional · n = 221 · recordatório pós-prova'],
        headline: 'Maratona: ~35 g/h',
        text: 'Na maratona, 35 ± 26 g/h: a menor média das cinco provas e menos da metade do teto da diretriz para provas acima de 2,5 h. No ciclismo de 100–150 km, 53 ± 22; nos Ironman, de 62 a 71 g/h.',
        sources: [],
    },
    {
        tab: 'Sintomas', color: C.risk, chips: ['observacional · n = 221', 'revisão narrativa'],
        headline: 'O intestino cobra',
        text: 'Sintomas GI graves: ~31% nos Ironman, 14% no 70.3, 4% no ciclismo e na maratona, 7% nos ciclistas profissionais. Quem tinha histórico de problema GI teve mais. Revisões estimam queixas de qualquer grau em 30–50% dos atletas, a maioria leve.',
        sources: ['de Oliveira, Burini & Jeukendrup, Sports Med 2014'],
    },
    {
        tab: 'Comer mais rende?', color: C.glucoseSoft, chips: ['observacional · n = 221', 'correlação, não causa'],
        headline: 'Quem comeu mais chegou antes',
        text: 'Nos Ironman, mais carboidrato andou junto com chegada mais rápida (r = −0,55 e −0,48) e também com mais náusea e flatulência. É correlação: os mais rápidos podem ser justamente os que toleram comer mais.',
        sources: [],
    },
    {
        tab: 'Ultra-trail', color: C.risk, chips: ['revisão sistemática · 8 estudos'],
        headline: 'No ultra-trail, pouco e mal',
        text: 'Em 8 estudos de ultra-trail, a maioria dos corredores não chega a 90 g/h, e 65–82% relatam sintomas GI de qualquer grau. Na prova de verdade, a meta esbarra no intestino.',
        sources: ['Arribalzaga et al., Int J Environ Res Public Health 2021'],
    },
];

/** Livro-caixa do painel: um dado-chave por passo, que fica. */
export const GI_LEDGER = [
    { at: 0, value: '6–136 g/h', label: 'de um atleta a outro', color: C.glucose },
    { at: 1, value: '35 g/h', label: 'maratona: < metade de 90', color: C.glucose },
    { at: 2, value: '~31%', label: 'GI graves, Ironman (queixas: 30–50%)', color: C.risk },
    { at: 3, value: 'r = −0,55', label: 'Ironman: + g/h, chega antes', color: C.glucoseSoft },
    { at: 4, value: '65–82%', label: 'ultra-trail com sintomas GI', color: C.risk },
] as const;
