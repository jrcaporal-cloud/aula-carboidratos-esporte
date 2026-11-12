/**
 * Slide 85 · O Fantasma do Rebote. Fonte única: dossiê 04 (confirmados no abstract).
 *   FOSTER1979: cruzado, n = 8 estudantes (T1); 75 g de glicose 30–45 min antes: tempo até a exaustão a 80% do VO₂máx
 *     53,2 → 43,2 min (−19%); sem efeito a 100%; glicemia < 3,5 mM transitória na maioria.
 *   MOSELEY2003: cruzado, n = 8 (VO₂máx 63,1 mL/kg/min); 75 g de glicose em 500 mL 15, 45 ou 75 min antes;
 *     20 min a 65% da potência máxima + contrarrelógio (~685 kJ). Glicemia pré 6,6 / 4,5 / 3,7 mmol/L;
 *     diferenças somem em 10 min; hipoglicemia (< 3,5) em 2 / 3 / 5, sem relação com desempenho nem esforço
 *     percebido; potência 268 / 269 / 276 W (sem diferença).
 *   KUIPERS1999: n = 19 ciclistas, 50 g de glicose: 6 de 19 (32%) < 3,0 mmol/L transitória, mínimo aos 20 min.
 *     Sem desfecho de desempenho.
 *   JEUKENDRUP2010: revisão narrativa: evitar CHO na hora anterior "é infundado"; sintomas raramente ligados a
 *     glicemia baixa; abordagem individual.
 * A FORMA das curvas é desenho (ilustrativa). Do estudo: a hora da ingestão, a glicemia no 0 e o encontro em 10 min.
 */
import { C } from '../kit/palette';

export interface Arm {
    id: string;
    /** Minutos antes do exercício em que a glicose foi tomada. */
    before: number;
    start: number;
    hypo: number;
    watts: number;
    color: string;
}

export const ARMS: readonly Arm[] = [
    { id: 'a15', before: 15, start: 6.6, hypo: 2, watts: 268, color: C.glucose },
    { id: 'a45', before: 45, start: 4.5, hypo: 3, watts: 269, color: C.stone },
    { id: 'a75', before: 75, start: 3.7, hypo: 5, watts: 276, color: C.insulinSoft },
];

/** Eixo: de −80 min (antes da primeira dose) a +20 min de exercício. */
export const X_RANGE = [-80, 20] as const;
export const Y_RANGE = [3, 9.5] as const;
export const HYPO = 3.5;
/** Glicemia de jejum e valor comum depois dos 10 min: desenho, sem número na tela. */
export const BASAL = 5;
export const MEETS_AT = 4.6;

export interface ReboundStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    limit?: string;
    sources: string;
    /** Uma linha "o que fica": acumula no painel. */
    takeaway: string;
    chips: readonly string[];
}

export const RB_STEPS: readonly ReboundStep[] = [
    {
        tab: '1979',
        headline: 'O medo nasceu de 8 estudantes',
        color: C.risk,
        text: 'Foster 1979, cruzado: 75 g de glicose 30–45 min antes, contra água. A 80% do VO₂máx, o tempo até a exaustão caiu de 53,2 para 43,2 min (−19%); a 100%, nada. A glicemia caiu abaixo de 3,5 mmol/L na maioria e voltou em 30–40 min. Daí vieram décadas de “não coma na última hora”.',
        limit: 'estudantes não treinados, tempo até a exaustão, n = 8.',
        sources: 'Foster 1979',
        takeaway: '1979: −19% em não treinados, a 80% do VO₂máx.',
        chips: ['cruzado · n = 8 · não treinados'],
    },
    {
        tab: 'O desenho',
        headline: 'Moseley testou o relógio',
        color: C.glucose,
        text: 'Moseley 2003, cruzado, 8 ciclistas treinados (VO₂máx 63 mL/kg/min): os mesmos 75 g de glicose em 500 mL, tomados 15, 45 ou 75 min antes de 20 min a 65% da potência máxima e de um contrarrelógio de ~685 kJ. Cada braço largou com uma glicemia: 6,6, 4,5 e 3,7 mmol/L.',
        sources: 'Moseley 2003',
        takeaway: '2003: mesmos 75 g; muda só o horário.',
        chips: ['cruzado · n = 8 · treinados'],
    },
    {
        tab: '10 minutos',
        headline: 'Em 10 min de pedal, as curvas se encontram',
        color: C.glucoseSoft,
        text: 'As diferenças de glicemia sumiram nos primeiros 10 min de exercício. Abaixo de 3,5 mmol/L ficaram 2, 3 e 5 dos 8 ciclistas, e a hipoglicemia não se relacionou com o desempenho nem com o esforço percebido.',
        limit: 'n = 8; a forma das curvas no gráfico é desenho, só o 0 e os 10 min são do estudo.',
        sources: 'Moseley 2003',
        takeaway: 'Glicemias iguais aos 10 min de pedal.',
        chips: ['cruzado · n = 8 · treinados'],
    },
    {
        tab: 'A potência',
        headline: 'E a potência foi a mesma',
        color: C.ok,
        text: 'No contrarrelógio, a potência média foi 268, 269 e 276 W, sem diferença entre os horários. O momento da glicose na última hora muda a glicemia de largada; o desempenho, não.',
        limit: 'contrarrelógio curto (~685 kJ) e n = 8.',
        sources: 'Moseley 2003',
        takeaway: 'Potência: 268, 269 e 276 W, sem diferença.',
        chips: ['cruzado · n = 8 · treinados'],
    },
    {
        tab: 'Quem sente',
        headline: 'Rebote existe; prejuízo, não',
        color: C.insulinSoft,
        text: 'Kuipers 1999: 6 de 19 ciclistas (32%) caíram transitoriamente abaixo de 3,0 mmol/L e se recuperaram. A revisão de 2010 chamou de infundado o conselho de evitar carboidrato na última hora.',
        limit: 'Kuipers não mediu desempenho; a revisão é narrativa.',
        sources: 'Kuipers 1999 · Jeukendrup & Killer 2010 (revisão)',
        takeaway: 'Sintomático? Teste o horário no treino.',
        chips: ['n = 19 · revisão narrativa'],
    },
];

export const MYTH = '“Não coma na hora antes da prova.”';

export const FOSTER = {
    rows: [
        { label: 'água', min: 53.2 },
        { label: 'glicose', min: 43.2 },
    ],
    max: 60,
    value: '−19%',
    caption: 'min até a exaustão a 80% do VO₂máx',
} as const;

export const KUIPERS = { n: 19, low: 6, caption: '6 de 19 < 3,0 mmol/L' } as const;

export const TEXT = {
    xAxis: 'min · repouso e exercício em escalas diferentes',
    rest: 'repouso',
    legend: '75 g de glicose, tomada:',
    hypo: '3,5 · hipoglicemia',
    ten: '10 min',
    exercise: 'exercício',
    watts: 'potência média, W',
    hypoCount: '< 3,5 mmol/L',
    illustrative: 'curvas: forma ilustrativa',
    stamp: 'não se repetiu',
} as const;
