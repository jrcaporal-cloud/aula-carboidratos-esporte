/** Slide 124 · O Fígado Prefere Sacarose. Números: dossiê 04 (FUCHS2016, DECOMBAZ2011, GONZALEZ2017). */

export type Sugar = 'sacarose' | 'glicose' | 'frutose' | 'galactose';

export interface Fill {
    sugar: Sugar;
    /** Nível inicial e final, como fração do contorno (escala de desenho; o número real vai no texto). */
    from: number;
    to: number;
    text: string;
}

/** Fuchs 2016: 1,5 g/kg/h por 5 h. Fígado em g (escala até 100 g); músculo em mmol/L (escala até 160). */
export const LIVER_FUCHS: readonly Fill[] = [
    { sugar: 'sacarose', from: 53.6 / 100, to: 86.8 / 100, text: '53,6 → 86,8 g' },
    { sugar: 'glicose', from: 49.3 / 100, to: 65.7 / 100, text: '49,3 → 65,7 g' },
];
export const MUSCLE_FUCHS: readonly Fill[] = [
    { sugar: 'sacarose', from: 85 / 160, to: 140 / 160, text: '85 → 140 mmol/L' },
    { sugar: 'glicose', from: 86 / 160, to: 136 / 160, text: '86 → 136 mmol/L' },
];
/** Décombaz 2011: síntese hepática líquida (g/h), maltodextrina 2:1 com o açúcar indicado. Escala até 10 g/h. */
export const LIVER_DECOMBAZ: readonly Fill[] = [
    { sugar: 'frutose', from: 0, to: 8.1 / 10, text: '8,1 g/h' },
    { sugar: 'galactose', from: 0, to: 8.6 / 10, text: '8,6 g/h' },
    { sugar: 'glicose', from: 0, to: 3.7 / 10, text: '3,7 g/h' },
];

export const PHRASES: readonly string[] = [
    'Depois da exaustão, 1,5 g/kg/h por 5 h: sacarose ou glicose.',
    'No fígado, a sacarose repõe 3,4 g a mais por hora.',
    'No músculo, os dois açúcares empatam.',
    'Com frutose ou galactose junto da glicose, o fígado enche duas vezes mais rápido.',
    'Músculo pede quantidade. Fígado pede frutose.',
];

export const DESIGN: readonly string[] = [
    'Fuchs 2016 · cruzado · n = 15 · ¹³C-MRS',
    'Fuchs 2016 · cruzado · n = 15 · ¹³C-MRS',
    'Fuchs 2016 · cruzado · n = 15 · ¹³C-MRS',
    'Décombaz 2011 · cruzado duplo-cego · n = 10',
    'Gonzalez 2017 · revisão',
];

export const LIVER_NOTE = '+3,4 g/h com sacarose (IC95% 1,6–5,1)';
export const MUSCLE_NOTE = 'sem diferença (P = 0,673)';
export const DECOMBAZ_NOTE = '69 g/h de CHO por 6,5 h · fígado medido, músculo não';

export const SOURCE = 'Fuchs CJ et al. J Appl Physiol 2016;120(11):1328-34 · Décombaz J et al. Med Sci Sports Exerc 2011;43(10):1964-71 · Gonzalez JT et al. Nutrients 2017;9(4):344';
