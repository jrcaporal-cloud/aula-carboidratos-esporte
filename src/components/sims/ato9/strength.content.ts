/**
 * Slide 162 · Paulo e o Carbo Pós-Treino — MACDOUGALL1999 e HENSELMANS2022/2026-MA (dossiê 06), KOOPMAN2006 (dossiê 02).
 * Paulo é personagem fictício (kit/cast.ts).
 */

export const CURL = [
    { label: '1 série', drop: 12 },
    { label: '3 séries', drop: 24 },
] as const;

export const FIBERS = [
    { label: 'tipo I', drop: 23 },
    { label: 'IIa', drop: 40 },
    { label: 'IIx', drop: 44 },
] as const;

/** Henselmans 2022, estudos agudos: 13 nulos × 6 positivos. */
export const ACUTE = { nulls: 13, positives: 6, total: 49 } as const;

export const HYPER = { smd: '0,15', p: '0,23', trials: 11 } as const;

export const STEPS = [
    { say: 'Paulo acha que o treino esvazia o músculo. Quanto uma rosca gasta?', design: null },
    { say: 'Três séries de rosca a 80% de 1RM: o bíceps perdeu 24% do glicogênio.', design: '8 fisiculturistas · n = 4 por condição' },
    { say: 'Numa sessão de ~45 min, o rombo fica nas fibras rápidas.', design: '8 homens não treinados · jejum' },
    { say: 'Força: alimentado e com até 10 séries, CHO extra não mudou o desempenho.', design: 'revisão sistemática · 49 estudos' },
    { say: 'Hipertrofia, com proteína igual: mais CHO não fez crescer mais.', design: 'meta-análise · 11 ECRs · GRADE baixa' },
] as const;

export const SOURCES = [
    'MacDougall JD et al. Can J Appl Physiol 1999;24(3):209-15.',
    'MacDougall JD et al. Can J Appl Physiol 1999;24(3):209-15.',
    'Koopman R et al. Eur J Appl Physiol 2006;96(5):525-34.',
    'Henselmans M et al. Nutrients 2022;14(4):856.',
    'Henselmans M et al. Sports Med 2026;56(3):691-702.',
] as const;
