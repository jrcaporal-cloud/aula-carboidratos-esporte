/**
 * Slide 69 · O glicogênio também fala. Fontes: dossiê 02/05 · BARTLETT2013 (n = 8 homens ativos, corrida intervalada;
 * glicogênio 467 × 103 mmol/kg ps; p-ACC^Ser79 1,4 × 2,9; p-p53^Ser15 0,9 × 2,6; mRNAs de PDK4, TFAM, COX IV e PGC-1α
 * maiores com LOW; só o PGC-1α subiu com o exercício, ~3×, igual nos dois), MACDONALD2003 (a AMPK "lê" o glicogênio),
 * HANSEN2005 (uma perna × a outra, n = 7 não treinados, 10 semanas), IMPEY2018 (73% de 11, 75% de 12, 78% de 9 × 37% de 11).
 */

export interface SignalStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const BARTLETT = 'Bartlett 2013 (Am J Physiol)';

export const SIGNAL_STEPS: readonly SignalStep[] = [
    {
        tab: 'Tanque alto',
        headline: 'Tanque cheio: pouco sinal',
        text: 'Bartlett 2013: 8 homens ativos fizeram a mesma corrida intervalada de alta intensidade duas vezes, uma com glicogênio alto (467 mmol/kg ps). A leitura da AMPK (fosforilação da ACC) subiu 1,4×; a do p53, nada (0,9×).',
        sources: [BARTLETT],
    },
    {
        tab: 'Tanque baixo',
        headline: 'Tanque baixo: o sinal sobe',
        text: 'Mesma corrida com o glicogênio a 103 mmol/kg ps: ACC 2,9× e p53 2,6×. A AMPK é um sensor de energia que "lê" o estoque de glicogênio; o p53 é um dos sinais da biogênese mitocondrial. O estoque funciona como um dimmer.',
        sources: [BARTLETT, 'MacDonald 2003 (J Appl Physiol)'],
    },
    {
        tab: 'PGC-1α',
        headline: 'Mas o PGC-1α subiu igual',
        text: 'Os mRNAs de PDK4, TFAM, COX IV e PGC-1α já estavam mais altos com o tanque baixo, antes e 3 h depois. Só que o exercício elevou o PGC-1α cerca de 3× nos dois casos. A biologia é mais sutil que o slogan "treinar vazio adapta mais".',
        sources: [BARTLETT],
    },
    {
        tab: 'Uma perna',
        headline: 'O train low original',
        text: 'Hansen 2005 usou o desenho de Bergström: cada perna do mesmo voluntário foi um grupo. Uma treinava 2× em dias alternados (a 2ª sessão com glicogênio baixo); a outra, 1× por dia, mesma carga total. Limites: n = 7, não treinados, extensão de joelho.',
        sources: ['Hansen 2005 (J Appl Physiol)'],
    },
    {
        tab: 'Sinal × prova',
        headline: 'Sinal sobe; prova, nem sempre',
        text: 'Impey 2018 contou os estudos de train low: a sinalização aumentou em 73% de 11, a expressão gênica em 75% de 12 e as enzimas oxidativas em 78% de 9. O desempenho melhorou em só 37% de 11; em 63%, não mudou. O sinal vira tempo de prova? É a pergunta do Ato VIII.',
        sources: ['Impey 2018 (Sports Med)'],
    },
];

export const DIMMER = { high: 467, low: 103, max: 560 } as const;

/** Nós da cascata (vezes o repouso, com glicogênio alto e baixo). `null` = sem número no slide. */
export interface SignalNode {
    id: string;
    name: string;
    read: string;
    high: number | null;
    low: number | null;
    at: number;
}

export const NODES: readonly SignalNode[] = [
    { id: 'ampk', name: 'AMPK', read: 'p-ACC Ser79', high: 1.4, low: 2.9, at: 0 },
    { id: 'p53', name: 'p53', read: 'p-p53 Ser15', high: 0.9, low: 2.6, at: 0 },
    { id: 'pgc', name: 'PGC-1α', read: 'mRNA', high: 3, low: 3, at: 2 },
    { id: 'mito', name: 'mitocôndria', read: 'biogênese', high: null, low: null, at: 2 },
];

export const FOLD_MAX = 3.2;

/** Impey 2018: % dos estudos com efeito, e de quantos. */
export const IMPEY_ROWS = [
    { label: 'sinalização', pct: 73, of: 11, signal: true },
    { label: 'expressão gênica', pct: 75, of: 12, signal: true },
    { label: 'enzimas oxidativas', pct: 78, of: 9, signal: true },
    { label: 'desempenho', pct: 37, of: 11, signal: false },
] as const;

/** Hansen 2005: o que mudou em 10 semanas, perna LOW × perna HIGH (sem % no resumo). */
export const HANSEN_ROWS = [
    { what: 'carga máxima', result: 'igual nas duas', mark: '=' },
    { what: 'tempo a 90%', result: 'muito maior na LOW', mark: '↑↑' },
    { what: 'HAD e glicogênio de repouso', result: 'só na LOW', mark: '↑' },
] as const;

export const SIGNAL_CHIPS: readonly string[] = [
    'medidas repetidas · n = 8 homens ativos',
    'medidas repetidas · n = 8 homens ativos',
    'medidas repetidas · n = 8 homens ativos',
    'uma perna × outra · n = 7 · 10 semanas',
    'revisão · contagem de estudos',
];
