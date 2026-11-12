/**
 * Slide 85 · O Fantasma do Rebote. Fonte única: dossiê 04 (confirmados no abstract).
 *   FOSTER1979: cruzado, n = 8 estudantes (T1); 75 g de glicose 30–45 min antes: tempo até a exaustão a 80%
 *     53,2 → 43,2 min (−19%).
 *   MOSELEY2003: cruzado, n = 8; 75 g de glicose 15, 45 ou 75 min antes; glicemia pré-exercício 6,6 / 4,5 / 3,7 mmol/L;
 *     hipoglicemia (< 3,5) em 2 / 3 / 5 sujeitos, sem relação com desempenho; diferenças somem em 10 min;
 *     potência média 268 / 269 / 276 W (sem diferença).
 * A FORMA das curvas entre 0 e 10 min é desenho (ilustrativa); os pontos de partida e a convergência em 10 min são do estudo.
 */
import { C } from '../kit/palette';

export interface Arm {
    id: string;
    label: string;
    start: number;
    hypo: number;
    watts: number;
    color: string;
}

export const ARMS: readonly Arm[] = [
    { id: 'a15', label: '15 min', start: 6.6, hypo: 2, watts: 268, color: C.glucose },
    { id: 'a45', label: '45 min', start: 4.5, hypo: 3, watts: 269, color: C.stone },
    { id: 'a75', label: '75 min', start: 3.7, hypo: 5, watts: 276, color: C.co2 },
];

/** Valor comum desenhado a partir dos 10 min (ilustrativo, sem número na tela). */
export const MEETS_AT = 4.6;
export const HYPO = 3.5;
export const Y_RANGE = [3, 7.2] as const;
export const X_MAX = 20;

export const BEATS: readonly string[] = [
    '1979: oito estudantes, glicose na última hora, 19% menos tempo até a exaustão.',
    'Moseley, 2003: 75 g de glicose 15, 45 ou 75 minutos antes. Cada um largou com uma glicemia.',
    'Em 10 minutos de pedal, as três curvas se encontram.',
    'E a potência no contrarrelógio foi a mesma.',
];

export const MYTH = '“Não coma na hora antes da prova.”';

export const FOSTER = { year: '1979', value: '−19%', detail: '53,2 → 43,2 min até a exaustão' } as const;

export const TEXT = {
    xAxis: 'minutos de exercício',
    yAxis: 'glicemia, mmol/L',
    hypo: 'hipoglicemia',
    ten: '10 min',
    hypoTitle: 'abaixo de 3,5 mmol/L',
    hypoNote: 'sem relação com o desempenho',
    watts: 'potência média',
    dose: '75 g',
    doseDetail: 'de glicose em 500 mL, em três horários',
    ofEight: 'de 8',
} as const;

export const DESIGNS: readonly string[] = [
    'cruzado · n = 8 · não treinados',
    'cruzado · n = 8 · ciclistas treinados',
    'cruzado · n = 8 · ciclistas treinados',
    'cruzado · n = 8 · ciclistas treinados',
];

export const SOURCES: readonly string[] = [
    'Foster C, Costill DL, Fink WJ. Med Sci Sports 1979;11(1):1-5.',
    'Moseley L, Lancaster GI, Jeukendrup AE. Eur J Appl Physiol 2003;88(4-5):453-458.',
    'Moseley L, Lancaster GI, Jeukendrup AE. Eur J Appl Physiol 2003;88(4-5):453-458.',
    'Moseley L et al. Eur J Appl Physiol 2003 · Jeukendrup AE, Killer SC. Ann Nutr Metab 2010;57(Suppl 2):18-25.',
];
