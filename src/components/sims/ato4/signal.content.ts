/**
 * Slide 69 · O glicogênio também fala. Fontes: dossiê 02 · BARTLETT2013 (glicogênio 467 × 103 mmol/kg dw;
 * ACC^Ser79 2,9 × 1,4; p53^Ser15 2,6 × 0,9; PGC-1α ~3× nos dois), HANSEN2005; dossiê 02/05 · IMPEY2018 (73% × 37% de 11 estudos).
 */

export interface Lamp {
    id: string;
    name: string;
    note: string;
    /** Aumento com glicogênio alto e baixo (vezes). */
    high: number;
    low: number;
    /** Passo em que a lâmpada entra. */
    from: number;
}

export const LAMPS: readonly Lamp[] = [
    { id: 'ampk', name: 'AMPK', note: 'via ACC', high: 1.4, low: 2.9, from: 0 },
    { id: 'p53', name: 'p53', note: 'fosforilação', high: 0.9, low: 2.6, from: 0 },
    { id: 'pgc', name: 'PGC-1α', note: 'mRNA', high: 3, low: 3, from: 2 },
];

export const DIMMER = { high: 467, low: 103, max: 560 } as const;

export const SIGNAL_LEADS = [
    'Glicogênio alto (467 mmol/kg): o mesmo treino intervalado acende pouco sinal.',
    'Glicogênio baixo (103): o sinal de AMPK e p53 sobe bem mais. O estoque funciona como um dimmer.',
    'Mas o PGC-1α subiu cerca de 3 vezes nos dois casos. A biologia é mais sutil que o slogan.',
    'Em 11 estudos de treino com pouco glicogênio, o sinal subiu em 73%; o desempenho, em 37%.',
] as const;

/** Contagem de Impey 2018 em 11 estudos (73% ≈ 8, 37% ≈ 4: arredondamento nosso). */
export const IMPEY = [
    { label: 'sinal na célula', pct: 73, of11: 8 },
    { label: 'desempenho', pct: 37, of11: 4 },
] as const;

export const SIGNAL_SOURCE = 'Bartlett et al. 2013; Hansen et al. 2005; Impey et al. 2018';
