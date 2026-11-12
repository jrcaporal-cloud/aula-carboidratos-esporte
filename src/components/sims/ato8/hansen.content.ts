/** Slide 140 · Hansen 2005 (dossiê 05·HANSEN2005). O "TTE dobrou" NÃO entra: o resumo não traz o número. */

export const HANSEN_BEATS = [
    'Sete homens, duas pernas: cada perna é um tratamento.',
    'Mesma carga total. A 2ª sessão da perna LOW começa com o tanque baixo.',
    'A força máxima subiu igual. A resistência subiu mais na perna que treinou com fome.',
    'Prova de conceito, não prescrição.',
] as const;

export interface LegRow {
    id: 'low' | 'high';
    name: string;
    rule: string;
    /** Sessões por dia nos 14 dias mostrados (2 semanas). */
    days: readonly number[];
}

const twoWeeks = (f: (d: number) => number): number[] => Array.from({ length: 14 }, (_, d) => f(d));

export const LEG_ROWS: readonly LegRow[] = [
    { id: 'low', name: 'Perna LOW', rule: '2 sessões a cada 2 dias', days: twoWeeks(d => (d % 2 === 0 ? 2 : 0)) },
    { id: 'high', name: 'Perna HIGH', rule: '1 sessão por dia', days: twoWeeks(() => 1) },
];

export interface ResultRow {
    label: string;
    low: string;
    high: string;
    /** Quem ganhou: 'tie' = igual nas duas pernas. */
    winner: 'tie' | 'low';
}

export const RESULTS: readonly ResultRow[] = [
    { label: 'Carga máxima', low: 'aumento idêntico', high: 'aumento idêntico', winner: 'tie' },
    { label: 'Tempo até a exaustão a 90%', low: 'subiu muito mais', high: 'subiu', winner: 'low' },
    { label: 'HAD e glicogênio de repouso', low: 'subiram', high: 'subiram, sem significância', winner: 'low' },
];

export const HANSEN_CAVEATS = ['uma perna só: pouca massa muscular', 'TTE: teste pouco reprodutível'] as const;

export const HANSEN_SOURCE = 'Hansen AK et al. J Appl Physiol 2005;98(1):93-99.';
