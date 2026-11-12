/**
 * Slide 80 · A Dieta Escandinava. Fonte única: dossiê 04 · SHERMAN1981 (confirmado no abstract).
 * Cruzado, 3 regimes de 6 dias em corredores treinados (n não consta no abstract: não mostrar).
 * Polimento igual nos três: esteira a 73% do VO2máx, 90, 40, 40, 20, 20 min e 1 dia de repouso.
 *   A clássico = 3 dias a 15% + 3 a 70% → 207; B moderado = 3 a 50% + 3 a 70% → 203; C = 6 a 50% → 159 mmol/kg ww.
 *   Gasto na corrida de 20,9 km: 5,0 (A) e 5,1 (B) × 3,1 (C) mmol/kg/km. Tempo e glicogênio pós-prova sem diferença
 *   (o abstract não dá os números do pós-prova nem a duração da corrida).
 */
export type RegimeId = 'classico' | 'moderado' | 'mista';

export interface Regime {
    id: RegimeId;
    label: string;
    /** Linha de baixo do rótulo (as duas fases). */
    detail: string;
    /** % da energia em CHO, dia a dia (−6 … −1). */
    days: readonly number[];
    glycogen: number;
    /** Gasto de glicogênio na corrida, mmol/kg/km. */
    perKm: string;
    /** Passo em que a linha entra. */
    at: number;
}

export const REGIMES: readonly Regime[] = [
    { id: 'classico', label: 'clássico', detail: 'depleção + carga', days: [15, 15, 15, 70, 70, 70], glycogen: 207, perKm: '5,0', at: 0 },
    { id: 'moderado', label: 'moderado', detail: 'mista + carga', days: [50, 50, 50, 70, 70, 70], glycogen: 203, perKm: '5,1', at: 1 },
    { id: 'mista', label: 'só mista', detail: 'sem carga', days: [50, 50, 50, 50, 50, 50], glycogen: 159, perKm: '3,1', at: 2 },
];

export const DAY_LABELS: readonly string[] = ['−6', '−5', '−4', '−3', '−2', '−1'];
/** Polimento na esteira (min a 73% do VO2máx), igual nos três regimes; 0 = repouso. */
export const TRAINING: readonly number[] = [90, 40, 40, 20, 20, 0];
/** Escala da barra de glicogênio (mmol/kg ww): só desenho. */
export const GLYCO_MAX = 220;

export interface HistoryStep {
    tab: string;
    headline: string;
    text: string;
}

export const STEPS: readonly HistoryStep[] = [
    {
        tab: 'Clássico',
        headline: 'Esvaziar para depois encher',
        text: 'A dieta escandinava tinha duas fases: 3 dias com só 15% da energia em carboidrato, para esvaziar o músculo, e 3 dias com 70%. Sherman e Costill (1981) testaram o regime em corredores treinados, com o mesmo polimento na esteira nos três braços. Biópsia do vasto lateral no dia da prova: 207 mmol/kg de peso úmido.',
    },
    {
        tab: 'Sem depleção',
        headline: 'A depleção não acrescenta nada',
        text: 'No lugar dos 3 dias a 15%, 3 dias de dieta mista (50%) e a mesma carga a 70%. O glicogênio chegou a 203 mmol/kg, contra 207 do clássico: o mesmo tanque, sem os 3 dias quase sem carboidrato no meio do polimento.',
    },
    {
        tab: 'Só mista',
        headline: 'Quem enche o tanque é a carga',
        text: 'Seis dias de dieta mista, sem os 3 dias a 70%: 159 mmol/kg, cerca de 23% abaixo do clássico. A diferença entre os regimes está nos dias de carboidrato alto, e não no esvaziamento que vinha antes deles.',
    },
    {
        tab: 'A prova',
        headline: 'Mais glicogênio, mais gasto, mesmo tempo',
        text: 'Na corrida de 20,9 km, os regimes com carga gastaram 5,0 e 5,1 mmol/kg por km, contra 3,1 da dieta mista: quem começa cheio queima mais. O tempo e o glicogênio no fim da prova não diferiram entre os regimes. Limites: n fora do abstract, sem cegamento, prova curta para a carga render.',
    },
];

/** O que o estudo ensina: uma lição entra por passo e fica. */
export const LESSONS = [
    { at: 1, label: 'depleção é dispensável', value: '203 × 207' },
    { at: 2, label: 'quem enche é a carga', value: '159 sem ela' },
    { at: 3, label: 'cheio gasta mais por km', value: '5,0–5,1 × 3,1' },
    { at: 3, label: 'tempo na prova de 20,9 km', value: 'igual' },
] as const;

export const CHIPS: readonly (readonly string[])[] = [
    ['cruzado · 3 regimes · corredores treinados'],
    ['cruzado · 3 regimes · corredores treinados'],
    ['cruzado · 3 regimes · corredores treinados'],
    ['cruzado · 3 regimes · corredores treinados'],
];

/** Passo com conta própria no selo. */
export const CALC: Readonly<Record<number, string>> = { 2: '−23%: cálculo' };

export const TEXT = {
    axis: 'barras: % da energia em carboidrato',
    training: 'esteira (min)',
    rest: 'repouso',
    glycogen: 'glicogênio',
    unit: 'mmol/kg ww',
    perKm: 'gasto/km',
    race: '20,9 km: tempo igual',
    raceEnd: 'glicogênio no fim: sem diferença',
    source: 'Sherman, Costill et al. Int J Sports Med 1981',
    ledger: 'o que o estudo ensina',
} as const;
