import { C } from '../kit/palette';

/**
 * Slide 63 · Quanto é "normal". Fonte: dossiê 02 · BERGSTROM1967 (g/100 g úmido), ARETA2018 (mmol/kg seco:
 * 462 ± 132; +102 ± 47; −253 ± 30; +67 ± 15 por +10 mL/kg/min; uso +104 com +200 inicial; mulheres −30;
 * corrida −70; limiares 25/75/150/250), MURRAY2018 (500 g × 80 g), PHILLIPS1996 (−16%), GONZALEZ2016.
 * 204 mmol/kg úmido é conta nossa (33,1 g/kg ÷ 0,162 g/mmol). NÃO converter para seco: fator não confirmado.
 */

/** 1 g/100 g de músculo úmido = 10 g/kg ÷ 0,162 g/mmol de glicosil. */
export const G100_TO_MMOL = 10 / 0.162;

/** Glicogênio inicial das três dietas de 1967, g/100 g úmido. */
export const DIETS_1967 = [
    { g: 0.63, color: C.fat },
    { g: 1.75, color: C.stone },
    { g: 3.31, color: C.glucose },
] as const;

export const RULER_MAX = 700;
export const NORMAL = { value: 462, sd: 132 } as const;

export interface RulerStep {
    tab: string;
    headline: string;
    text: string;
    color: string;
    sources: readonly string[];
}

export const RULER_STEPS: readonly RulerStep[] = [
    {
        tab: '1967',
        headline: 'Duas réguas, não uma',
        text: 'Bergström mediu em g/100 g de músculo úmido: 3,31 g/100 g ≈ 204 mmol/kg úmido (conta nossa: 33,1 g/kg ÷ 0,162 g/mmol). As biópsias de hoje usam músculo seco; o fator de conversão depende da água e não foi confirmado. Por isso, duas réguas.',
        color: C.stone,
        sources: ['Bergström 1967'],
    },
    {
        tab: 'O normal',
        headline: 'O normal: 462 ± 132',
        text: 'Areta & Hopkins 2018, meta-análise de 181 estudos com biópsia: vasto lateral de homens com carboidrato habitual (VO₂máx 53 ± 8 mL/kg/min), 462 ± 132 mmol/kg seco. A faixa é larga, e há poucos dados de mulheres.',
        color: C.glycogenSoft,
        sources: ['Areta & Hopkins 2018'],
    },
    {
        tab: 'A dieta',
        headline: 'A dieta move nos dois sentidos',
        text: 'Carga (≥ 6 g/kg/dia por ≥ 3 dias, ou ≥ 7 por ≥ 2): +102 ± 47, efeito moderado. Pouco carboidrato: −253 ± 30, muito grande. Esvaziar move o tanque mais do que encher.',
        color: C.glucose,
        sources: [],
    },
    {
        tab: 'Treino',
        headline: 'Tanque maior, gasto menor',
        text: 'Cada +10 mL/kg/min de VO₂máx soma +67 ± 15. No exercício, gasta mais quem começa mais cheio (+104 aos 116 min); mulheres e corrida gastam menos. Com 5 dias de treino, −16% de glicogênio oxidado na mesma carga.',
        color: C.stone,
        sources: ['Phillips 1996'],
    },
    {
        tab: 'Corpo todo',
        headline: 'Músculo ~500 g, fígado ~80 g',
        text: 'No corpo todo, em média, ~500 g no músculo (300–700) e ~80 g no fígado (0–160): estimativas de revisão. O treino aumenta o tanque muscular, mas não o glicogênio hepático basal (Gonzalez 2016).',
        color: C.glycogenSoft,
        sources: ['Murray & Rosenbloom 2018', 'Gonzalez 2016'],
    },
];

export interface ModRow {
    at: number;
    factor: string;
    effect: string;
    /** Tamanho pelos limiares de Areta (25 · 75 · 150 · 250 mmol/kg seco). */
    size: string;
    color: string;
}

/** O que move o glicogênio (mmol/kg seco): cada linha entra no seu passo e fica. "uso" = gasto no exercício. */
export const MODIFIERS: readonly ModRow[] = [
    { at: 2, factor: 'carga de carboidrato', effect: '+102 ± 47', size: 'moderado', color: C.glucoseSoft },
    { at: 2, factor: 'pouco carboidrato', effect: '−253 ± 30', size: 'muito grande', color: C.risk },
    { at: 3, factor: '+10 mL/kg/min VO₂máx', effect: '+67 ± 15', size: 'pequeno', color: C.stone },
    { at: 3, factor: '+200 no início', effect: 'gasto +104', size: 'moderado', color: C.stone },
    { at: 3, factor: 'mulheres', effect: 'gasto −30', size: 'pequeno', color: C.stone },
    { at: 3, factor: 'corrida × ciclismo', effect: 'gasto −70', size: 'pequeno', color: C.stone },
];

/** Estoques do corpo todo, g (faixa entre pessoas). Estimativas de revisão (Murray & Rosenbloom 2018). */
export const BODY_STORES = [
    { name: 'músculo', grams: 500, range: [300, 700], color: C.glycogen },
    { name: 'fígado', grams: 80, range: [0, 160], color: C.glycogenSoft },
] as const;
export const GRAMS_MAX = 700;
