import { C } from '../kit/palette';

/** Slide 63 · Quanto é "normal". Fonte: dossiê 02 · ARETA2018, MURRAY2018, PHILLIPS1996, GONZALEZ2016. */

export const RULER_MAX = 700;

export interface RulerMark {
    id: string;
    value: number;
    flag: string;
    label: string;
    color: string;
    /** Passo em que o marcador aparece. */
    from: number;
}

/** mmol/kg de músculo seco, vasto lateral (Areta 2018). Os deslocados partem do "normal" e deslizam. */
export const MARKS: readonly RulerMark[] = [
    { id: 'normal', value: 462, flag: '462', label: 'normal', color: C.glycogenSoft, from: 0 },
    { id: 'carga', value: 564, flag: '+102', label: 'carga', color: C.glucose, from: 1 },
    { id: 'depl', value: 209, flag: '−253', label: 'depleção', color: C.risk, from: 2 },
];

/** Faixas de magnitude de Areta 2018 (limiares 25 · 75 · 150 · 250 mmol/kg dw). */
export const MAGNITUDE = [
    { from: 0, to: 25, label: 'trivial' },
    { from: 25, to: 75, label: 'pequeno' },
    { from: 75, to: 150, label: 'moderado' },
    { from: 150, to: 250, label: 'grande' },
    { from: 250, to: 300, label: 'muito grande' },
] as const;
export const MAG_MAX = 300;

export const RULER_LEADS = [
    'Músculo de quem come carboidrato normal: 462 mmol/kg de peso seco, em média.',
    'Com carga de carboidrato (≥ 6 g/kg/dia por ≥ 3 dias): +102. Efeito moderado.',
    'Com pouco carboidrato: −253. Efeito muito grande. A dieta move o tanque nos dois sentidos.',
    'No corpo todo, em gramas: o músculo guarda cerca de 500 g; o fígado, cerca de 80 g.',
    'O treino aumenta o tanque muscular e economiza no gasto. O fígado não cresce.',
] as const;

/** Estoques corporais médios, g (faixa entre pessoas). */
export const BODY_STORES = [
    { name: 'músculo', grams: 500, range: [300, 700], color: C.glycogen },
    { name: 'fígado', grams: 80, range: [0, 160], color: C.glycogenSoft },
] as const;
export const GRAMS_MAX = 700;

export const TRAINING = [
    { dir: 'up', text: '+67 mmol/kg a cada +10 mL/kg/min de VO₂máx', src: 'Areta 2018' },
    { dir: 'down', text: '−16% de glicogênio oxidado na mesma carga, após 5 dias de treino', src: 'Phillips 1996' },
    { dir: 'same', text: 'Glicogênio do fígado em repouso: igual ao de quem não treina', src: 'Gonzalez 2016' },
] as const;

export const RULER_SOURCE = 'Areta & Hopkins 2018; Murray & Rosenbloom 2018; Phillips 1996; Gonzalez 2016';
