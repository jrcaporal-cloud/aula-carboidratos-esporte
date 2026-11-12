/**
 * Slide 126 · Lara, Jogo a Cada 72 Horas. Lara é fictícia; os números são reais e de homens.
 * Dossiê 06: KRUSTRUP2011 (glicogênio 0 e 24 h após o jogo), ANDERSON2017 (Premier League, g/kg por tipo de dia),
 * GUNNARSSON2013 (% da energia não garante ressíntese). Dossiê 07: BURKE2011 (faixa 6–10 g/kg/d, carga alta).
 * Gramas para 60 kg = cálculo.
 */
import { C } from '../kit/palette';
import type { LedgerRow } from './RefillPanel';

export type DayRole = 'jogo' | 'recuperação' | 'véspera';

export interface Day {
    n: number;
    role: DayRole;
    /** Glicogênio do Krustrup 2011 (mmol/kg ps; controle = 449), só onde o resumo traz o valor. */
    tank?: { value: number; text: string; when: string };
    /** Onde o estudo acompanhou, mas o resumo não traz o número. */
    unknown?: string;
}

export const CONTROL = 449;

export const DAYS: readonly Day[] = [
    { n: 1, role: 'jogo', tank: { value: 193, text: '193', when: 'fim do jogo' } },
    { n: 2, role: 'recuperação', tank: { value: 328, text: '328', when: '24 h' } },
    { n: 3, role: 'véspera', unknown: '48 h' },
    { n: 4, role: 'jogo', unknown: '72 h' },
    { n: 5, role: 'recuperação' },
    { n: 6, role: 'véspera' },
    { n: 7, role: 'jogo' },
];

/** Premier League (Anderson 2017): CHO médio por tipo de dia, g/kg; os dias sem jogo usam a média de treino. */
export const GKG = { jogo: 6.4, treino: 4.2 } as const;
export const GKG_TEXT = { jogo: '6,4', treino: '4,2' } as const;
/** Cálculo para 60 kg. */
export const GRAMS = { jogo: '384 g', treino: '252 g' } as const;
/** Faixa diária de carga alta (1–3 h/d), Burke 2011. */
export const BAND = { lo: 6, hi: 10, text: '6–10 g/kg/d', grams: '360–600 g' } as const;
export const BAR_MAX = 10.5;

export interface LaraStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    note: string;
    sources: readonly string[];
}

export const LARA_STEPS: readonly LaraStep[] = [
    {
        tab: 'Lara',
        headline: 'Três jogos em sete dias',
        color: C.text,
        text: 'Lara, 22 anos, 60 kg, meio-campo, joga a cada 72 h e come pouco carboidrato “para não inchar”. Entre um jogo e outro há um dia de recuperação e uma véspera. A pergunta da consulta: o glicogênio que o jogo gasta volta antes do próximo apito?',
        note: 'Caso fictício, montado para a aula; os dados que seguem são de estudos com homens.',
        sources: [],
    },
    {
        tab: 'Depois do jogo',
        headline: 'Um dia depois, ainda falta um quarto',
        color: C.glycogenSoft,
        text: 'Krustrup 2011: 7 jogadores homens de alto nível, biópsias seriadas, dieta otimizada. Glicogênio 57% abaixo do controle no fim do jogo (193 × 449 mmol/kg ps) e ainda 27% abaixo 24 h depois (328). A força máxima também caiu 11% e 10% nos mesmos momentos.',
        note: 'O estudo seguiu até 72 h, mas o resumo não traz 48 e 72 h: por isso os tanques com “?”.',
        sources: ['Krustrup 2011'],
    },
    {
        tab: 'Premier League',
        headline: 'Os profissionais já mudam o prato com o dia',
        color: C.glucose,
        text: 'Anderson 2017: 6 jogadores da Premier League por 7 dias, gasto medido por água duplamente marcada. Carboidrato de 6,4 ± 2,2 g/kg no dia de jogo e 4,2 ± 1,4 em dia de treino; 32,3 g/h durante o jogo contra 3,1 no treino. Gasto de 3566 e ingestão de 3186 kcal/d, sem diferença.',
        note: 'Ingestão por autorrelato, n = 6.',
        sources: ['Anderson 2017'],
    },
    {
        tab: 'A régua',
        headline: 'Abaixo da faixa onde mais importa',
        color: C.ok,
        text: 'Para carga alta (1–3 h/d), a faixa é de 6–10 g/kg/d (Burke 2011). Na Premier League, a ingestão ficou abaixo dela justamente na véspera e na recuperação. Gunnarsson 2013 (ECR, n = 16): 71% contra 55% da energia em carboidrato, ressíntese igual em 48 h.',
        note: 'Dieta “rica em %” não garante: a meta se escreve em g/kg.',
        sources: ['Burke 2011 (consenso)', 'Gunnarsson 2013'],
    },
    {
        tab: 'A conta da Lara',
        headline: 'Para 60 kg: 252 g não é 360 g',
        color: C.glucoseSoft,
        text: 'No peso da Lara, o prato da Premier League daria 384 g no dia de jogo e 252 g no treino; a faixa de 6–10 g/kg seria 360–600 g. Os dias que mais pedem conta são o seguinte ao jogo e a véspera do próximo: é ali que o tanque de 24 h ainda está em −27%.',
        note: 'Cálculo sobre dados de homens; a Lara é fictícia.',
        sources: [],
    },
];

export const LARA_LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'intervalo entre jogos', value: '72 h', color: C.text },
    { at: 1, label: 'glicogênio · fim do jogo', value: '−57%', color: C.glycogenSoft },
    { at: 1, label: 'glicogênio · 24 h depois', value: '−27%', color: C.glycogenSoft },
    { at: 2, label: 'CHO · jogo × treino', value: '6,4 × 4,2 g/kg', color: C.glucoseSoft },
    { at: 2, label: 'CHO durante o jogo', value: '32,3 g/h', color: C.glucoseSoft },
    { at: 3, label: 'faixa · carga alta', value: '6–10 g/kg/d', color: C.ok },
    { at: 4, label: 'Lara, 60 kg · treino × faixa', value: '252 × 360–600 g', color: C.glucoseSoft },
];

/** Selos de desenho do canto, por passo (o "caso fictício" fica sempre). */
export const LARA_DESIGN: readonly (string | null)[] = [
    null,
    'Krustrup 2011 · biópsias · n = 7',
    'Anderson 2017 · n = 6',
    'Gunnarsson 2013 · ECR · n = 16',
    null,
];
