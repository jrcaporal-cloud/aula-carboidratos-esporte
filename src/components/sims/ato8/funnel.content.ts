/**
 * Slide 141 · Do músculo ao cronômetro (dossiê 05·IMPEY2018, GEJLNYBO2021, YEO2008, HANSEN2005, MARQUET2016a, GEJL2017).
 * As bolinhas de cada trecho do funil são cálculo a partir das porcentagens do resumo.
 */

export interface FunnelStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const FUNNEL_STEPS: readonly FunnelStep[] = [
    {
        tab: 'Sinal',
        headline: '3 em cada 4 estudos acendem o músculo',
        text: 'Impey 2018, revisão narrativa com contagem: sinalização maior em 73% de 11 estudos, expressão gênica em 75% de 12, enzimas oxidativas em 78% de 9. Exemplo: Yeo 2008 (ECR, 14 ciclistas treinados, 3 semanas), citrato sintase 45 → 54 e β-HAD 18 → 23 mmol/kg/min só no grupo Low; PGC-1α proteína sem mudança.',
        sources: ['Impey 2018 (Sports Med)', 'Yeo 2008 (J Appl Physiol)', 'Hansen 2005'],
    },
    {
        tab: 'Cronômetro',
        headline: 'No cronômetro, pouco mais de 1 em 3',
        text: 'Desempenho melhor em só 37% de 11 estudos; 63% sem mudança. No Yeo, o contrarrelógio de 60 min melhorou ~10% nos DOIS grupos, e treinar duas vezes no dia comprometeu a sessão intensa. A enzima subiu; a prova não se separou.',
        sources: [],
    },
    {
        tab: 'Treinados',
        headline: 'Em atletas treinados, encosta no zero',
        text: 'Gejl e Nybo 2021: revisão sistemática com meta-análise de efeito fixo, VO₂máx ≥ 60 (homens) ou ≥ 55 (mulheres). 9 estudos de 11 a 26 atletas, 1 a 4 semanas, sem cegamento, PEDro 5,8 de 10: SMD 0,17, IC 95% −0,15 a 0,49.',
        sources: ['Gejl & Nybo 2021 (JISSN)', 'Marquet 2016', 'Gejl 2017'],
    },
    {
        tab: 'Por que não vira',
        headline: 'O efeito encolhe quando o desenho melhora',
        text: 'De 2005 a 2021, quanto mais treinado o atleta e mais rigoroso o desenho, menor o efeito. Sinal agudo não é adaptação crônica, e adaptação não é prova. O atleta treinado tem pouca margem, e o preço aparece na sessão intensa, como mostra o próximo slide.',
        sources: [],
    },
];

/** Trechos do funil: fração positiva, nº de estudos e positivos (cálculo: % × n, arredondado). */
export interface FunnelStage {
    id: string;
    label: string;
    pct: number;
    n: number;
    pos: number;
    at: number;
}

export const STAGES: readonly FunnelStage[] = [
    { id: 'sig', label: 'sinalização', pct: 73, n: 11, pos: 8, at: 0 },
    { id: 'gene', label: 'genes', pct: 75, n: 12, pos: 9, at: 0 },
    { id: 'enz', label: 'enzimas', pct: 78, n: 9, pos: 7, at: 0 },
    { id: 'perf', label: 'desempenho', pct: 37, n: 11, pos: 4, at: 1 },
];

/** Meta-análise de Gejl & Nybo 2021: SMD com IC 95%. */
export const META = { est: 0.17, lo: -0.15, hi: 0.49, p: '0,29', k: 9 } as const;

/** Linha do tempo "até o nulo": cada cartão entra no passo `at`; `extra` entra em `extraAt`. */
export interface TimelineCard {
    year: string;
    who: string;
    n: string;
    result: string;
    /** O desempenho se separou do controle? */
    positive: boolean;
    at: number;
    extra?: string;
    extraAt?: number;
}

export const TIMELINE: readonly TimelineCard[] = [
    { year: '2005', who: 'Hansen', n: 'n = 7', result: 'LOW ↑ mais (não treinados)', positive: true, at: 0 },
    { year: '2008', who: 'Yeo', n: 'n = 14', result: 'enzimas ↑ só Low', positive: false, at: 0, extra: 'prova: igual', extraAt: 1 },
    { year: '2016', who: 'Marquet', n: 'n = 21', result: '−2,9 × −0,1% (não cego)', positive: true, at: 2 },
    { year: '2017', who: 'Gejl', n: 'n = 26 · elite', result: '+5% nos dois', positive: false, at: 2 },
    { year: '2021', who: 'MA', n: '9 estudos', result: 'SMD 0,17', positive: false, at: 2 },
];

/** Livro-caixa do painel: o funil em números, linha a linha (entra no passo `at` e fica). */
export const FUNNEL_LEDGER = [
    { at: 0, label: 'sinal no músculo', value: '73–78%' },
    { at: 1, label: 'desempenho melhor', value: '37%' },
    { at: 2, label: 'meta-análise, SMD', value: '0,17 (P 0,29)' },
] as const;
