/** Slide 146 · A crise de confiança evitada (dossiê 05·BURKE2020 e 05·BURKE2021a). */

export const REPLICATION_BEATS = [
    'Críticas e relatos de "rebote". O grupo repetiu o estudo inteiro.',
    'Mesmo resultado: 134 s mais rápido × 86 s mais lento.',
    'E o rebote não apareceu: de volta ao CHO, os 20 km não compensaram.',
    '2019: bastam 5–6 dias de LCHF, e 6 de 7 pioraram.',
] as const;

export interface SecondsRow {
    id: 'hcho' | 'pcho' | 'lchf';
    name: string;
    /** Segundos no 10 km: positivo = mais rápido. */
    seconds: number;
    pctText: string;
    note: string;
}

export const SECONDS: readonly SecondsRow[] = [
    { id: 'hcho', name: 'HCHO', seconds: 134, pctText: '+4,8%', note: 'p < 0,001' },
    { id: 'pcho', name: 'PCHO', seconds: 61, pctText: '+2,2%', note: 'p = 0,09' },
    { id: 'lchf', name: 'LCHF', seconds: -86, pctText: '−2,3%', note: 'p < 0,001' },
];

/** Supernova 3: quem melhorou (true) e quem piorou, só a contagem (sem valores individuais). */
export const SN3 = {
    hcho: [true, true, true, true, true, true],
    lchf: [false, false, false, false, false, false, true],
} as const;

export const REPLICATION_SOURCES = {
    sn2: 'Burke LM et al. PLoS One 2020;15(6):e0234027.',
    sn3: 'Burke LM et al. J Physiol 2021;599(3):771-790.',
} as const;
