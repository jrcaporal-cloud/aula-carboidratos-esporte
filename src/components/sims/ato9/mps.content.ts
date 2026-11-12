/**
 * Slide 163 · Insulina Sobe, Síntese Não — KOOPMAN2007, STAPLES2011, GLYNN2010 (dossiê 06, confirmados no abstract).
 * Insulina = área sob a curva em 6 h (U·6h/L), na ordem crescente da dose de CHO; síntese = FSR da proteína mista (%/h).
 */

import type { LedgerRow } from './A9aShell';

export const PROTEIN = 0.3; // g/kg/h nos três braços
export const HOURS = 6;

export const ARMS = [
    { dose: 0, doseLabel: '0', insulin: 1.5, fsr: 0.10 },
    { dose: 0.15, doseLabel: '0,15', insulin: 3.7, fsr: 0.10 },
    { dose: 0.6, doseLabel: '0,6', insulin: 18.4, fsr: 0.11 },
] as const;

export const INSULIN_MAX = 20;
export const FSR_MAX = 0.12;
/** Cálculo nosso: 18,4 / 1,5. */
export const INSULIN_FOLD = Math.round(ARMS[2].insulin / ARMS[0].insulin);

export const REPLICAS = [
    {
        key: 'staples', who: 'Staples 2011', design: 'cruzado unilateral · n = 9',
        what: '25 g de whey ± 50 g de maltodextrina',
        up: [{ label: 'insulina', value: '5×' }, { label: 'glicose', value: '17,5×' }],
        same: 'síntese e degradação iguais',
    },
    {
        key: 'glynn', who: 'Glynn 2010', design: 'paralelo · n = 13',
        what: '~20 g de aminoácidos essenciais + 30 ou 90 g de CHO',
        up: [{ label: 'CHO', value: '3×' }],
        same: 'síntese e quebra iguais',
    },
] as const;

export const STEPS = [
    {
        tab: 'O desenho',
        headline: 'Mesma proteína, três doses de carbo',
        text: 'Koopman 2007: 10 homens ativos, cruzado, isótopos estáveis. Depois do treino resistido, 6 h de bebida com 0,3 g/kg/h de proteína e 0, 0,15 ou 0,6 g/kg/h de carboidrato. Só o carbo muda entre os braços.',
        sources: ['Koopman 2007'],
    },
    {
        tab: 'Insulina',
        headline: 'A insulina subiu cerca de 12 vezes',
        text: 'Área sob a curva da insulina em 6 h: 1,5, 3,7 e 18,4 U·6h/L. Do braço sem carbo ao de 0,6 g/kg/h, cerca de 12 vezes (cálculo nosso). Se a insulina somasse síntese, este seria o braço vencedor.',
        sources: ['Koopman 2007'],
    },
    {
        tab: 'Síntese',
        headline: 'A síntese não saiu do lugar',
        text: 'Taxa fracionária de síntese da proteína mista: 0,10, 0,10 e 0,11 %/h, sem diferença. Com proteína suficiente, o pico de insulina do carboidrato não acrescenta síntese. Limite: n = 10, homens ativos, 6 h de medida.',
        sources: ['Koopman 2007'],
    },
    {
        tab: 'Réplicas',
        headline: 'Outros desenhos, o mesmo desacoplamento',
        text: 'Com whey e maltodextrina (Staples 2011) ou com aminoácidos e o triplo de carbo (Glynn 2010), o carbo extra não mudou a síntese nem freou mais a quebra. Certeza moderada: mecanísticos, n pequeno.',
        sources: ['Staples 2011', 'Glynn 2010'],
    },
] as const;

export const CHIPS: readonly (readonly string[])[] = [
    ['cruzado · n = 10 · isótopos'],
    ['cruzado · n = 10 · isótopos'],
    ['cruzado · n = 10 · isótopos'],
    ['cruzado n = 9 · paralelo n = 13'],
];

export const CALC: Readonly<Record<number, string>> = { 0: 'totais em 6 h: cálculo', 1: '~12×: cálculo', 3: 'Glynn 3×: cálculo' };

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'proteína nos três braços', value: '0,3 g/kg/h' },
    { at: 1, label: 'insulina, sem CHO → 0,6 g/kg/h', value: '1,5 → 18,4' },
    { at: 2, label: 'síntese proteica (%/h)', value: '0,10 · 0,10 · 0,11' },
    { at: 3, label: 'Staples 2011 · insulina 5×', value: 'síntese =' },
    { at: 3, label: 'Glynn 2010 · 30 × 90 g de CHO', value: 'quebra =' },
];
