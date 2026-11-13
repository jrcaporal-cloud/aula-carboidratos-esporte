/**
 * Slide 44 · O Cruzamento. Forma do modelo de BROOKS1994 (intensidade empurra para o CHO, treino para a gordura)
 * com a ordem das fontes de ROMIJN1993. As porcentagens e a posição da fronteira são ILUSTRATIVAS: o dossiê só dá,
 * para o treinado, "gordura predomina até ~45% do VO₂máx e o CHO predomina a ~75%" (BROOKS1994); o modelo treinado
 * respeita os dois (≈22% CHO a 45%, ≈80% a 75%). Os pontos medidos de van Loon 2001 ficam no slide da gordura (45).
 */

export const I_MIN = 25;
export const I_MAX = 85;

export interface Mix {
    agl: number;
    imtg: number;
    plasmaGlucose: number;
    glycogen: number;
}

/** Fração da energia vinda do carboidrato: logística com o cruzamento em 45% (destreinado) ou 60% (treinado). Ilustrativo. */
export const crossoverAt = (trained: boolean): number => (trained ? 60 : 45);

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
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
    intensity: number;
    trained: boolean;
}

const BROOKS = 'Brooks & Mercier 1994 (modelo)';
const ROMIJN = 'Romijn 1993 (n = 5)';

export const CROSS_STEPS: readonly CrossStep[] = [
    {
        tab: '25%', intensity: 25, trained: false,
        headline: 'A 25%, paga a gordura do sangue',
        text: 'Romijn 1993 (n = 5 treinados, isótopos + calorimetria) mediu as fontes a 25, 65 e 85% do VO₂máx. No ritmo leve, a lipólise periférica é máxima e os ácidos graxos do sangue dominam. Glicose e glicogênio só ganham peso quando a intensidade sobe.',
        sources: [ROMIJN],
    },
    {
        tab: '65%', intensity: 65, trained: false,
        headline: 'Subindo, entram o TG e o glicogênio',
        text: 'A 65%, a captação de glicose e a quebra de glicogênio sobem, e o triglicerídeo dentro do músculo passa a ser usado. O cruzamento de Brooks & Mercier é a potência a partir da qual a energia do carboidrato supera a da gordura.',
        sources: [ROMIJN, BROOKS],
    },
    {
        tab: '85%', intensity: 85, trained: false,
        headline: 'A 85%, o glicogênio domina',
        text: 'A liberação de ácidos graxos cai com a intensidade, e o glicogênio paga a maior parte. O motivo: mais glicogenólise, fibras rápidas recrutadas e mais atividade simpática. A intensidade escolhe o combustível.',
        sources: [ROMIJN, BROOKS],
    },
    {
        tab: 'Treino', intensity: 65, trained: true,
        headline: 'O treino desloca a fronteira',
        text: 'O treino de endurance aumenta a oxidação de gordura e reduz a resposta simpática: o cruzamento vai para a direita (no modelo, de ~45 para ~60% do VO₂máx; posição ilustrativa). Treinados usam sobretudo gordura até ~45% do VO₂máx, e a ~75% o carboidrato já predomina. A regra continua: a intensidade manda.',
        sources: [BROOKS],
    },
];

/** `labelAt` (e `labelAtTrained`, quando o treino pede outro lugar) fica longe das linhas do cruzamento (45 e 60), do cursor nos passos (25, 65, 85) e da fronteira fantasma. */
export const LAYERS = [
    { key: 'agl', label: 'AGL do sangue', color: '#BEF264', opacity: 1, labelAt: 32 },
    { key: 'imtg', label: 'TG do músculo', color: '#BEF264', opacity: 0.5, labelAt: 35, labelAtTrained: 52.5 },
    { key: 'plasmaGlucose', label: 'glicose do sangue', color: '#F59E0B', opacity: 1, labelAt: 76 },
    { key: 'glycogen', label: 'glicogênio\ndo músculo', color: '#8B5CF6', opacity: 1, labelAt: 76 },
] as const;

/** Livro-caixa do painel: o que foi medido (ou dito pelo modelo), linha a linha. */
export interface CrossRow {
    at: number;
    label: string;
    value: string;
    color: string;
}

export const CROSS_ROWS: readonly CrossRow[] = [
    { at: 0, label: '25% VO₂máx · Romijn', value: 'AGL do sangue', color: '#BEF264' },
    { at: 1, label: '65% · Romijn', value: '+ TG e glicogênio', color: '#C4B5FD' },
    { at: 2, label: '85% · Romijn', value: 'glicogênio', color: '#C4B5FD' },
    { at: 3, label: 'treinado · Brooks', value: '≤45% gordura · ~75% CHO', color: '#F3F4F6' },
];
