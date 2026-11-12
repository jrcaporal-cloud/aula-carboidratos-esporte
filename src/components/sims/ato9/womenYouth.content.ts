/**
 * Slide 167 · Mulheres e Jovens — WALLIS2006, MCNULTY2020, TARNOPOLSKY1995/2001, JAMES2001, TIMMONS2003, LEITES2016
 * (dossiê 06; JAMES2001 e TARNOPOLSKY2001 também no 04). Todos confirmados no abstract.
 */
import { C } from '../kit/palette';
import type { LedgerItem } from './FrameB';

/** Wallis 2006: pico de oxidação do CHO ingerido com 90 g/h (g/min). */
export const WALLIS = { men: 0.7, women: 0.65 } as const;

/** McNulty 2020: folicular inicial × demais fases (ES0,5 e intervalo de credibilidade 95%). */
export const CYCLE = { es: -0.06, lo: -0.16, hi: 0.04 } as const;

/** Tarnopolsky 1995: CHO de 55–60% → 75% da energia; ganho de glicogênio (%). */
export const LOAD_1995 = { men: 41, women: 0 } as const;
/** James 2001: 12 g/kg de massa magra/d por 3 dias (mmol/kg peso úmido, antes → depois). */
export const LOAD_2001 = { men: { before: 109, after: 183 }, women: { before: 108, after: 193 } } as const;

/** Timmons 2003: CHO ingerido oxidado (mg/kg/min). Leites 2016, a 38 °C (mg/kg de massa magra/min). */
export const TIMMONS = { men: 6.2, boys: 8.8 } as const;
export const LEITES = { men: 2.5, boys: 2.0 } as const;
/** Cálculo nosso: 8,8 / 6,2. */
export const BOYS_EDGE = Math.round((TIMMONS.boys / TIMMONS.men - 1) * 100);

export interface WomenStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    source: string;
}

export const STEPS: readonly WomenStep[] = [
    {
        tab: 'Oxidação',
        headline: 'A mesma meta em g/h',
        text: 'Wallis 2006: 8 homens e 8 mulheres treinados, cruzado, 2 h a ~67% do VO₂máx bebendo 1,5 g/min de glicose (90 g/h) marcada. Pico de oxidação do CHO ingerido: 0,70 g/min neles e 0,65 nelas. Em nenhum dos sexos a glicose poupou o glicogênio muscular.',
        design: 'cruzado · 8 H + 8 M · isótopos',
        source: 'Wallis 2006 (Am J Physiol Endocrinol Metab)',
    },
    {
        tab: 'Ciclo',
        headline: 'A fase do ciclo pesa pouco',
        text: 'McNulty 2020, meta-análise bayesiana de 78 estudos: na folicular inicial o desempenho foi trivialmente menor, ES −0,06 (ICr 95% −0,16 a 0,04), com qualidade baixa em 42% dos estudos. Não há base para prescrever CHO por fase do ciclo: individualize pelo relato da atleta.',
        design: 'RS + meta-análise · 78 estudos',
        source: 'McNulty 2020 (Sports Med)',
    },
    {
        tab: 'A carga',
        headline: '"Mulher não carrega" era dose',
        text: 'Tarnopolsky 1995 subiu o CHO para 75% da energia: eles ganharam 41% de glicogênio, elas 0%, porque comiam menos CHO por kg. James 2001, com 12 g/kg de massa magra por 3 dias: 108 → 193 nelas e 109 → 183 mmol/kg neles. Tarnopolsky 2001: elas carregaram quando a energia também subiu.',
        design: 'comparação entre sexos · biópsia',
        source: 'Tarnopolsky 1995 e 2001 (J Appl Physiol) · James 2001 (Eur J Appl Physiol)',
    },
    {
        tab: 'Meninos',
        headline: 'Meninos queimam mais do copo',
        text: 'Timmons 2003, cruzado, 12 meninos de ~10 anos e 10 homens, 60 min a 70% do VO₂pico com CHO a 6% marcado: 8,8 contra 6,2 mg/kg/min de CHO ingerido oxidado (+42%), 21,8% contra 14,6% da energia. E eles usam menos do próprio glicogênio.',
        design: 'cruzado · 12 meninos + 10 homens · 13C',
        source: 'Timmons 2003 (J Appl Physiol)',
    },
    {
        tab: 'No calor',
        headline: 'A 38 °C, a vantagem inverte',
        text: 'Leites 2016, cruzado duplo-cego, 7 meninos de 11 anos e 9 homens, 4 × 20 min a 38 °C com CHO a 8%: os meninos oxidaram menos, 2,0 contra 2,5 mg/kg de massa magra/min. Criança não é adulto pequeno, e o contexto pode inverter o achado.',
        design: 'cruzado duplo-cego · 7 meninos + 9 homens',
        source: 'Leites 2016 (J Appl Physiol)',
    },
];

export const LEDGER: readonly LedgerItem[] = [
    { at: 0, label: 'pico de oxidação, mulheres × homens', value: '0,65 × 0,70', color: C.glucoseSoft },
    { at: 1, label: 'fase folicular inicial (ES)', value: '−0,06', color: C.stone },
    { at: 2, label: 'carga com 12 g/kg MM, mulheres', value: '108 → 193', color: C.glycogenSoft },
    { at: 3, label: 'CHO ingerido, meninos × homens', value: `+${BOYS_EDGE}%`, color: C.glucoseSoft },
    { at: 4, label: 'a 38 °C, meninos × homens', value: '2,0 × 2,5', color: C.glucoseSoft },
];
