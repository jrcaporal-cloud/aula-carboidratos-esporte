/**
 * Slide 44 · O Cruzamento. Forma do modelo de BROOKS1994 (intensidade empurra para o CHO, treino para a gordura)
 * com a ordem das fontes de ROMIJN1993. As porcentagens são ILUSTRATIVAS: o dossiê não confirma os valores por fonte.
 */

export const I_MIN = 25;
export const I_MAX = 85;

export interface Mix {
    agl: number;
    imtg: number;
    plasmaGlucose: number;
    glycogen: number;
}

/** Fração da energia vinda do carboidrato: logística com o cruzamento em 52% (destreinado) ou 60% (treinado). */
export const crossoverAt = (trained: boolean): number => (trained ? 60 : 52);

const choFraction = (I: number, trained: boolean): number => 0.08 + 0.86 / (1 + Math.exp(-(I - crossoverAt(trained)) / 9));

export const mixAt = (I: number, trained: boolean): Mix => {
    const t = (I - I_MIN) / (I_MAX - I_MIN);
    const cho = choFraction(I, trained);
    const fat = 1 - cho;
    const plasmaGlucose = cho * (0.3 - 0.12 * t);
    const agl = fat * (0.85 - 0.45 * t);
    return { agl, imtg: fat - agl, plasmaGlucose, glycogen: cho - plasmaGlucose };
};

export interface CrossStep {
    phrase: string;
    intensity: number;
    trained: boolean;
}

export const CROSS_STEPS: readonly CrossStep[] = [
    { phrase: 'A 25% do VO₂máx, quem paga a conta é a gordura, quase toda vinda do sangue.', intensity: 25, trained: false },
    { phrase: 'Subindo a intensidade, entram o TG do músculo e o glicogênio. Perto da metade, as curvas se cruzam.', intensity: 55, trained: false },
    { phrase: 'A 85%, o glicogênio domina. A intensidade escolhe o combustível.', intensity: 85, trained: false },
    { phrase: 'O treino empurra o cruzamento para a direita: mais gordura no mesmo %VO₂máx. A regra continua.', intensity: 65, trained: true },
];

export const LAYERS = [
    { key: 'agl', label: 'AGL do sangue', color: '#BEF264', opacity: 1 },
    { key: 'imtg', label: 'TG do músculo', color: '#BEF264', opacity: 0.5 },
    { key: 'plasmaGlucose', label: 'glicose do sangue', color: '#F59E0B', opacity: 1 },
    { key: 'glycogen', label: 'glicogênio do músculo', color: '#8B5CF6', opacity: 1 },
] as const;
