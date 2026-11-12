/**
 * Slide 125 · Nem 10 g/kg em 12 Horas. Números: dossiê 04 (FUCHS2025; KEIZER1987 no fecho).
 * Percentuais do pré: 56/159, 88/159, 110/159 (músculo) e 110/166, 236/166, 258/166 (fígado). 142%, 55% e 69% são do
 * artigo; 35%, 66% e 155% são conta sobre os mmol/L do artigo. O braço em jejum não tem valores no resumo: "nada se
 * recuperou" vira traço plano, rotulado como esquema.
 */
import { C } from '../kit/palette';
import type { LedgerRow } from './RefillPanel';

export type Organ = 'liver' | 'muscle';

export interface Point {
    /** Posição no eixo: 'pre' (antes do exercício) ou horas de recuperação. */
    at: 'pre' | 0 | 6 | 12;
    pct: number;
    label: string;
}

export const SERIES: Readonly<Record<Organ, { name: string; color: string; points: readonly Point[] }>> = {
    liver: {
        name: 'fígado', color: C.glycogenSoft,
        points: [
            { at: 'pre', pct: 100, label: '166' },
            { at: 0, pct: (110 / 166) * 100, label: '110' },
            { at: 6, pct: 142, label: '236 · 142%' },
            { at: 12, pct: (258 / 166) * 100, label: '258' },
        ],
    },
    muscle: {
        name: 'músculo', color: C.glycogen,
        points: [
            { at: 'pre', pct: 100, label: '159' },
            { at: 0, pct: (56 / 159) * 100, label: '56' },
            { at: 6, pct: 55, label: '88 · 55%' },
            { at: 12, pct: 69, label: '110 · 69%' },
        ],
    },
};

/** Escala vertical: até 160% do valor de antes (o fígado passa de 100%). */
export const PCT_MAX = 160;

export interface FuchsStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    note: string;
    sources: readonly string[];
}

export const FUCHS_STEPS: readonly FuchsStep[] = [
    {
        tab: 'Desenho',
        headline: 'O exercício esvazia os dois tanques',
        color: C.glycogenSoft,
        text: 'Fuchs 2025: 12 ciclistas homens de elite (VO₂pico 67 mL/kg/min, 5,8 W/kg), ensaio cruzado: 10 g/kg de carboidrato em 12 h contra jejum. O exercício levou o músculo de 159 para 56 mmol/L (−64%) e o fígado de 166 para 110 (−34%). Glicogênio por ¹³C-MRS de ultra-alto campo e por biópsia.',
        note: 'Os dois métodos concordaram: r = 0,89; ICC 0,87.',
        sources: ['Fuchs 2025 (J Physiol)'],
    },
    {
        tab: 'Jejum',
        headline: 'Sem carboidrato, nada volta',
        color: C.stone,
        text: 'No braço em jejum, nem o fígado nem o músculo se recuperaram em 12 h. O estoque não se refaz sozinho em meio dia: depende do carboidrato que chega. É o controle que mostra que a subida do outro braço vem do carboidrato.',
        note: 'O resumo não traz os valores do jejum: o tracejado é esquema, no nível do fim do exercício.',
        sources: [],
    },
    {
        tab: 'Fígado 6 h',
        headline: 'O fígado passa do nível de antes em 6 h',
        color: C.glycogenSoft,
        text: 'Com 10 g/kg em 12 h (bebidas com sacarose a 1,2 g/kg/h nas 6 h iniciais, depois refeições ricas em carboidrato), o fígado foi de 110 para 236 mmol/L às 6 h, 142% do valor de antes, e para 258 às 12 h. É o transbordo de “O Fígado Prefere Sacarose”, agora em ciclistas de elite.',
        note: 'A bebida era de sacarose: glicose + frutose, a dupla que enche o fígado.',
        sources: [],
    },
    {
        tab: 'Músculo 12 h',
        headline: 'O músculo ainda deve às 12 h',
        color: '#A78BFA',
        text: 'O músculo foi de 56 para 88 mmol/L às 6 h (55% do pré) e para 110 às 12 h (69%). Faltam 31% depois de 10 g/kg. No atleta muito depletado, o músculo repõe devagar mesmo com carboidrato de sobra; o fígado, que enche rápido, não é o gargalo.',
        note: 'Cálculo: 100% − 69% = 31% ainda por repor às 12 h.',
        sources: [],
    },
    {
        tab: '2 provas',
        headline: 'A segunda prova larga com o músculo devendo',
        color: C.text,
        text: 'A segunda prova do dia começa com o músculo entre 55% e 69%, por mais que se coma. Num dia inteiro é outra conta: Keizer 1987 (n = 8) viu reposição completa às 22 h. “Com 7–10 g/kg, em 12 h já está quase” não vale para o atleta muito depletado.',
        note: 'Limites do Fuchs 2025: só homens, só 12 h.',
        sources: ['Keizer 1987 (Int J Sports Med)'],
    },
];

const MUSCLE_TXT = '#A78BFA';

export const FUCHS_LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'músculo · fim do exercício', value: '159 → 56 · −64%', color: MUSCLE_TXT },
    { at: 0, label: 'fígado · fim do exercício', value: '166 → 110 · −34%', color: C.glycogenSoft },
    { at: 1, label: 'jejum · 12 h', value: 'nada volta', color: C.stone },
    { at: 2, label: 'fígado · 6 h', value: '236 · 142%', color: C.glycogenSoft },
    { at: 3, label: 'músculo · 12 h', value: '110 · 69%', color: MUSCLE_TXT },
    { at: 4, label: '2ª prova em ≤ 12 h', value: 'músculo 55–69%', color: C.text },
];

export const FUCHS_DESIGN = 'Fuchs 2025 · cruzado · n = 12';
export const UNIT = 'mmol/L';
