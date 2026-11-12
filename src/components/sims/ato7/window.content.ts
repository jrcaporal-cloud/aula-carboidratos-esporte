/** Slide 120 · A Janela que Fecha Devagar. Números: dossiê 04 (IVY1988, PARKIN1997). */

export const TRACK_W = 860;
export const BAR_H = 104;
/** Maior taxa mostrada (7,7 µmol/g/h): a régua da altura das barras. */
export const RATE_MAX = 7.7;

export type LaneId = 'now' | 'late';

export interface RateBlock {
    lane: LaneId;
    from: number;
    to: number;
    rate: number;
    label: string;
    /** Passo a partir do qual o bloco aparece. */
    showAt: number;
}

export const BLOCKS: readonly RateBlock[] = [
    { lane: 'now', from: 0, to: 2, rate: 7.7, label: '7,7', showAt: 1 },
    { lane: 'late', from: 0, to: 2, rate: 2.5, label: '2,5', showAt: 1 },
    { lane: 'late', from: 2, to: 4, rate: 4.1, label: '4,1', showAt: 2 },
];

/** `dose` = protocolo do Ivy 1988; `meals` = o do Parkin 1997 (5 refeições de alto IG em 24 h). */
export const LANES: readonly { id: LaneId; name: string; dose: string; meals: string; doseAt: number }[] = [
    { id: 'now', name: 'logo após', dose: '2 g/kg na hora 0', meals: '3 refeições em 0–4 h', doseAt: 0 },
    { id: 'late', name: '2 h depois', dose: '2 g/kg na hora 2', meals: '3 refeições em 2–6 h', doseAt: 2 },
];

export const TICKS: readonly number[] = [0, 1, 2, 3, 4, 8, 12, 16, 20, 24];
/** Na régua de 24 h, as marcas 1 e 3 somem (ficariam coladas). */
export const NEAR_ONLY: readonly number[] = [1, 3];

/** Pinos do Parkin 1997: glicogênio igual às 8 e às 24 h. */
export const PINS: readonly number[] = [8, 24];

export const PHRASES: readonly string[] = [
    'Ivy 1988: a mesma dose de carboidrato, logo após o exercício ou 2 h depois.',
    'Nas primeiras 2 h, quem comeu na hora repõe três vezes mais rápido.',
    'Quando o CHO chega, a taxa sobe para 4,1: ainda 45% abaixo de 7,7.',
    'Parkin 1997: atrasar 2 h não muda o glicogênio às 8 h nem às 24 h.',
    'A janela pesa quando a próxima sessão vem em poucas horas. No dia seguinte, o total manda.',
];

export const DESIGN = ['Ivy 1988 · cruzado · n = 12', 'Ivy 1988 · cruzado · n = 12', 'Ivy 1988 · cruzado · n = 12',
    'Parkin 1997 · cruzado · n = 6', 'Parkin 1997 · cruzado · n = 6'] as const;

export const SOURCE = 'Ivy JL et al. J Appl Physiol 1988;64(4):1480-5 · Parkin JA et al. Med Sci Sports Exerc 1997;29(2):220-4';
