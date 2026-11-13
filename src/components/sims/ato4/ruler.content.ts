import { C } from '../kit/palette';

/**
 * Slide 63 · Quanto é "normal". Uma régua só: ARETA2018 (dossiê 02), mmol/kg de músculo SECO, vasto lateral.
 * 462 ± 132 (homens, carboidrato habitual, VO₂máx 53 ± 8); carga +102 ± 47; pouco carboidrato −253 ± 30;
 * +67 ± 15 por +10 mL/kg/min de VO₂máx; limiares 25/75/150/250 (pequeno/moderado/grande/muito grande).
 * 564 · 209 · 529 são conta nossa (normal + efeito). BERGSTROM1967 (g/100 g úmido) vira nota, sem conversão.
 * O gasto no exercício (uso +104, mulheres −30, corrida −70, Phillips −16%) foi para as notas; os gramas do corpo
 * todo ficam no slide "Quanto Cabe no Corpo".
 */

export const RULER_MAX = 700;
export const NORMAL = { value: 462, sd: 132 } as const;

export interface RulerStep {
    tab: string;
    headline: string;
    text: string;
    color: string;
    sources: readonly string[];
    design: string;
}

const ARETA = 'Areta & Hopkins 2018 (Sports Med, meta-análise)';

export const RULER_STEPS: readonly RulerStep[] = [
    {
        tab: 'O normal',
        headline: 'O normal: 462 ± 132',
        text: 'Areta & Hopkins 2018 juntaram 181 estudos com biópsia: no vasto lateral de homens com carboidrato habitual (VO₂máx 53 ± 8 mL/kg/min), 462 ± 132 mmol/kg de músculo seco. O ± 132 é a variação entre pessoas: a faixa normal vai de ~330 a ~590. Há poucos dados de mulheres.',
        color: C.glycogenSoft,
        sources: [ARETA],
        design: 'meta-análise · 181 estudos',
    },
    {
        tab: 'Carga',
        headline: 'A carga sobe ~100',
        text: 'Carboidrato alto (≥ 6 g/kg/dia por ≥ 3 dias, ou ≥ 7 g/kg/dia por ≥ 2 dias) soma +102 ± 47: efeito moderado pelos limiares de Areta. Do normal, o músculo vai a ~564, ainda dentro da faixa de quem come o habitual.',
        color: C.glucoseSoft,
        sources: [ARETA],
        design: 'meta-análise · 181 estudos',
    },
    {
        tab: 'Pouco CHO',
        headline: 'A depleção tira ~250',
        text: 'Pouco carboidrato tira −253 ± 30: efeito muito grande. Do normal, o músculo cai a ~209, abaixo de 250, a faixa do músculo esvaziado. Na mesma régua, esvaziar move o tanque mais do que encher.',
        color: C.risk,
        sources: [ARETA],
        design: 'meta-análise · 181 estudos',
    },
    {
        tab: 'Treino',
        headline: 'O treino aumenta o tanque',
        text: 'Cada +10 mL/kg/min de VO₂máx soma +67 ± 15 com carboidrato habitual (efeito pequeno): quem tem 63 em vez de 53 começa perto de ~529. É associação entre estudos, não um experimento de treino. Fica a régua: ~460 normal, ~560 carregado, ~210 esvaziado.',
        color: C.stone,
        sources: [ARETA],
        design: 'meta-regressão · associação',
    },
];

/** Leituras da régua: cada uma nasce no normal, desliza até o valor no seu passo e fica (o último passo acumula). */
export interface Reading {
    at: number;
    value: number;
    delta: string;
    name: string;
    color: string;
    /** Altura do topo do marcador no palco (marcadores próximos ficam em alturas diferentes). */
    top: number;
    /** Lado do rótulo em relação ao marcador. */
    side: 'left' | 'right';
}

export const READINGS: readonly Reading[] = [
    { at: 1, value: 564, delta: '+102', name: 'carga', color: C.glucose, top: 130, side: 'right' },
    { at: 2, value: 209, delta: '−253', name: 'pouco carboidrato', color: C.risk, top: 130, side: 'right' },
    { at: 3, value: 529, delta: '+67', name: 'VO₂máx +10', color: C.stone, top: 56, side: 'left' },
];

export interface RulerRow {
    at: number;
    factor: string;
    effect: string;
    /** Tamanho pelos limiares de Areta (25 · 75 · 150 · 250 mmol/kg seco). */
    size: string;
    color: string;
}

/** Livro-caixa: só o estoque em repouso (mmol/kg seco). Cada linha entra no seu passo e fica. */
export const RULER_ROWS: readonly RulerRow[] = [
    { at: 0, factor: 'normal · homens, CHO habitual', effect: '462 ± 132', size: '—', color: C.glycogenSoft },
    { at: 1, factor: 'carga de carboidrato', effect: '+102 ± 47', size: 'moderado', color: C.glucoseSoft },
    { at: 2, factor: 'pouco carboidrato', effect: '−253 ± 30', size: 'muito grande', color: C.risk },
    { at: 3, factor: '+10 mL/kg/min de VO₂máx', effect: '+67 ± 15', size: 'pequeno', color: C.stone },
];
