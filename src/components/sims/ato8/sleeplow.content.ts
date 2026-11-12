/** Slide 142 · Sleep low (dossiê 05·MARQUET2016a, GEJL2017, RIIS2019, HULSTON2010). */

export const SLEEP_BEATS = [
    'Sleep low: o mesmo carboidrato do dia, em outro horário.',
    'Num estudo não cego, o 10 km melhorou 2,9% com sleep low.',
    'Em atletas mais treinados, o ganho não apareceu.',
    'E o preço aparece no treino intenso.',
] as const;

export interface DaySegment {
    id: 'hit' | 'night' | 'easy' | 'refuel';
    when: string;
    what: string;
    /** Flex da largura no trilho de 24 h. */
    span: number;
}

export const DAY: readonly DaySegment[] = [
    { id: 'hit', when: 'fim da tarde', what: 'treino intenso com CHO', span: 3.6 },
    { id: 'night', when: 'noite', what: 'dorme sem carboidrato', span: 3.6 },
    { id: 'easy', when: 'manhã', what: 'treino leve em jejum', span: 3 },
    { id: 'refuel', when: 'depois', what: 'CHO de volta', span: 2 },
];

export interface StudyRow {
    id: string;
    who: string;
    design: string;
    test: string;
    /** Melhora em % (low = sleep low; ctl = controle). null = o resumo só diz "igual". */
    low: number | null;
    ctl: number | null;
    note: string;
}

export const STUDIES: readonly StudyRow[] = [
    { id: 'marquet', who: 'Marquet 2016', design: '21 triatletas · não cego', test: '10 km de corrida', low: 2.9, ctl: 0.1, note: 'perderam mais gordura no grupo sleep low' },
    { id: 'gejl', who: 'Gejl 2017', design: '26 de elite · 4 semanas', test: 'contrarrelógio de 30 min', low: 5, ctl: 5, note: 'enzimas e glicogênio: iguais também' },
    { id: 'riis', who: 'Riis 2019', design: '13 treinados · 4 semanas', test: 'contrarrelógio de 30 min', low: null, ctl: null, note: 'mais gordura no agudo; não durou' },
];

export const HULSTON = { high: 323, low: 297 } as const;

export const SLEEP_SOURCES = [
    'Marquet LA et al. Med Sci Sports Exerc 2016;48(4):663-672.',
    'Marquet 2016; Gejl KD et al. MSSE 2017;49(12):2486-97; Riis S et al. Scand J Med Sci Sports 2019;29(12):1866-80.',
    'Hulston CJ et al. Med Sci Sports Exerc 2010;42(11):2046-2055.',
] as const;
