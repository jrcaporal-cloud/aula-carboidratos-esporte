/**
 * Slide 166 · Calor e Altitude — JENTJENS2002, FEBBRAIO1996, PERONNET2006, BRAUN2000, STELLINGWERFF2019 (dossiê 06,
 * confirmados no abstract; Stellingwerff no texto completo).
 */
import { C } from '../kit/palette';
import type { LedgerItem } from './FrameB';

/** Jentjens 2002: 90 min a 55% Wmax, 16,4 °C × 35,4 °C, glicose a 8%. g/min. */
export const HEAT = {
    cool: { temp: '16 °C', glycogen: 1.66, exo: 0.84 },
    hot: { temp: '35 °C', glycogen: 2.07, exo: 0.76 },
} as const;
/** Febbraio 1996 comparou 33 °C com 5 °C; nas faixas de altitude a temperatura não é dado ("—"). */
export const FEBBRAIO_TEMP = '33 × 5 °C';

/** Cálculos nossos a partir dos números acima. */
export const GLY_UP = Math.round((HEAT.hot.glycogen / HEAT.cool.glycogen - 1) * 100); // 25
export const EXO_DOWN = Math.round((1 - HEAT.hot.exo / HEAT.cool.exo) * 100); // 10

/** Febbraio 1996: as três soluções testadas a 33 °C (nenhuma prolongou) e a vencedora a 5 °C. */
export const FEBBRAIO_DOSES = ['4,2%', '7%', '14%'] as const;

/** Péronnet 2006, mesma carga relativa (77%): normóxia × hipóxia de 4.300 m. */
export const ALT = {
    choShare: { sea: 78.1, alt: 92.0 },
    exoGrams: { sea: 20.2, alt: 17.2 },
} as const;

export const WOMEN_DROP = '−23%'; // Braun 2000: −23,2%, oxidação de CHO corrigida pelo gasto, 4.300 m × nível do mar
/** Braun 2000 desenhado como índice (nível do mar = 100; 100 − 23,2 = 76,8): cálculo nosso, só para a barra. */
export const BRAUN_INDEX = { sea: 100, alt: 76.8 } as const;

export interface HeatStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    source: string;
}

export const STEPS: readonly HeatStep[] = [
    {
        tab: '16 °C',
        headline: 'A referência: 16 °C',
        text: 'Jentjens 2002: 9 ciclistas treinados, cruzado, 90 min a 55% da Wmáx bebendo glicose a 8% marcada com 13C. A 16 °C, o músculo queimou 1,66 g/min de glicogênio e oxidou 0,84 g/min da glicose bebida nos 30 min finais.',
        design: 'cruzado · n = 9 · 13C',
        source: 'Jentjens 2002 (J Appl Physiol)',
    },
    {
        tab: '35 °C',
        headline: 'A 35 °C: mais estoque, menos copo',
        text: 'Mesmos ciclistas, mesma carga: glicogênio 2,07 g/min (+25%) e glicose bebida 0,76 g/min (−10%). O músculo puxa mais do próprio estoque e aproveita menos o que vem do copo; a explicação proposta é menos sangue para o intestino.',
        design: 'cruzado · n = 9 · 13C',
        source: 'Jentjens 2002 (J Appl Physiol)',
    },
    {
        tab: 'Até a fadiga',
        headline: 'No calor, o CHO não prolongou',
        text: 'Febbraio 1996, cruzado, até a fadiga a 70% do VO₂pico, grupos de 6 por condição: a 33 °C, nenhuma solução (4,2%, 7% ou 14%) aumentou o tempo em relação ao placebo; a 5 °C, a de 7% venceu. No calor, a fadiga é térmica antes de ser de combustível.',
        design: 'cruzado · 33 °C × 5 °C · até a fadiga',
        source: 'Febbraio 1996 (Med Sci Sports Exerc)',
    },
    {
        tab: '4.300 m',
        headline: 'Mais CHO, mas não do copo',
        text: 'Péronnet 2006: 5 homens, câmara hipobárica, 80 min com 140 g de glicose 13C. Na mesma carga relativa (77%), o CHO foi 92,0% da energia na hipóxia contra 78,1% no nível do mar, mas a glicose bebida oxidada não subiu: 17,2 contra 20,2 g em 40 min.',
        design: 'cruzado · n = 5 · câmara hipobárica',
        source: 'Péronnet 2006 (Eur J Appl Physiol)',
    },
    {
        tab: 'Mulheres',
        headline: 'Em mulheres, o sinal inverte',
        text: 'Braun 2000: 16 mulheres jovens, traçadores, 4.300 m: a oxidação de CHO corrigida pelo gasto caiu 23,2%. A regra "altitude pede mais CHO" veio de homens. Em 1.600–2.400 m, altitude típica de treino, CHO extra é especulação.',
        design: '16 mulheres · traçadores',
        source: 'Braun 2000 (J Appl Physiol) · Stellingwerff 2019 (Sports Med)',
    },
];

export const LEDGER: readonly LedgerItem[] = [
    { at: 1, label: 'glicogênio queimado, 35 × 16 °C', value: `+${GLY_UP}%`, color: C.glycogenSoft },
    { at: 1, label: 'glicose bebida oxidada, 35 × 16 °C', value: `−${EXO_DOWN}%`, color: C.glucoseSoft },
    { at: 2, label: 'soluções que prolongaram a 33 °C', value: '0 de 3', color: C.stone },
    { at: 3, label: 'CHO na energia a 4.300 m (homens)', value: '92%', color: C.glucoseSoft },
    { at: 4, label: 'oxidação de CHO a 4.300 m (mulheres)', value: WOMEN_DROP, color: C.glucoseSoft },
];
