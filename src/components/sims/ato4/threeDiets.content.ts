import { C } from '../kit/palette';

/**
 * Slide 62 · Três dietas, nove estudantes. Fonte única: dossiê 02 · BERGSTROM1967 (texto original e Tabela III)
 * e NOAKES2022 (crítica). O "≈ 3×" é conta nossa (167 ÷ 57). O resumo do artigo traz 59/126/189 min; vale a tabela.
 */

export interface Diet {
    name: string;
    short: string;
    /** Glicogênio inicial, g/100 g de músculo úmido (Tabela III). */
    glycogen: number;
    /** Tempo até a exaustão a 75% do VO₂máx, min (Tabela III). */
    minutes: number;
    /** O que o resumo do artigo traz (não usar como dado). */
    abstract: number;
    color: string;
    soft: string;
}

export const DIETS: readonly Diet[] = [
    { name: 'gordura + proteína', short: 'G+P', glycogen: 0.63, minutes: 57, abstract: 59, color: C.fat, soft: C.fat },
    { name: 'mista', short: 'mista', glycogen: 1.75, minutes: 114, abstract: 126, color: C.stone, soft: C.stone },
    { name: 'carboidrato', short: 'CHO', glycogen: 3.31, minutes: 167, abstract: 189, color: C.glucose, soft: C.glucoseSoft },
];

/** Reta do artigo: tempo = 41,6 × glicogênio + 36,8 (faixa medida 0,6–4,7 g/100 g). */
export const FIT = { slope: 41.6, intercept: 36.8, x0: 0.6, x1: 4.7 } as const;

/** Os 3 que fizeram carboidrato sem a fase gordurosa logo antes. */
export const OUT_OF_ORDER = { gly: [2.1, 3.0], min: [119, 124] } as const;

export interface DietStep {
    tab: string;
    headline: string;
    text: string;
    color: string;
    sources: readonly string[];
}

export const DIET_STEPS: readonly DietStep[] = [
    {
        tab: 'O protocolo',
        headline: 'Três dietas, uma biópsia antes de cada teste',
        text: '9 estudantes de educação física, homens de 20–26 anos (VO₂máx 3,37–4,96 L/min). Cada dieta durou 3 dias, servida no laboratório; o teste era pedalar a 75% (71–82%) do VO₂máx até a exaustão. Cruzado, não cego. Em 3 dos 9, a ordem foi mista → carboidrato → gordura.',
        color: C.stone,
        sources: ['Bergström, Hermansen, Hultman & Saltin, Acta Physiol Scand 1967 (Tabela III)'],
    },
    {
        tab: 'Cronômetros',
        headline: 'Três cronômetros',
        text: 'Gordura + proteína: 57 min. Mista: 114. Carboidrato: 167, cerca de 3 vezes o primeiro (conta nossa, 167 ÷ 57). Use a Tabela III: o resumo do artigo traz 59, 126 e 189 min, e o texto não explica a diferença.',
        color: C.glucose,
        sources: [],
    },
    {
        tab: 'A reta',
        headline: 'r = 0,92: a reta de 1967',
        text: 'Entre as condições, o glicogênio foi de 0,6 a 4,7 g/100 g. Glicogênio inicial × tempo: r = 0,92 (p < 0,001), reta y = 41,6x + 36,8. Atrás da média, a variação é grande: depois da dieta de carboidrato, os tempos foram de 119 a 285 min.',
        color: C.glycogenSoft,
        sources: [],
    },
    {
        tab: 'Fora da ordem',
        headline: 'Esvaziar para encher',
        text: 'Os 3 que comeram carboidrato sem a fase gordura + proteína logo antes ficaram com 2,10–3,00 g/100 g e 119–124 min, abaixo da média de quem esvaziou antes. Daí nasceu a ideia de esvaziar o tanque antes de enchê-lo: a carga clássica.',
        color: C.glucoseSoft,
        sources: [],
    },
    {
        tab: 'Os limites',
        headline: 'Prevê; não prova',
        text: 'Tempo até a exaustão não é prova; sem cegamento; ordem 6 × 3, sem balanceamento; fígado e glicemia sem controle, e a glicemia caiu em todas as dietas. A crítica de Noakes 2022: o desenho não separa o músculo do fígado. É associação.',
        color: C.stone,
        sources: ['Noakes 2022 (Nutrients, revisão crítica)'],
    },
];
