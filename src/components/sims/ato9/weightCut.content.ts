/**
 * Slide 164 · A Balança e a Água — REALE2017-EJSS, FERNANDEZELIAS2015-AGUA, MURRAY2018, KONDO2021, FOO2022, KING2018
 * e BURKE2021-ACSM (dossiês 02 e 06, confirmados no abstract ou texto completo). Tiago é personagem fictício
 * (kit/cast.ts); o peso de partida dele é inventado para a cena. A conta do Tiago é cálculo nosso, com o piso 1 : 3.
 * Sem protocolo de desidratação: o que falta aparece só como tamanho do problema, com o alerta do ACSM.
 */

import type { LedgerRow } from './A9aShell';

export const TIAGO_START = 76.5; // kg, fictício
export const TIAGO_TARGET = 73; // kg, categoria −73 kg

/** Glicogênio muscular médio (MURRAY2018, ~500 g) × queda de 36,5% num corte rápido (KONDO2021) ≈ 180 g (cálculo). */
export const GLY_KG = 0.18;
export const WATER_PER_G = 3; // piso medido (FERNANDEZELIAS2015); até 17 com água plena
export const WATER_MAX = 17;
export const GLY_WATER_KG = GLY_KG * WATER_PER_G; // 0,54 kg
export const FIBER_DROP_PCT = 0.74; // % da massa, manhã do dia 5 (FOO2022)
export const GUT_KG = Math.round(TIAGO_START * FIBER_DROP_PCT) / 100; // 0,57 kg (cálculo)

export const AFTER_GLY = TIAGO_START - GLY_KG - GLY_WATER_KG;
export const AFTER_GUT = AFTER_GLY - GUT_KG;
export const REST_KG = AFTER_GUT - TIAGO_TARGET;

export const SWEAT_ML = 2000;
export const PLASMA_GAIN_ML = 55;

/** O peso que a balança mostra em cada passo. */
export const SCALE_AT = [TIAGO_START, AFTER_GLY, AFTER_GUT, AFTER_GUT, AFTER_GUT] as const;

export const STEPS = [
    {
        tab: 'Tiago',
        headline: 'Faltam 3,5 kg até a pesagem',
        text: 'Tiago (caso fictício, judô −73 kg) está com 76,5 kg na semana da luta: 4,6% acima da categoria. A pesagem fica de 3 a 24 h antes da luta, e o que sai rápido da balança é água do corpo e conteúdo do intestino (Reale 2017). O glicogênio entra na conta porque sai com água.',
        sources: ['Reale 2017 (revisão)'],
    },
    {
        tab: 'Glicogênio',
        headline: '1 g de glicogênio sai com ≥ 3 g de água',
        text: 'Fernández-Elías 2015 (cruzado, 9 treinados, biópsia): repondo com pouca água (400 mL), cada grama de glicogênio guardou 3 g de água; com água plena (~3,2 L), até 17 g. O 1 : 3 é piso. No Tiago: se o glicogênio do músculo (~500 g) cair 36,5%, como no corte de Kondo 2021, saem ≈180 g e, com eles, pelo menos 540 g de água.',
        sources: ['Fernández-Elías 2015', 'Murray 2018 (revisão)', 'Kondo 2021'],
    },
    {
        tab: 'Intestino',
        headline: 'Pouca fibra esvazia parte do intestino',
        text: 'Foo 2022 (pré-pós, 19 homens não atletas): menos de 10 g de fibra por dia durante 4 dias, com a mesma energia e os mesmos macros. Massa −0,58 ± 0,83 kg (−0,74%) na manhã do 5º dia; o DP passou da média e 18 de 19 toleraram. No Tiago, ≈0,57 kg.',
        sources: ['Foo 2022'],
    },
    {
        tab: 'O que falta',
        headline: 'O resto só sairia como água do corpo',
        text: 'As duas alavancas somam ≈1,3 kg; faltam ≈2,2 kg. O que ainda sai rápido é água corporal, e é aí que moram as técnicas perigosas. O consenso do ACSM (Burke 2021) pede regras que as proíbam. Não há protocolo aqui: a conta mostra só o tamanho do problema.',
        sources: ['Burke 2021 (consenso ACSM)'],
    },
    {
        tab: 'Não é cantil',
        headline: 'Essa água não é cantil',
        text: 'King 2018 (in vitro e modelagem): a água do glicogênio entra no equilíbrio osmótico como qualquer outra. Numa perda de 2 L de suor, começar com o glicogênio cheio devolve ~55 mL ao plasma (+1,57%). Não é reserva de água.',
        sources: ['King 2018'],
    },
] as const;

export const CHIPS: readonly (readonly string[])[] = [
    ['revisão'],
    ['cruzado · n = 9'],
    ['pré-pós · n = 19'],
    ['consenso de especialistas'],
    ['in vitro + modelagem'],
];

export const CALC: Readonly<Record<number, string>> = {
    1: '≈0,72 kg: cálculo',
    2: '−0,57 kg: cálculo',
    3: '≈2,2 kg: cálculo',
};

export const LEDGER: readonly LedgerRow[] = [
    { at: 1, label: '1 · glicogênio ≈180 g + água ≥540 g', value: '−0,72 kg' },
    { at: 2, label: '2 · fibra < 10 g/dia por 4 dias', value: '−0,57 kg' },
    { at: 3, label: '3 · o que falta, só como água corporal', value: '≈2,2 kg' },
    { at: 4, label: 'ressalva · 2 L de suor → volta ao plasma', value: '~55 mL' },
];
