import { C } from '../kit/palette';

/**
 * Slide 112 · O Relógio da Prova. Faixas do consenso BURKE2011 (abstract conferido) e a fronteira de MORTON2026.
 * Faixas intermediárias de Jeukendrup 2014 (Fig. 1): não confirmadas, não entram. O mostrador vai de 0 a 6 h.
 */

export const DIAL_HOURS = 6;

export interface Band {
    from: number;
    to: number;
    duration: string;
    dose: string;
    how: string;
    mechanism: string;
    color: string;
}

export const BANDS: readonly Band[] = [
    { from: 0, to: 1, duration: '~1 h', dose: 'bochecho ou pouco', how: 'pequenas quantidades bastam', mechanism: 'sinal: boca e cérebro', color: C.text },
    { from: 1, to: 2.5, duration: '1 a 2,5 h', dose: '30–60 g/h', how: 'uma fonte só dá conta', mechanism: 'combustível', color: C.glucose },
    { from: 2.5, to: 6, duration: '> 2,5 h', dose: 'até 90 g/h', how: 'com mistura glicose + frutose', mechanism: 'combustível, duas pistas', color: C.fructose },
];

export const FRONTIER = {
    duration: '> 2,5 h, treinados',
    dose: '120 g/h',
    how: 'oxida mais; ganho de desempenho não provado',
    mechanism: 'fronteira experimental',
} as const;

export const SOURCES = [
    'Burke et al., J Sports Sci 2011 · Stellingwerff & Cox 2014',
    'Burke et al., J Sports Sci 2011',
    'Burke et al., J Sports Sci 2011 · Jentjens 2004/2005',
    'Morton et al., J Nutr 2026 · Podlogar 2022 · Ravikanti 2025',
] as const;
