/**
 * Slide 67 · O fígado, o segundo limite, como cadeia de causa em 4 faixas (ato4/tanksChain.tsx), UM estudo por elo:
 * 1 carboidrato na prova → o sangue (MURRAY2018: músculo ~500 g, 300–700; fígado ~80 g, 0–160; ~4 g no sangue;
 *   GONZALEZ2016: o treino não aumenta o fígado) →
 * 2 fígado poupado (GONZALEZ2015, ¹³C-RM, mmol/L; n = 14, 3 h a 50%, 102 g/h; água n = 4) →
 * 3 glicemia mantida (COYLE1986, mM; n = 7, 71% do VO₂máx: 2,5 × 4,2–5,2 mM; fadiga 3,02 × 4,02 h) →
 * 4 músculo quase igual (ROTHS2026, mmol/kg ps: ~24 [4–45] em ~100 min; SMD −0,16 [−0,30; −0,02]; 31 estudos).
 * Cada elo tem a sua unidade e o seu desenho; nada de níveis ilustrativos.
 */

export interface TankStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
    design: string;
}

export const TANK_STEPS: readonly TankStep[] = [
    {
        tab: 'CHO na prova',
        headline: 'Elo 1: o carboidrato cai no sangue',
        text: 'O sangue tem só ~4 g de glicose, e quem o repõe é o fígado (~80 g, de 0 a 160 g; o treino não aumenta esse tanque). O músculo guarda ~500 g, mas só para ele. O carboidrato da prova chega ao mesmo sangue. O que ele protege?',
        sources: ['Murray & Rosenbloom 2018 (revisão)', 'Gonzalez 2016 (revisão)'],
        design: 'estoques médios · revisão',
    },
    {
        tab: 'Fígado',
        headline: 'Elo 2: o fígado fica cheio',
        text: 'Gonzalez 2015 mediu o fígado por ressonância de ¹³C: 14 ciclistas, 3 h a 50% da potência máxima, 102 g/h de glicose ou sacarose. O fígado não caiu; só com água (n = 4), caiu de 454 a 283 mmol/L. Limite: intensidade baixa.',
        sources: ['Gonzalez 2015 (Am J Physiol)'],
        design: '¹³C-RM · cruzado · n = 14',
    },
    {
        tab: 'Glicemia',
        headline: 'Elo 3: a glicemia se mantém',
        text: 'Coyle 1986, 7 ciclistas a 71% do VO₂máx, cruzado: com placebo, a glicose caiu a 2,5 mM e a fadiga veio em 3,02 h; com polímero de glicose, 4,2–5,2 mM e fadiga em 4,02 h. O fígado não foi medido: a glicemia é o sinal.',
        sources: ['Coyle 1986 (J Appl Physiol)'],
        design: 'cruzado · n = 7 · 71% do VO₂máx',
    },
    {
        tab: 'Músculo',
        headline: 'Elo 4: o músculo, quase nada',
        text: 'Rothschild 2026, 31 estudos cruzados com biópsia: o carboidrato na prova poupa só ~24 mmol/kg ps de glicogênio muscular em ~100 min (SMD −0,16), sem moderador. Logo, ele adia a fadiga pelo fígado e pela glicemia.',
        sources: ['Rothschild 2026 (J Appl Physiol)'],
        design: 'meta-análise · 31 estudos · 48 efeitos',
    },
];

/** Elo 2 · Gonzalez 2015, ¹³C-RM, glicogênio do fígado em mmol/L (média), antes → depois de 3 h. */
export const LIVER_ROWS = [
    { label: 'glicose', pre: 325, post: 345, text: '325 → 345', cho: true },
    { label: 'sacarose', pre: 321, post: 348, text: '321 → 348', cho: true },
    { label: 'só água', pre: 454, post: 283, text: '454 → 283', cho: false },
] as const;
export const LIVER_MAX = 500;

/** Elo 3 · Coyle 1986: glicose no sangue (mM) e tempo até a fadiga. */
export const GLUCOSE_ROWS = [
    { label: 'placebo', lo: 2.5, hi: 2.5, mM: '2,5', hours: '3,02 h', cho: false },
    { label: 'carboidrato', lo: 4.2, hi: 5.2, mM: '4,2–5,2', hours: '4,02 h', cho: true },
] as const;
export const GLUCOSE_MAX = 6;

/** Elo 4 · Rothschild 2026: glicogênio muscular poupado, mmol/kg de peso seco, em ~100 min. */
export const SPARED = { value: 24, lo: 4, hi: 45, max: 50 } as const;

/** Livro-caixa: a cadeia, uma linha por elo. */
export const TANK_LEDGER: readonly { at: number; label: string; value: string }[] = [
    { at: 0, label: 'glicose no sangue', value: '~4 g' },
    { at: 1, label: 'fígado em 3 h com CHO', value: 'não cai' },
    { at: 2, label: 'fadiga, placebo → CHO', value: '3,02 → 4,02 h' },
    { at: 3, label: 'músculo poupado', value: '~24 mmol/kg' },
];
