/** Slide 185 · Glicose Contínua em Atleta (CGM-ATLETAS: THOMASF2016, BOWLER2025, MATKIN2026, FLOCKHART-LARSEN2024 — dossiê 07). */

export const LINES = [
    'O sensor lê o líquido intersticial, com atraso, e desenha picos que assustam.',
    'Em atletas subelite saudáveis, passar horas acima de 6,0 mmol/L foi comum.',
    'Na elite bem alimentada, o dia inteiro parece o de qualquer pessoa saudável.',
    'O CGM não separou atletas com REDs dos controles. Ainda falta régua para atleta.',
] as const;

export const THRESHOLD = 6.0;

/** Curva ilustrativa de 24 h (mmol/L): refeições às 7h30, 12h30 e 20h, treino intenso às 17h. */
const BUMPS = [
    { at: 7.5, h: 2.6, w: 0.7 },
    { at: 12.5, h: 2.9, w: 0.8 },
    { at: 17, h: 2.0, w: 0.35 },
    { at: 20, h: 2.3, w: 0.8 },
] as const;
export const glucoseAt = (hour: number): number =>
    5.1 + BUMPS.reduce((sum, b) => sum + b.h * Math.exp(-((hour - b.at) ** 2) / (2 * b.w ** 2)), 0);

export const THOMAS = {
    rows: [
        { lit: 4, text: 'passaram mais de 70% do tempo acima de 6,0 mmol/L' },
        { lit: 3, text: 'tinham glicemia de jejum na faixa de pré-diabetes' },
    ],
    design: 'vida livre · 6 dias · n = 10 subelite',
} as const;

export const BOWLER = {
    mean: { value: '102,6 mg/dL', caption: 'glicose média em 24 h' },
    mage: { value: '36 mg/dL', caption: 'variabilidade (MAGE)' },
    note: 'com 8,4 g/kg/d de carboidrato',
    design: 'padronizado · n = 12 marchadores de elite',
} as const;

export const MATKIN = {
    stats: [
        { value: 'P = 0,21', caption: 'glicose noturna, REDs × controles' },
        { value: 'P = 0,92', caption: 'variabilidade (MAGE)' },
    ],
    quote: 'Revisão de 2024: ainda não há consenso sobre como interpretar a medida.',
    design: 'n = 18 mulheres, 9 com REDs',
} as const;

export const DESIGNS = ['curva ilustrativa', THOMAS.design, BOWLER.design, MATKIN.design] as const;

export const SOURCE = 'Thomas F et al. J Diabetes Sci Technol 2016 · Bowler AM et al. J Diabetes Sci Technol 2025 · Matkin-Hussey PA et al. Eur J Sport Sci 2026 · Flockhart M, Larsen FJ. Sports Med 2024.';
