import { C } from '../kit/palette';
import type { LedgerRow } from './SnShell';
import type { SnStep } from './supernova.content';

/**
 * Slide 148 · Cetonas e keto: as meta-análises (dossiê 05·KOERICH2023, VALENZUELA2020, BROOKS2022).
 * Cetona e dieta cetogênica em cor NEUTRA (não é carboidrato nem gordura "de prato"); o lado "favorece CHO" em âmbar.
 */

export const KETO_STEPS: readonly SnStep[] = [
    {
        tab: 'Desempenho',
        headline: 'A dieta cetogênica não adianta o relógio',
        text: 'Koerich 2023 (UFSC): meta-análise bayesiana multinível de 18 estudos, randomizados e não randomizados, em atletas e adultos treinados. Cetogênica × rica em CHO: contrarrelógio −3,3% e 1RM −5,7%. Os intervalos credíveis tocam o zero: tendência a pior, não prova de dano.',
        sources: ['Koerich 2023, Crit Rev Food Sci Nutr'],
    },
    {
        tab: 'Composição',
        headline: 'O que ela entrega é outra coisa',
        text: 'A favor da cetogênica: massa gorda −2,4 kg (IC credível −5,4 a 0,2) e massa total −2,4 kg, com massa livre de gordura −0,8 kg (−3,4 a 1,9). Pode servir numa fase sem prova, com custo pequeno de massa magra. Moderadores: sexo, VO₂máx, duração e modalidade.',
        sources: ['Koerich 2023, Crit Rev Food Sci Nutr'],
    },
    {
        tab: 'Cetona em gole',
        headline: 'Cetona antes da prova: efeito zero',
        text: 'Valenzuela 2020: 13 ECR de cetona aguda (ésteres e sais). Desempenho g = −0,05 (IC95% −0,30 a 0,20; P = 0,68); contrarrelógio −0,04, ésteres −0,07, sais −0,02. Sem efeito consistente em lactato, glicose, RER, VO₂, FC ou esforço percebido.',
        sources: ['Valenzuela 2020, IJSPP'],
    },
    {
        tab: 'Duas meta-análises',
        headline: 'Duas sínteses, o mesmo veredito',
        text: 'Brooks 2022: 8 ECR com monoésteres e precursores, 80 participantes (77 homens). g = 0,14 (−0,20 a 0,47; p = 0,42); tempo até a exaustão −0,002, contrarrelógio 0,057. Nem a dieta nem o gole movem o cronômetro, e a evidência é quase só masculina.',
        sources: ['Brooks 2022, IJSNEM'],
    },
];

export const KETO_CHIPS = [
    'meta-análise bayesiana · 18 estudos',
    'meta-análise bayesiana · 18 estudos',
    'meta-análise de ECR · 13 estudos',
    'meta-análises de ECR · 13 + 8',
] as const;

export interface KetoRow {
    id: string;
    label: string;
    est: number;
    lo: number;
    hi: number;
    right: string;
    /** Passo em que a linha entra. */
    at: number;
}

export interface KetoBlock {
    id: string;
    title: string;
    sub: string;
    at: number;
    color: string;
    domain: readonly [number, number];
    ticks: readonly number[];
    tickText: (t: number) => string;
    sides: readonly [string, string];
    rows: readonly KetoRow[];
}

const pctTick = (t: number) => (t === 0 ? '0' : `${t}%`.replace('-', '−'));
const kgTick = (t: number) => (t === 0 ? '0 kg' : `${t}`.replace('-', '−'));
const gTick = (t: number) => (t === 0 ? '0' : t.toFixed(1).replace('.', ',').replace('-', '−'));

export const KETO_BLOCKS: readonly KetoBlock[] = [
    {
        id: 'perf', title: 'Dieta cetogênica · desempenho', sub: 'diferença × rica em CHO (%)', at: 0, color: C.caveat,
        domain: [-16, 4], ticks: [-15, -10, -5, 0], tickText: pctTick, sides: ['favorece CHO', 'keto'],
        rows: [
            { id: 'tt', label: 'contrarrelógio', est: -3.3, lo: -8.5, hi: 1.7, right: '−3,3%', at: 0 },
            { id: 'rm', label: '1RM', est: -5.7, lo: -14.9, hi: 2.6, right: '−5,7%', at: 0 },
        ],
    },
    {
        id: 'comp', title: 'Dieta cetogênica · composição', sub: 'diferença × rica em CHO (kg)', at: 1, color: C.caveat,
        domain: [-6, 3], ticks: [-6, -4, -2, 0, 2], tickText: kgTick, sides: ['menos', 'mais'],
        rows: [
            { id: 'fm', label: 'massa gorda', est: -2.4, lo: -5.4, hi: 0.2, right: '−2,4 kg', at: 1 },
            { id: 'ffm', label: 'massa livre de gordura', est: -0.8, lo: -3.4, hi: 1.9, right: '−0,8 kg', at: 1 },
        ],
    },
    {
        id: 'ket', title: 'Cetona exógena aguda · desempenho', sub: 'g de Hedges · IC95%', at: 2, color: C.stone,
        domain: [-0.5, 0.5], ticks: [-0.4, -0.2, 0, 0.2, 0.4], tickText: gTick, sides: ['pior', 'melhor'],
        rows: [
            { id: 'val', label: 'Valenzuela · 13 ECR', est: -0.05, lo: -0.3, hi: 0.2, right: 'g = −0,05', at: 2 },
            { id: 'bro', label: 'Brooks · 8 ECR', est: 0.136, lo: -0.195, hi: 0.467, right: 'g = 0,14', at: 3 },
        ],
    },
];

export const KETO_LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'contrarrelógio · 1RM', value: '−3,3% · −5,7%', color: C.caveat },
    { at: 1, label: 'massa gorda · massa livre', value: '−2,4 · −0,8 kg', color: C.caveat },
    { at: 2, label: 'cetona aguda, 13 ECR', value: 'g = −0,05', color: C.stone },
    { at: 3, label: 'cetona aguda, 8 ECR', value: 'g = 0,14', color: C.stone },
    { at: 3, label: 'homens nos 8 ECR', value: '77 de 80' },
];
