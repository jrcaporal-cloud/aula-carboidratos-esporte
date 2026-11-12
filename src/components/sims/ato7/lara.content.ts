/** Slide 126 · Lara, Jogo a Cada 72 Horas. Números: dossiê 06 (KRUSTRUP2011, ANDERSON2017). Lara é fictícia. */

export interface Day {
    label: string;
    game: boolean;
    /** Glicogênio em relação ao controle (Krustrup 2011), só onde o estudo mediu. */
    tank?: { level: number; value: string; when: string };
}

export const DAYS: readonly Day[] = [
    { label: 'dia 1', game: true, tank: { level: 193 / 449, value: '−57%', when: 'fim do jogo' } },
    { label: 'dia 2', game: false, tank: { level: 328 / 449, value: '−27%', when: '24 h depois' } },
    { label: 'dia 3', game: false },
    { label: 'dia 4', game: true },
    { label: 'dia 5', game: false },
    { label: 'dia 6', game: false },
    { label: 'dia 7', game: true },
];

/** Premier League (Anderson 2017): CHO médio por tipo de dia, g/kg. */
export const GKG = { game: 6.4, training: 4.2 } as const;
export const GKG_TEXT = { game: '6,4', training: '4,2' } as const;
export const BAR_MAX = 7;

export const LARA_KG = 60;
/** Cálculo (rotulado): o que os profissionais comem, no peso da Lara. */
export const LARA_G = { game: '384 g', training: '252 g' } as const;

export const PHRASES: readonly string[] = [
    'Lara joga a cada 72 h e come pouco carboidrato “para não inchar”.',
    'Em jogadores de elite, com dieta otimizada: −57% no fim do jogo, ainda −27% um dia depois.',
    'Na Premier League, o prato já muda com o dia: 6,4 g/kg no jogo, 4,2 no treino.',
    'Para os 60 kg da Lara: 384 g no jogo, 252 g no treino. Na véspera e na recuperação, nem eles chegam à diretriz.',
];

export const DESIGN: readonly (string | null)[] = [
    null,
    'Krustrup 2011 · biópsias seriadas · n = 7 homens',
    'Anderson 2017 · água duplamente marcada · n = 6',
    'Anderson 2017 · n = 6',
];

export const SOURCE = 'Krustrup P et al. Eur J Appl Physiol 2011;111(12):2987-95 · Anderson L et al. Int J Sport Nutr Exerc Metab 2017;27(3):228-38';
