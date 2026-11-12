/**
 * Slide 160 · 47% das Fibras — KRUSTRUP2006, VIGHLARSEN2022 e BANGSBO2006 (dossiê 06, confirmados no abstract).
 * Fonte única dos números e dos textos do palco + painel.
 */

import type { LedgerRow } from './A9aShell';

export const GLY_PRE = 449; // mmol/kg peso seco, antes do jogo
export const GLY_POST = 255; // mmol/kg peso seco, fim do jogo
export const EMPTY_PCT = 47; // % das fibras vazias ou quase vazias (± 7)
export const SPRINT_SLOWER = 2.8; // % de aumento no tempo médio dos tiros de 30 m (± 0,7)

/** Cálculos nossos a partir dos números acima (vão com o selo "cálculo"). */
export const MEAN_DROP = Math.round((1 - GLY_POST / GLY_PRE) * 100); // 43
export const LAG_M = 30 - 30 / (1 + SPRINT_SLOWER / 100); // ≈ 0,8 m

/** Vigh-Larsen 2022, 1º bloco de 10 × 45 s: queda do glicogênio por fração e tipo de fibra (%). */
export const LOCAL = [
    { key: 'intra', label: 'dentro das miofibrilas', t1: 45, t2: 72 },
    { key: 'inter', label: 'entre as miofibrilas', t1: 35, t2: 59 },
] as const;

const KRUSTRUP = 'Krustrup 2006';

export const STEPS = [
    {
        tab: 'Antes do jogo',
        minute: "0'",
        headline: 'O jogo começa com o tanque cheio',
        text: 'Krustrup 2006 fez biópsias do vasto lateral em 31 jogadores da 4ª divisão dinamarquesa, antes e depois de 3 amistosos. No início, 449 mmol/kg de peso seco, e praticamente toda fibra com glicogênio.',
        sources: [KRUSTRUP],
    },
    {
        tab: 'Apito final',
        minute: "90'",
        headline: 'Quase metade das fibras zerou',
        text: 'No fim, 47 ± 7% das fibras estavam vazias ou quase vazias na coloração fibra a fibra. O jogo é aeróbio na média, mas tem 150 a 250 ações intensas: são elas que esvaziam fibras específicas.',
        sources: [KRUSTRUP, 'Bangsbo 2006 (revisão)'],
    },
    {
        tab: 'A média engana',
        minute: "90'",
        headline: 'A média caiu 43%; as fibras, não por igual',
        text: 'No músculo moído, 449 viraram 255 mmol/kg: sobra mais da metade. A média mistura fibras cheias e vazias. A queda do sprint não acompanhou o glicogênio total, o que aponta para as fibras que esvaziaram.',
        sources: [KRUSTRUP],
    },
    {
        tab: 'Dentro da fibra',
        minute: "90'",
        headline: 'O glicogênio tem endereço',
        text: 'Vigh-Larsen 2022 (outro estudo: 18 homens, 10 × 45 s a ~105% da Wmáx, microscopia eletrônica): nas fibras tipo 2, o glicogênio de dentro das miofibrilas caiu 72% no 1º bloco, contra 45% nas tipo 1. O estoque junto do aparelho contrátil acaba primeiro.',
        sources: ['Vigh-Larsen 2022'],
    },
    {
        tab: 'O tiro',
        minute: "90'",
        headline: 'No fim, o tiro sai 2,8% mais lento',
        text: 'Teste de 5 × 30 m com 25 s de pausa: tempo médio +2,8 ± 0,7% no fim do jogo; +1,6% e +3,6% logo após os períodos intensos de cada tempo. Limites: amistosos, nível amador, associação e não causa.',
        sources: [KRUSTRUP],
    },
] as const;

/** Selos do canto, por passo. */
export const CHIPS: readonly (readonly string[])[] = [
    ['observacional · n = 31 · biópsia'],
    ['observacional · n = 31 · biópsia'],
    ['observacional · n = 31 · biópsia'],
    ['mecanístico · n = 18'],
    ['observacional · n = 31'],
];

export const CALC: Readonly<Record<number, string>> = { 2: '−43%: cálculo', 4: '≈0,8 m: cálculo' };

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'glicogênio antes do jogo', value: '449 mmol/kg' },
    { at: 1, label: 'fibras vazias ou quase vazias', value: '47 ± 7%' },
    { at: 2, label: 'glicogênio no fim · média', value: '255 · −43%' },
    { at: 3, label: 'dentro da miofibrila · tipo 2 × 1', value: '−72% × −45%' },
    { at: 4, label: 'tiro de 30 m no fim do jogo', value: '+2,8% · ≈0,8 m' },
];
