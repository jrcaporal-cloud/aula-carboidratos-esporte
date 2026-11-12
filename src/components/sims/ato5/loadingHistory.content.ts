/**
 * Slide 80 · A Dieta Escandinava. Fonte única: dossiê 04 · SHERMAN1981 (confirmado no abstract).
 * Regimes de 6 dias antes de uma corrida de 20,9 km (% da energia vinda do CHO, por dia):
 *   A "clássico" = 3 dias a 15% + 3 dias a 70%; B "moderado" = 3 a 50% + 3 a 70%; C = 6 dias a 50%.
 * Glicogênio do vasto lateral no dia da prova, em mmol/kg de peso úmido: A 207, B 203, C 159.
 */
export type RegimeId = 'classico' | 'moderado' | 'mista';

export interface Regime {
    id: RegimeId;
    /** Rótulo curto do tanque. */
    label: string;
    /** % de CHO da dieta, dia a dia (6 dias até a prova). */
    days: readonly number[];
    glycogen: number;
    /** Nome das duas fases (3 + 3 dias). */
    phases: readonly [string, string];
}

export const REGIMES: Record<RegimeId, Regime> = {
    classico: { id: 'classico', label: 'clássico', days: [15, 15, 15, 70, 70, 70], glycogen: 207, phases: ['depleção', 'carga'] },
    moderado: { id: 'moderado', label: 'moderado', days: [50, 50, 50, 70, 70, 70], glycogen: 203, phases: ['dieta mista', 'carga'] },
    mista: { id: 'mista', label: 'só mista', days: [50, 50, 50, 50, 50, 50], glycogen: 159, phases: ['dieta mista', 'dieta mista'] },
};

export const TANK_ORDER: readonly RegimeId[] = ['classico', 'moderado', 'mista'];

/** Escala dos tanques: 240 mmol/kg ww = cheio (só desenho). */
export const TANK_MAX = 240;

/** Regime que a faixa do calendário mostra em cada passo. */
export const STRIP_BY_STEP: readonly RegimeId[] = ['classico', 'moderado', 'mista', 'moderado'];

/** Quantos tanques já apareceram em cada passo. */
export const TANKS_BY_STEP: readonly number[] = [1, 2, 3, 3];

export const BEATS: readonly string[] = [
    'O regime clássico: 3 dias quase sem carboidrato para esvaziar o tanque, depois 3 de carga.',
    'Sherman, 1981: no lugar da depleção, 3 dias de dieta mista. O tanque chega ao mesmo nível.',
    'Sem os 3 dias de carga, para em 159. Quem enche o tanque é a carga, não o esvaziar.',
    'Na corrida de 20,9 km, nenhum regime mudou o tempo: prova curta demais para a carga render.',
];

export const DAY_LABELS: readonly string[] = ['−6', '−5', '−4', '−3', '−2', '−1'];

export const TEXT = {
    axis: 'dias antes da prova · % da energia em carboidrato',
    race: '20,9 km',
    unit: 'glicogênio, mmol/kg (peso úmido)',
    sameTime: 'tempo igual',
    design: 'cruzado · 3 regimes · corredores treinados',
    source: 'Sherman WM, Costill DL et al. Int J Sports Med 1981;2(2):114-118.',
} as const;
