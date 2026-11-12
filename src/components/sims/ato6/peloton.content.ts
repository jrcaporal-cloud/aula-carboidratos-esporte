/** Slide 106 · O Pelotão na Frente da Ciência. SARI1989, JEUK2000, BURKE2011, MORTON2026. Jornalismo do Tour: não usar. */

export const YEAR_MIN = 1984;
export const YEAR_MAX = 2030;

export interface Milestone {
    track: 'peloton' | 'lab';
    year: number;
    /** Passo em que aparece. */
    step: number;
    value: string;
    note: string;
}

export const MILESTONES: readonly Milestone[] = [
    { track: 'peloton', year: 1989, step: 0, value: '~94 g/h', note: 'Tour de France, nas etapas' },
    { track: 'lab', year: 2000, step: 1, value: '~60 g/h', note: 'teto com uma fonte só' },
    { track: 'lab', year: 2011, step: 2, value: 'até 90 g/h', note: 'consenso, provas > 2,5 h' },
    { track: 'peloton', year: 2026, step: 3, value: '120+ g/h', note: 'testado por equipes' },
    { track: 'lab', year: 2026, step: 3, value: '120 g/h?', note: 'tolera; ganho não provado' },
];

export const LEADS = [
    'Tour de France 1989: 5 profissionais, 22 dias. Nas etapas, ~94 g/h de carboidrato.',
    'Em 2000, o laboratório descrevia um teto de oxidação de ~60 g/h com uma fonte só.',
    'A diretriz chega a 90 g/h em 2011: 22 anos depois do pelotão.',
    'Hoje o pelotão testa 120 g/h ou mais. A eficácia dessas doses ainda não foi comprovada.',
] as const;

export const SOURCES = [
    'Saris et al., Int J Sports Med 1989 (registro alimentar, n = 5)',
    'Jeukendrup & Jentjens, Sports Med 2000',
    'Burke et al., J Sports Sci 2011 (consenso do COI)',
    'Morton et al., J Nutr 2026 (revisão narrativa)',
] as const;

export const DESIGN = [
    'observacional · n = 5 · 22 dias',
    'revisão de estudos com isótopo',
    'consenso do COI',
    'revisão narrativa',
] as const;
