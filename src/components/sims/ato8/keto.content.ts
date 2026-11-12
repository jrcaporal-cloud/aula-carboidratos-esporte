import type { ForestRow } from '../kit/ForestPlot';
import { C } from '../kit/palette';

/** Slide 148 · Cetonas e keto: as meta-análises (dossiê 05·KOERICH2023, VALENZUELA2020, BROOKS2022). */

export const KETO_BEATS = [
    'Dieta cetogênica × rica em CHO: o contrarrelógio tende a piorar.',
    'O que ela entrega é outra coisa: menos massa gorda.',
    'Cetona em gole, antes da prova: efeito em torno de zero.',
    'Duas meta‑análises de cetona, o mesmo veredito: o cronômetro não anda.',
] as const;

/** Koerich 2023: diferença % (cetogênica − CHO), IC credível 95%. */
export const DIET_ROWS: readonly ForestRow[] = [
    { id: 'tt', label: 'contrarrelógio', est: -3.3, lo: -8.5, hi: 1.7, kind: 'pooled', color: C.fat, right: '−3,3%' },
    { id: 'rm', label: '1RM', est: -5.7, lo: -14.9, hi: 2.6, kind: 'pooled', color: C.fat, right: '−5,7%' },
];

/** Cetona exógena aguda: g de Hedges, IC95%. */
export const KETONE_ROWS: readonly ForestRow[] = [
    { id: 'val', label: 'Valenzuela 2020', sub: '13 ECR', est: -0.05, lo: -0.3, hi: 0.2, kind: 'pooled', color: C.stone, right: 'g = −0,05' },
    { id: 'bro', label: 'Brooks 2022', sub: '8 ECR · 77 de 80 homens', est: 0.136, lo: -0.195, hi: 0.467, kind: 'pooled', color: C.stone, right: 'g = 0,14' },
];

export const KETO_SOURCES = {
    koerich: 'Koerich ACC et al. Crit Rev Food Sci Nutr 2023;63(32):11399-11424.',
    ketone: 'Valenzuela PL et al. IJSPP 2020;15(3):298-308; Brooks E et al. IJSNEM 2022;32(3):214-225.',
} as const;
