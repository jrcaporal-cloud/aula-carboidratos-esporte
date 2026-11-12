/**
 * Slide 106 · O Pelotão na Frente da Ciência. SARI1989, JEUK2000, BURKE2011, MORTON2026 (dossiê 03).
 * Jornalismo do Tour (vencedor de etapa, 200 g/h) e "comunicação pessoal": não usar.
 */

export const YEAR_MIN = 1984;
export const YEAR_MAX = 2030;

export interface Milestone {
    track: 'peloton' | 'lab';
    year: number;
    /** Passo em que aparece (e fica). */
    step: number;
    value: string;
    note: string;
}

export const MILESTONES: readonly Milestone[] = [
    { track: 'peloton', year: 1989, step: 0, value: '~94 g/h', note: 'Tour, nas etapas' },
    { track: 'lab', year: 2000, step: 1, value: '~60 g/h', note: '1 fonte só' },
    { track: 'lab', year: 2011, step: 2, value: 'até 90 g/h', note: 'COI, > 2,5 h' },
    { track: 'peloton', year: 2026, step: 3, value: '120+ g/h', note: 'testado por equipes' },
    { track: 'lab', year: 2026, step: 3, value: '120 g/h?', note: 'ganho não provado' },
];

export interface PelotonStep {
    tab: string;
    headline: string;
    text: string;
    chip: string;
    source: string;
}

export const PELOTON_STEPS: readonly PelotonStep[] = [
    {
        tab: 'Tour 1989',
        headline: 'O pelotão já comia ~94 g/h',
        text: 'Saris e colegas registraram tudo o que 5 profissionais comeram nos 22 dias do Tour de France. Entraram 24,7 MJ/dia para um gasto de 25,4 MJ/dia; 49% dessa energia foi ingerida durante a etapa, ~94 g/h de carboidrato. Limite: n = 5, registro alimentar.',
        chip: 'observacional · n = 5 · 22 dias',
        source: 'Saris 1989, Int J Sports Med',
    },
    {
        tab: 'Teto 2000',
        headline: 'O laboratório desenha um teto',
        text: 'Com isótopos estáveis, a oxidação de uma fonte só (glicose, maltodextrina) para em ~1,0–1,1 g/min, ~60 g/h, mesmo ingerindo mais. O gargalo não é o músculo: é a absorção intestinal e o fígado, que libera ~1 g/min. Frutose e galactose: 25–50% menos.',
        chip: 'revisão · estudos com isótopo',
        source: 'Jeukendrup & Jentjens 2000, Sports Med',
    },
    {
        tab: 'Consenso 2011',
        headline: 'A diretriz alcança o pelotão',
        text: 'O consenso do COI escalona a dose pela duração: ~1 h, pouco ou só bochecho; 30–60 g/h nas provas mais longas; acima de 2,5 h, até 90 g/h com misturas de carboidratos. O número do pelotão de 1989 vira recomendação 22 anos depois.',
        chip: 'consenso do COI',
        source: 'Burke 2011, J Sports Sci (COI)',
    },
    {
        tab: 'Hoje',
        headline: 'O pelotão de novo na frente',
        text: 'Atletas já testam de 120 a 200 g/h. Morton 2026: o teto pode subir de 90 para 120 g/h, ao menos em treinados, mas a eficácia dessas doses ainda não foi comprovada. Relatos de jornalismo do Tour ficam fora: não são dado.',
        chip: 'revisão narrativa',
        source: 'Morton 2026, J Nutr',
    },
];

/** Livro-caixa: quem disse quanto, e quando. Uma linha por passo; acumula. */
export const PELOTON_LEDGER = [
    { at: 0, year: '1989', who: 'pelotão (Tour, n = 5)', value: '~94 g/h', track: 'peloton' },
    { at: 1, year: '2000', who: 'laboratório, 1 fonte', value: '~60 g/h', track: 'lab' },
    { at: 2, year: '2011', who: 'consenso do COI', value: 'até 90 g/h', track: 'lab' },
    { at: 3, year: 'hoje', who: 'equipes × revisão', value: '120 g/h?', track: 'peloton' },
] as const;

/** Um dia de Tour em 1989 (média de 22 dias; Saris 1989). */
export const TOUR_DAY = {
    intakeMJ: '24,7',
    duringPct: 49,
    facts: [
        { value: '25,4 MJ', label: 'gasto por dia (máx. 32,7)' },
        { value: '~30%', label: 'do carboidrato em líquidos' },
        { value: '6,7 L', label: 'de água por dia (até 11,8)' },
    ],
} as const;
