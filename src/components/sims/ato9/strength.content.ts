/**
 * Slide 162 · Paulo e o Carbo Pós-Treino — MACDOUGALL1999, ESSEN1990, KOOPMAN2006, HENSELMANS2022, HENSELMANS2026-MA
 * e HENSELMANS2026-ECR (dossiê 06, confirmados no abstract). Paulo é personagem fictício (kit/cast.ts).
 */

import type { LedgerRow } from './A9aShell';

export interface TankSpec {
    key: string;
    label: string;
    /** Queda do glicogênio (%). */
    drop: number;
    /** Passo em que o tanque baixa. */
    at: number;
    group: 'biceps' | 'coxa' | 'fibra';
}

export const TANKS: readonly TankSpec[] = [
    { key: 'b1', label: '1 série', drop: 12, at: 1, group: 'biceps' },
    { key: 'b3', label: '3 séries', drop: 24, at: 1, group: 'biceps' },
    { key: 'q', label: '30 min', drop: Math.round((1 - 495 / 690) * 100), at: 1, group: 'coxa' }, // 690 → 495: ≈28% (cálculo)
    { key: 't1', label: 'tipo I', drop: 23, at: 2, group: 'fibra' },
    { key: 't2a', label: 'IIa', drop: 40, at: 2, group: 'fibra' },
    { key: 't2x', label: 'IIx', drop: 44, at: 2, group: 'fibra' },
];

export const GROUPS = [
    { key: 'biceps', label: 'bíceps', who: 'MacDougall 1999', at: 1 },
    { key: 'coxa', label: 'coxa', who: 'Essén 1990', at: 1 },
    { key: 'fibra', label: 'por fibra', who: 'Koopman 2006', at: 2 },
] as const;

/** Henselmans 2022: os 49 estudos por tipo de desenho e o que cada um achou. */
export type Finding = 'positivo' | 'nulo' | 'contra';
export const REVIEW = [
    { key: 'agudo', label: 'agudos', cells: [...Array(6).fill('positivo'), ...Array(13).fill('nulo')] as Finding[] },
    { key: 'deplecao', label: 'depleção', cells: [...Array(3).fill('positivo'), ...Array(3).fill('nulo')] as Finding[] },
    { key: 'curto', label: 'curto', cells: Array(7).fill('nulo') as Finding[] },
    { key: 'longo', label: 'longo', cells: ['positivo', 'contra', ...Array(15).fill('nulo')] as Finding[] },
] as const;

/** Henselmans 2026 (meta-análise) e o ensaio cruzado do mesmo grupo. */
export const HYPER = [
    { key: 'todos', label: '11 ECRs', smd: 0.15, note: 'p = 0,23' },
    { key: 'iso', label: 'isocalóricos', smd: 0.15, note: 'p = 0,60' },
    { key: 'img', label: 'imagem direta (2)', smd: -0.26, note: '' },
] as const;

export const STEPS = [
    {
        tab: 'Paulo',
        headline: 'Duas crenças numa frase',
        text: 'Paulo (caso fictício, 41 anos, 85 kg) acha que o treino esvazia o músculo e que, sem carbo pós-treino, não cresce. São duas perguntas: quanto glicogênio uma sessão de força gasta? E o carbo extra muda força ou músculo?',
        sources: [] as string[],
    },
    {
        tab: 'Rosca',
        headline: 'Três séries tiram um quarto do bíceps',
        text: 'MacDougall 1999, 8 fisiculturistas, biópsia do bíceps: −12% após 1 série e −24% após 3 séries de rosca a 80% de 1RM (n = 4 por condição); a fosfocreatina caiu mais (−62% e −50%). Coxa até a falha por 30 min (Essén 1990): 690 → 495 mmol/kg ps.',
        sources: ['MacDougall 1999', 'Essén 1990'],
    },
    {
        tab: 'Por fibra',
        headline: 'O rombo é nas fibras rápidas, e não zera',
        text: 'Koopman 2006, 8 homens não treinados, ~45 min de treino resistido em jejum: −23% nas fibras tipo I, −40% nas IIa e −44% nas IIx, sem ressíntese em 2 h sem comer. Nenhum dos seis tanques passou da metade.',
        sources: ['Koopman 2006'],
    },
    {
        tab: 'Força',
        headline: 'Alimentado, até 10 séries: CHO extra não muda a força',
        text: 'Henselmans 2022, revisão de 49 estudos (39 com treinados). Agudos: 13 nulos × 6 positivos, estes sobretudo contra controle em jejum ou acima de 10 séries por grupo muscular. Curto prazo: 0 de 7. Longo prazo: 15 nulos, 1 a favor e 1 contra mais CHO.',
        sources: ['Henselmans 2022'],
    },
    {
        tab: 'Hipertrofia',
        headline: 'Mais CHO, o mesmo músculo',
        text: 'Henselmans 2026, meta-análise de 11 ECRs: SMD 0,15 (p = 0,23), GRADE baixa. Num cruzado de 20 treinados, +33 g de CHO/dia por 8 semanas não mudou massa magra nem 1RM. Para o Paulo, quem fecha a conta é a energia do dia.',
        sources: ['Henselmans 2026 (MA e ECR)'],
    },
] as const;

export const CHIPS: readonly (readonly string[])[] = [
    [],
    ['mecanístico · n = 4 por condição'],
    ['mecanístico · n = 8 · jejum'],
    ['revisão sistemática · 49 estudos'],
    ['MA · 11 ECRs · GRADE baixa'],
];

export const CALC: Readonly<Record<number, string>> = { 1: 'coxa ≈−28%: cálculo' };

export const LEDGER: readonly LedgerRow[] = [
    { at: 1, label: 'bíceps, 3 séries de rosca', value: '−24%' },
    { at: 1, label: 'coxa, 30 min até a falha', value: '≈−28%' },
    { at: 2, label: 'fibras IIx em ~45 min', value: '−44%' },
    { at: 3, label: 'força · estudos agudos', value: '13 nulos × 6' },
    { at: 4, label: 'hipertrofia · 11 ECRs', value: 'SMD 0,15 · p 0,23' },
];
