/** Slide 113 · A Vida Real do Intestino. PFEI2012 (221 atletas em prova), DEOL2014, ARRI2021 (dossiê 03, G e K). */

export interface EventRow {
    id: string;
    name: string;
    mean: number;
    sd: number;
    /** % com sintomas GI graves; null quando o dossiê não traz o número para esse grupo. */
    severe: number | null;
}

export const EVENTS: readonly EventRow[] = [
    { id: 'imh', name: 'Ironman Havaí', mean: 62, sd: 26, severe: 31 },
    { id: 'ima', name: 'Ironman Alemanha', mean: 71, sd: 25, severe: 31 },
    { id: '703', name: 'Ironman 70.3', mean: 65, sd: 25, severe: 14 },
    { id: 'bike', name: 'ciclismo 100–150 km', mean: 53, sd: 22, severe: 4 },
    { id: 'mar', name: 'maratona', mean: 35, sd: 26, severe: 4 },
];

export const GH_MAX = 140;

export const LEADS = [
    '221 atletas em prova: as médias ficam longe dos 90 g/h. Individualmente, de 6 a 136 g/h.',
    'Na maratona, ~35 g/h: menos da metade do teto da diretriz.',
    'Sintomas GI graves chegam a ~31% nos Ironman. Queixas de qualquer grau: 30–50% dos atletas.',
    'No ultra-trail, comer pouco e passar mal andam juntos.',
] as const;

export const SOURCES = [
    'Pfeiffer et al., Med Sci Sports Exerc 2012 (média ± DP)',
    'Pfeiffer et al., Med Sci Sports Exerc 2012',
    'Pfeiffer et al. 2012 · de Oliveira, Burini & Jeukendrup, Sports Med 2014',
    'Arribalzaga et al., Int J Environ Res Public Health 2021 (revisão sistemática, 8 estudos)',
] as const;

export const DESIGN = [
    'observacional · n = 221 · recordatório pós-prova',
    'observacional · n = 221 · recordatório pós-prova',
    'observacional + revisão narrativa',
    'revisão sistemática · 8 estudos',
] as const;
