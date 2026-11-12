/**
 * Slide 143 · "Fuel for the work required" (dossiê 05·IMPEY2018, STELLINGWERFF2019, ARETA2018).
 * A semana é ILUSTRATIVA; a régua de glicogênio é cálculo a partir de Areta 2018 (462; +102; −253 mmol/kg ps).
 */

export type SessionKind = 'neutral' | 'leve' | 'chave' | 'low';

export const PLANNER_BEATS = [
    'Prato igual todo dia: o tiro e o trote recebem o mesmo combustível.',
    'Combustível para o trabalho: CHO alto nas sessões-chave.',
    'CHO baixo só em sessões leves escolhidas, onde a qualidade não manda.',
    'Clique nas sessões. Nos estudos, treinar com pouco ocupou 30–50% das sessões.',
] as const;

export interface DayPlan {
    day: string;
    session: string;
}

export const WEEK: readonly DayPlan[] = [
    { day: 'Seg', session: 'rodagem' },
    { day: 'Ter', session: 'tiros' },
    { day: 'Qua', session: 'trote cedo' },
    { day: 'Qui', session: 'limiar' },
    { day: 'Sex', session: 'rodagem' },
    { day: 'Sáb', session: 'longão' },
    { day: 'Dom', session: 'trote' },
];

/** Tipo de cada sessão em cada passo do passador (o clique troca por cima). */
export const PRESETS: readonly (readonly SessionKind[])[] = [
    ['neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
    ['leve', 'chave', 'leve', 'chave', 'leve', 'chave', 'leve'],
    ['leve', 'chave', 'low', 'chave', 'leve', 'chave', 'low'],
    ['leve', 'chave', 'low', 'chave', 'leve', 'chave', 'low'],
];

/** Ciclo do clique. */
export const NEXT_KIND: Record<SessionKind, SessionKind> = { neutral: 'chave', leve: 'chave', chave: 'low', low: 'leve' };

export interface KindLook {
    tag: string;
    /** CHO do dia, 0 → 1 (ilustrativo). */
    cho: number;
    /** Glicogênio ao começar, 0 → 1 da régua (cheio ~560 mmol/kg ps). */
    glycogen: number;
}

export const KIND: Record<SessionKind, KindLook> = {
    neutral: { tag: '—', cho: 0.55, glycogen: 0.82 },
    leve: { tag: 'leve', cho: 0.55, glycogen: 0.82 },
    chave: { tag: 'chave', cho: 0.95, glycogen: 1 },
    low: { tag: 'com pouco', cho: 0.25, glycogen: 0.37 },
};

/** Régua de Areta 2018 (cálculo: 462 + 102 e 462 − 253). */
export const RULER = [
    { label: 'cheio', value: '~560' },
    { label: 'normal', value: '~460' },
    { label: 'baixo', value: '~210' },
] as const;

export const PLANNER_SOURCE = 'Impey SG et al. Sports Med 2018; Stellingwerff T et al. IJSNEM 2019; Areta JL, Hopkins WG. Sports Med 2018.';
