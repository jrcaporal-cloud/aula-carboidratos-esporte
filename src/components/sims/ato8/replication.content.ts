import { C } from '../kit/palette';

/**
 * Slide 146 · A crise de confiança evitada: Supernova 1, 2 e 3 lado a lado
 * (dossiê 05·BURKE2017, BURKE2020 e BURKE2021a). Positivo = mais rápido.
 */

export const REPLICATION_TABS = ['Supernova 1', 'A réplica', 'Sem rebote', 'Supernova 3'] as const;

/** Selo do desenho, por passo (o do estudo que acabou de entrar). */
export const REPLICATION_CHIPS = [
    'paralelo · n = 9 / 10 / 10 · 3 semanas',
    'replicação · n = 8 / 8 / 10 · não cego',
    'replicação · 19 fizeram os 20 km',
    'paralelo · 13 de classe mundial · 5–6 dias',
] as const;

export interface DivRow {
    id: 'hcho' | 'pcho' | 'lchf';
    name: string;
    value: number;
    label: string;
}

export const ARM_COLOR: Record<DivRow['id'], string> = { hcho: C.glucose, pcho: C.glucoseSoft, lchf: C.fat };

export const SN1_ROWS: readonly DivRow[] = [
    { id: 'hcho', name: 'HCHO', value: 6.6, label: '+6,6%' },
    { id: 'pcho', name: 'PCHO', value: 5.3, label: '+5,3%' },
    { id: 'lchf', name: 'LCHF', value: -1.6, label: '−1,6%' },
];

export const SN2_ROWS: readonly DivRow[] = [
    { id: 'hcho', name: 'HCHO', value: 134, label: '+134 s' },
    { id: 'pcho', name: 'PCHO', value: 61, label: '+61 s' },
    { id: 'lchf', name: 'LCHF', value: -86, label: '−86 s' },
];

/** Supernova 3: quem melhorou (true) e quem piorou, só a contagem (sem valores individuais). */
export const SN3 = {
    hcho: [true, true, true, true, true, true],
    lchf: [false, false, false, false, false, false, true],
} as const;

export const STUDY_TEXT = {
    sn1: 'Elite, comida toda fornecida, 3 semanas de treino intensificado. No 10 km (%), as dietas ricas em CHO melhoraram; o LCHF, com 1,57 g/min de gordura, não.',
    critique: 'Relatos em redes sociais: de volta ao CHO, o LCHF teria melhorado (o "rebote"). O grupo repetiu tudo, citando Ioannidis.',
    sn2: 'Jan–fev/2017, mesmas três dietas. No LCHF, gordura de 0,6 para 1,3 g/min e mais O₂ pelo mesmo ritmo. No 10 km (s): HCHO +4,8% (p < 0,001), PCHO +2,2% (p = 0,09), LCHF −2,3% (p < 0,001).',
    rebound: '2,5 semanas de CHO alto e polimento: nos 20 km, o LCHF não compensou.',
    reverted: 'Tudo voltou ao normal em 5–6 dias de CHO alto.',
    sn3: 'Só 5–6 dias de LCHF (< 50 g/d, 80% de gordura): gordura +>200% (~1,43 g/min) e VO₂ ~8% e ~5% maior nos ritmos de 50 km e 20 km. Com 24 h de CHO e 2 g/kg antes da prova, a oxidação de CHO voltou só a 61% e 78% do valor anterior.',
} as const;

export const SN3_RESULT = { hcho: 'todos mais rápidos · 5,7 ± 5,6%', lchf: '6 de 7 mais lentos · 2,2 ± 3,4%' } as const;

export const REPLICATION_SOURCES = {
    sn1: 'Burke 2017, J Physiol 595:2785.',
    sn2: 'Burke 2020, PLoS One 15:e0234027.',
    sn3: 'Burke 2021, J Physiol 599:771.',
} as const;
