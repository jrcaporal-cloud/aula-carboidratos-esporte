/** Slide 182 · O Que os Atletas Comem (MASSON2016, RAIZEL2017 — dossiê 07; ANDERSON2017 — dossiê 06). */

export const LINES = [
    'Entre amadores de endurance, menos da metade come o carboidrato recomendado.',
    'Em futebolistas profissionais (estudo brasileiro), a energia fecha, mas o carboidrato fica curto.',
    'Na Premier League o jogador periodiza, e ainda fica abaixo na véspera do jogo.',
] as const;

/** Masson & Lamarche 2016: 45,7% atingiam a meta (cada quadrado = 1%). */
export const MASSON = { pct: '45,7%', filled: 46, protein: '87,1%', design: 'transversal · n = 116 · QFA' } as const;

export interface Marker {
    id: string;
    value: number;
    label: string;
    /** Passo em que o marcador aparece. */
    from: number;
}

export const MARKERS: readonly Marker[] = [
    { id: 'raizel', value: 5.44, label: 'profissionais, pré-temporada', from: 1 },
    { id: 'pl-treino', value: 4.2, label: 'PL, dia de treino', from: 2 },
    { id: 'pl-jogo', value: 6.4, label: 'PL, dia de jogo', from: 2 },
];

/** Faixa de referência desenhada na régua (treino alto, 1–3 h/d — BURKE2011). */
export const REF_BAND = { lo: 6, hi: 10, label: 'faixa de treino alto' } as const;
export const RULER_MAX = 12;

export const DESIGNS = [
    MASSON.design,
    'registro de 3 dias · n = 19',
    'água duplamente marcada · n = 6',
] as const;

export const SOURCE = 'Masson G, Lamarche B. Appl Physiol Nutr Metab 2016 · Raizel R et al. Nutr Health 2017 · Anderson L et al. Int J Sport Nutr Exerc Metab 2017.';
