/**
 * Slide 84 · A Refeição de 3–4 Horas. Fonte única: dossiê 04 (confirmados no abstract).
 *   COYLE1985: cruzado, n = 7; refeição rica em CHO 4 h antes × jejum de 16 h: glicogênio do vasto lateral +42% no início.
 *   SHERMAN1989: cruzado, 4 doses líquidas 4 h antes: 0, 45, 156, 312 g; só 312 g: +15% de desempenho × placebo (n não consta).
 *   SCHABORT1999: cruzado, n = 7; café com 100 g de CHO 3 h antes × jejum: 136 × 109 min até a fadiga;
 *     glicogênio muscular igual → o benefício deve vir do fígado.
 *   AIRD2018: meta-análise, 46 estudos: alimentado melhora o aeróbio prolongado (P = 0,012), não o curto (P = 0,687).
 */
export const MARKS = [
    { id: 'm4', label: '−4 h' },
    { id: 'm3', label: '−3 h' },
    { id: 'm2', label: '−2 h' },
    { id: 'm1', label: '−1 h' },
    { id: 'go', label: 'largada' },
] as const;

/** Estudos pendurados no relógio regressivo (passo em que aparecem). */
export const PINS = [
    { mark: 'm4', label: 'Coyle 1985', from: 0 },
    { mark: 'm4', label: 'Sherman 1989', from: 1 },
    { mark: 'm3', label: 'Schabort 1999', from: 2 },
] as const;

/** Marca ativa por passo (o passo 3 olha a prova inteira). */
export const ACTIVE: readonly string[] = ['m4', 'm4', 'm3', 'go'];

export const BEATS: readonly string[] = [
    '4 horas antes, a refeição enche o músculo: +42% de glicogênio na largada.',
    'Na escada de doses, só a maior rendeu: 312 g, 4 horas antes.',
    '3 horas antes, 100 g no café: mais tempo até a fadiga, com o mesmo glicogênio muscular.',
    'Comer antes ajuda o esforço longo. No curto, tanto faz.',
];

export const COYLE = { value: '+42%', caption: 'de glicogênio muscular na largada, refeição × jejum' } as const;

export const SHERMAN = {
    doses: [0, 45, 156, 312],
    max: 312,
    win: '+15%',
    winCaption: 'desempenho × placebo',
    axis: 'g de carboidrato, 4 h antes',
} as const;

export const SCHABORT = {
    rows: [
        { label: 'café, 100 g', min: 136 },
        { label: 'jejum', min: 109 },
    ],
    max: 150,
    unit: 'min até a fadiga',
    note: 'músculo igual nos dois: o candidato é o fígado, que o jejum da noite esvazia',
} as const;

export const AIRD = {
    rows: [
        { label: 'esforço prolongado', verdict: 'ajuda', p: 'P = 0,012', yes: true },
        { label: 'esforço curto', verdict: 'tanto faz', p: 'P = 0,687', yes: false },
    ],
} as const;

export const DESIGNS: readonly string[] = [
    'cruzado · n = 7 · sem teste de desempenho',
    'cruzado · 4 doses · contra placebo',
    'cruzado · n = 7 · tempo até a fadiga',
    'meta-análise · 46 estudos',
];

export const SOURCES: readonly string[] = [
    'Coyle EF et al. J Appl Physiol 1985;59(2):429-433.',
    'Sherman WM et al. Med Sci Sports Exerc 1989;21(5):598-604.',
    'Schabort EJ et al. Med Sci Sports Exerc 1999;31(3):464-471.',
    'Aird TP, Davies RW, Carson BP. Scand J Med Sci Sports 2018;28(5):1476-1493.',
];
