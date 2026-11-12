/** Slide 180 · A Régua das Diretrizes. Faixas de BURKE2011/THOMAS2016 (dossiê 07). */

export interface Band {
    id: string;
    name: string;
    load: string;
    lo: number;
    hi: number;
}

export const RULER_MAX = 12;

export const BANDS: readonly Band[] = [
    { id: 'leve', name: 'Leve', load: 'baixa intensidade ou habilidade', lo: 3, hi: 5 },
    { id: 'moderado', name: 'Moderado', load: '~1 h por dia', lo: 5, hi: 7 },
    { id: 'alto', name: 'Alto', load: '1–3 h/dia, moderada a alta', lo: 6, hi: 10 },
    { id: 'muito', name: 'Muito alto', load: 'mais de 4–5 h por dia', lo: 8, hi: 12 },
];

/** Onde duas faixas vizinhas se cobrem (5–7 ∩ 6–10 e 6–10 ∩ 8–12). */
export const OVERLAPS = [{ lo: 6, hi: 7 }, { lo: 8, hi: 10 }] as const;

export const WEIGHTS = [58, 70, 85] as const;
export const DEFAULT_KG = 70;

export const LINES = [
    'Quatro faixas de carboidrato por dia, escalonadas pela carga de treino.',
    'As faixas se sobrepõem: a régua dá o ponto de partida, a sessão decide.',
    'Em gramas reais, para o atleta à sua frente.',
] as const;

export const SOURCE = 'Burke LM et al. J Sports Sci 2011 · Thomas DT et al. Med Sci Sports Exerc 2016 (faixas lidas em tabelas que reproduzem o original).';
