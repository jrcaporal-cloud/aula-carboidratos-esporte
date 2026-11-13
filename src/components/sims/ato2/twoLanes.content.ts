import { C } from '../kit/palette';

/**
 * Slide 26 · Duas Pistas no Intestino. Fonte única dos textos (dossiê 01, seção E).
 * JEUKENDRUP2000 (teto de ~1,0–1,1 g/min, fígado ~1 g/min) · JENTJENS2004 (n = 8, 4 condições, ¹³C/¹⁴C, sem desempenho)
 * · RODER2014 (knockout: GLUT2 apical era contaminação) só como nota no último passo.
 */

export interface LaneStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    sources: readonly string[];
    /** Glicoses paradas na fila do SGLT1. */
    queue: number;
    fructose: boolean;
}

export const LANE_STEPS: readonly LaneStep[] = [
    {
        tab: 'O teto',
        headline: 'Uma fonte só para em ~1 g/min',
        color: C.glucoseSoft,
        text: 'Com uma fonte só (glicose, sacarose, maltodextrina), ingerir mais de ~1,0–1,5 g/min não leva a oxidação exógena além de ~1,0–1,1 g/min. O limite provável é o intestino e/ou o fígado (que libera ~1 g/min), não o músculo. É teto de oxidação, não medida direta do SGLT1.',
        sources: ['Jeukendrup & Jentjens 2000 (revisão)'],
        queue: 2, fructose: false,
    },
    {
        tab: 'Mais glicose',
        headline: 'Mais glicose na boca, a mesma oxidação',
        color: C.glucose,
        text: 'Jentjens 2004: 8 ciclistas treinados (VO₂máx 62 mL/kg/min), 120 min a 50% da Wmáx, glicose com ¹⁴C. Com 1,2 g/min de glicose, pico de 0,80 g/min oxidado; com 1,8 g/min, 0,83. Metade a mais na boca, quase nada a mais no músculo: o excesso fica na fila.',
        sources: ['Jentjens 2004 (n = 8)'],
        queue: 8, fructose: false,
    },
    {
        tab: 'Segunda porta',
        headline: 'Com o GLUT5, passa do teto',
        color: C.fructoseSoft,
        text: 'Mesmos 1,8 g/min, com 0,6 de frutose no lugar de glicose: pico de 1,26, ~55% a mais; média de 60–120 min 1,16 × 0,75 g/min (P < 0,001). A frutose entra pelo GLUT5 e não disputa a fila. Limites: n = 8, sem desempenho; o CHO endógeno só tendeu a cair (P = 0,075).',
        sources: ['Jentjens 2004 (n = 8)', 'Röder 2014 (camundongo)'],
        queue: 3, fructose: true,
    },
];

/** Barras do Jentjens 2004: dose ingerida (contorno) e pico de oxidação exógena (cheia), em g/min. */
export const BARS = [
    { at: 1, label: ['glicose', '1,2 g/min'], ingested: 1.2, oxidized: 0.8, text: '0,80', color: C.glucose },
    { at: 1, label: ['glicose', '1,8 g/min'], ingested: 1.8, oxidized: 0.83, text: '0,83', color: C.glucose },
    { at: 2, label: ['glic. + frut.', '1,2 + 0,6'], ingested: 1.8, oxidized: 1.26, text: '1,26', color: C.fructose },
] as const;

/** Livro-caixa das conclusões, uma linha por passo. */
export const LANE_LEDGER: readonly { at: number; what: string; value: string; color: string }[] = [
    { at: 0, what: 'uma fonte só', value: '~1,0–1,1 g/min', color: C.glucoseSoft },
    { at: 1, what: 'glicose 1,2 → 1,8', value: '0,80 → 0,83', color: C.glucose },
    { at: 2, what: '+ frutose (GLUT5)', value: '1,26 (+55%)', color: C.fructoseSoft },
];
