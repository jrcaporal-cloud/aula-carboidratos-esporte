/**
 * Slide 161 · CHO no Jogo — LEATT1989, XIE2026, BAKER2015 (dossiê 06) e BALSOM1999a (dossiê 02); todos confirmados no abstract.
 * Atenção: 111 → 294 tiros é 2,65 vezes (+165%). O abstract escreve "increased by 265%"; a tela mostra só a conta
 * certa (2,6× e +165%), com selo de cálculo. Conferido no abstract (PMID 10350228) em 12/11/2026.
 */

export const LEATT = { placebo: 181, cho: 111 } as const;
export const LEATT_SAVED = Math.round((1 - LEATT.cho / LEATT.placebo) * 100); // 39 (cálculo)

export const BALSOM = { low: 111, high: 294, lowSd: 14, highSd: 29 } as const;
export const BALSOM_RATIO = BALSOM.high / BALSOM.low; // ≈ 2,65 (cálculo)
export const BALSOM_GAIN = Math.round((BALSOM_RATIO - 1) * 100); // 165 (cálculo)

/** Xie 2026: g de Hedges sob fadiga (habilidade/decisão). */
export const XIE_ROWS = [
    { key: 'cho', label: 'carboidrato', g: 0.256, lo: -0.094, hi: 0.605, text: '0,26 (−0,09 a 0,61)' },
    { key: 'caf', label: 'cafeína', g: 0.04, lo: -0.211, hi: 0.291, text: '0,04 (−0,21 a 0,29)' },
] as const;

export interface TeamColumn {
    key: string;
    title: string;
    who: string;
    design: string;
    /** O que fica escrito no rodapé da coluna no último passo. */
    verdict: string;
    verdictTone: 'ok' | 'stone';
}

export const COLUMNS: readonly TeamColumn[] = [
    { key: 'musculo', title: 'No músculo', who: 'Leatt 1989', design: 'ECR paralelo · 5 + 5 · jogo real', verdict: 'poupa glicogênio', verdictTone: 'ok' },
    { key: 'tiro', title: 'No tiro', who: 'Balsom 1999', design: 'cruzado · n = 7 · cicloergômetro', verdict: 'sustenta os tiros', verdictTone: 'ok' },
    { key: 'jogada', title: 'Na jogada', who: 'Xie 2026', design: 'MA multinível · 341 atletas', verdict: 'incerto: cruza o zero', verdictTone: 'stone' },
];

export const STEPS = [
    {
        tab: 'No músculo',
        headline: 'Meio litro antes e no intervalo: menos glicogênio gasto',
        text: 'Leatt 1989, jogo real com 10 jogadores (5 + 5, pareados por posição): 0,5 L de polímero de glicose a 7% 10 min antes e no intervalo (≈70 g). O glicogênio gasto caiu de 181 para 111 mmol/kg ps, 39% a menos. Glicemia igual; desempenho não medido; cegamento não descrito.',
        sources: ['Leatt 1989'],
    },
    {
        tab: 'No tiro',
        headline: 'Com o tanque cheio, 2,6 vezes mais tiros',
        text: 'Balsom 1999, cruzado com 7 homens: 48 h de dieta e exercício deixaram o glicogênio baixo ou alto. Tiros de 6 s a cada 30 s no cicloergômetro: 111 ± 14 tiros completados com glicogênio baixo contra 294 ± 29 com alto: 2,6 vezes mais, ou +165%.',
        sources: ['Balsom 1999a'],
    },
    {
        tab: 'Na jogada',
        headline: 'Na habilidade sob fadiga, o efeito encolhe',
        text: 'Xie 2026, meta-análise multinível: 23 grupos de estudos, 341 atletas, 67 efeitos; futebol em 11 dos 23. Para habilidade e decisão sob fadiga, carboidrato g = 0,26 com IC de −0,09 a 0,61 (p = 0,118); um grupo pesou muito. Certeza GRADE muito baixa.',
        sources: ['Xie 2026'],
    },
    {
        tab: 'A cadeia',
        headline: 'Nítido no músculo e no tiro; na jogada, ainda não',
        text: 'A cadeia perde nitidez a cada elo: medida direta no músculo, desempenho físico no laboratório, habilidade com intervalo cruzando o zero. A revisão de Baker 2015 converge: o CHO melhora a capacidade intermitente na maioria dos estudos (30–60 g/h, solução de 6–7%) e dá resultado misto em sprint, salto e habilidade.',
        sources: ['Baker 2015 (revisão)'],
    },
] as const;

export const CHIPS: readonly (readonly string[])[] = [
    ['ECR paralelo · n = 5 + 5'],
    ['cruzado · n = 7 · não cego'],
    ['MA multinível · GRADE muito baixa'],
    ['3 desenhos · 3 desfechos'],
];

export const CALC: Readonly<Record<number, string>> = { 0: '−39%: cálculo', 1: '2,6× e +165%: cálculo' };
