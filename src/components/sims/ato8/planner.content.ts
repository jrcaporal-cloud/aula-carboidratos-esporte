/**
 * Slide 143 · "Fuel for the work required" (dossiê 05·IMPEY2018, STELLINGWERFF2019, ARETA2018, HEIKURA2017).
 * A semana (da Marina, caso fictício) é ILUSTRATIVA; a régua é cálculo a partir de Areta 2018:
 * 462 mmol/kg ps em repouso; +102 com CHO alto (~560); −253 com CHO baixo (~210).
 */

export type SessionKind = 'neutral' | 'leve' | 'chave' | 'low';

export interface PlannerStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const PLANNER_STEPS: readonly PlannerStep[] = [
    {
        tab: 'Prato igual',
        headline: 'Todo dia igual, todo tanque igual',
        text: 'Com o mesmo prato todo dia, os tiros e o trote começam com o mesmo tanque: ~462 mmol/kg ps, o repouso típico do vasto lateral com CHO normal (Areta 2018, meta-regressão de 181 estudos com biópsia). A sessão-chave não ganha combustível a mais, e a leve não ganha sinal.',
        sources: ['Areta & Hopkins 2018 (Sports Med)'],
    },
    {
        tab: 'Sessões-chave',
        headline: 'Combustível para o trabalho',
        text: 'Fuel for the work required: carboidrato alto antes e durante as sessões que decidem o treino (tiros, limiar, longão). Com CHO alto, o tanque sobe ~102 mmol/kg, para ~560. É onde a qualidade manda: com pouco glicogênio, o HIT perdeu ~8% de potência (Hulston 2010).',
        sources: ['Impey 2018 (Sports Med)', 'Stellingwerff 2019 (IJSNEM)'],
    },
    {
        tab: 'Leves com pouco',
        headline: 'Pouco só onde a qualidade não manda',
        text: 'CHO baixo só em sessões leves escolhidas, por exemplo o trote cedo depois de uma noite sem carboidrato (o sleep low do slide anterior). Com CHO baixo, o tanque cai ~253, para ~210. O sinal (AMPK, p38) acontece aqui, e a sessão intensa não paga a conta.',
        sources: [],
    },
    {
        tab: 'A semana',
        headline: '30–50% das sessões, no máximo',
        text: 'Nos estudos, treinar com pouco ocupou 30–50% das sessões. Stellingwerff 2019 periodiza em meses, semanas e dias. Na prática, a elite periodiza pouco: 38 corredores e marchadores (Heikura 2017) comiam 7,3 × 6,2 g/kg/d nos dias duros (homens × mulheres).',
        sources: ['Heikura 2017 (IJSNEM)'],
    },
];

export interface DayPlan {
    day: string;
    session: string;
}

export const WEEK: readonly DayPlan[] = [
    { day: 'Seg', session: 'rodagem' },
    { day: 'Ter', session: 'tiros' },
    { day: 'Qua', session: 'trote' },
    { day: 'Qui', session: 'limiar' },
    { day: 'Sex', session: 'rodagem' },
    { day: 'Sáb', session: 'longão' },
    { day: 'Dom', session: 'trote' },
];

/** Tipo de cada sessão em cada passo do passador (o clique troca por cima). */
export const PRESETS: readonly (readonly SessionKind[])[] = [
    ['neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
    ['leve', 'chave', 'leve', 'chave', 'leve', 'chave', 'leve'],
    ['leve', 'chave', 'low', 'chave', 'low', 'chave', 'low'],
    ['leve', 'chave', 'low', 'chave', 'low', 'chave', 'low'],
];

/** Ciclo do clique. */
export const NEXT_KIND: Record<SessionKind, SessionKind> = { neutral: 'chave', leve: 'chave', chave: 'low', low: 'leve' };

export interface KindLook {
    tag: string;
    cho: 'alto' | 'normal' | 'baixo';
    /** Glicogênio ao começar a sessão, mmol/kg ps (régua de Areta 2018). */
    glycogen: number;
}

export const KIND: Record<SessionKind, KindLook> = {
    neutral: { tag: 'igual', cho: 'normal', glycogen: 462 },
    leve: { tag: 'leve', cho: 'normal', glycogen: 462 },
    chave: { tag: 'chave', cho: 'alto', glycogen: 564 },
    low: { tag: 'pouco', cho: 'baixo', glycogen: 209 },
};

/** Linhas da régua no gráfico (aparecem no passo `at`). */
export const RULER = [
    { value: 564, label: '~560', at: 1 },
    { value: 462, label: '462', at: 0 },
    { value: 209, label: '~210', at: 2 },
] as const;

/** Livro-caixa do painel: a régua de Areta, linha a linha. */
export const LEDGER = [
    { at: 0, label: 'repouso, CHO normal', value: '462 ± 132' },
    { at: 1, label: 'CHO alto: +102', value: '~560' },
    { at: 2, label: 'CHO baixo: −253', value: '~210' },
] as const;

/** Faixa dos estudos (Impey 2018). */
export const STUDY_BAND = { lo: 30, hi: 50 } as const;
