/**
 * Slide 164 · A Balança e a Água — FERNANDEZELIAS2015-AGUA, KING2018, FOO2022, REALE2017-EJSS, KREITZMAN1992 e BURKE2021-ACSM
 * (dossiê 06, confirmados no abstract). Tiago é personagem fictício (kit/cast.ts); o peso de partida dele é inventado para a cena.
 * Sem protocolo de desidratação: só os dados dos estudos, com a fonte.
 */

import type { LedgerRow } from './A9aShell';

export const TIAGO_START = 76.5; // kg, fictício
export const TIAGO_TARGET = 73; // kg, categoria −73 kg
export const FIBER_DROP_PCT = 0.74; // % da massa, manhã do dia 5 (FOO2022)
/** Cálculo nosso: −0,74% aplicado ao peso fictício do Tiago. */
export const TIAGO_AFTER_FIBER = TIAGO_START * (1 - FIBER_DROP_PCT / 100);

export const WATER_MIN = 3; // g de água por g de glicogênio com pouca água
export const WATER_MAX = 17; // g de água por g de glicogênio com água plena

export const SWEAT_ML = 2000;
export const PLASMA_GAIN_ML = 55;

/** Foo 2022: perda média de massa (kg) por dia da dieta pobre em fibra. */
export const FOO_DAYS = [
    { day: 'início', kg: 0 },
    { day: 'dia 4', kg: -0.4 },
    { day: '5º, manhã', kg: -0.58 },
] as const;

export const LEVERS = [
    { key: 'gly', label: 'glicogênio, com a água dele', at: 1 },
    { key: 'gut', label: 'conteúdo do intestino', at: 4 },
    { key: 'water', label: 'água corporal', at: 3 },
] as const;

export const STEPS = [
    {
        tab: 'Tiago',
        headline: 'O que sai rápido da balança',
        text: 'Tiago (caso fictício, judô −73 kg) pesa 76,5 kg e se pesa na véspera. As pesagens ficam de 3 a 24 h antes da luta, e a perda aguda vem da água corporal e do conteúdo do intestino (Reale 2017). O glicogênio entra junto, porque sai com água.',
        sources: ['Reale 2017 (revisão)'],
    },
    {
        tab: 'Piso 1 : 3',
        headline: 'Cada grama sai com pelo menos 3 g de água',
        text: 'Fernández-Elías 2015, cruzado, 9 homens treinados: 150 min a 33 °C (−4,6% de massa, glicogênio −44%, água muscular −13%). Recuperando com 250 g de CHO em 400 mL, cada grama de glicogênio guardou 3 g de água.',
        sources: ['Fernández-Elías 2015'],
    },
    {
        tab: 'Até 1 : 17',
        headline: 'Com água à vontade, até 17 g',
        text: 'Mesmo xarope, repondo a água perdida (~3,2 L): o glicogênio voltou parecido (79 × 87 g/kg ps), e a água guardada por grama chegou a 17 g. O "1 g leva 3 g" é piso, não constante; em dieta muito restrita, Kreitzman 1992 mediu 3 a 4 partes.',
        sources: ['Kreitzman 1992'],
    },
    {
        tab: 'Não é cantil',
        headline: 'Essa água não protege da desidratação',
        text: 'King 2018 (in vitro e modelagem): a água do glicogênio entra no equilíbrio osmótico como qualquer outra. Numa perda de 2 L de suor, começar com o glicogênio cheio devolve ~55 mL ao plasma (+1,57%). Não é reserva para o atleta desidratado.',
        sources: ['King 2018'],
    },
    {
        tab: 'Fibra',
        headline: 'Menos resíduo: −0,74% sem mexer em CHO nem água',
        text: 'Foo 2022, pré-pós, 19 homens não atletas: menos de 10 g de fibra/dia por 4 dias, mesma energia e macros. Massa −0,58 ± 0,83 kg (−0,74%) na manhã do 5º dia; 18 de 19 toleraram; o DP passou da média. No Tiago, ~0,57 kg.',
        sources: ['Foo 2022', 'Burke 2021 (consenso ACSM)'],
    },
] as const;

export const CHIPS: readonly (readonly string[])[] = [
    ['revisão'],
    ['cruzado · n = 9 · biópsia'],
    ['cruzado · n = 9 · biópsia'],
    ['in vitro + modelagem'],
    ['pré-pós · n = 19'],
];

export const CALC: Readonly<Record<number, string>> = { 4: '−0,57 kg: cálculo' };

export const LEDGER: readonly LedgerRow[] = [
    { at: 1, label: 'glicogênio : água, pouca água', value: '1 : 3' },
    { at: 2, label: 'glicogênio : água, água plena', value: '1 : 17' },
    { at: 3, label: '2 L de suor → devolvido ao plasma', value: '~55 mL' },
    { at: 4, label: 'fibra < 10 g/dia por 4 dias', value: '−0,74%' },
];
