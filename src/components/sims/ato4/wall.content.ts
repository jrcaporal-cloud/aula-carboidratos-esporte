/**
 * Slide 68 · O muro em números. Fonte: dossiê 02 · SMYTH2021 (28% × 17%, OR 1,43, N = 1.928.813; quem bate
 * desacelera ~40% por ~10 km; risco maior perto do ano de recorde pessoal). A volta da Marina é fictícia.
 */

export const WALL_LEADS = [
    'Marina planejou um ritmo só, do início ao fim da maratona.',
    'No km 32, o ritmo desaba. Quem bate no muro fica cerca de 40% mais lento por uns 10 km.',
    'Em quase 2 milhões de maratonistas, 28% dos homens e 17% das mulheres bateram no muro.',
    'O risco sobe perto do ano de recorde pessoal: quem arrisca o ritmo paga no fim.',
] as const;

/** Velocidade relativa ao ritmo planejado (1 = plano), por km. Queda de ~40% no ritmo = velocidade ÷ 1,4. */
const SLOW = 1 / 1.4;
export const planSpeed = (): number => 1;
export const wallSpeed = (km: number): number => {
    if (km <= 30) return 1;
    if (km >= 33) return SLOW;
    return 1 - ((km - 30) / 3) * (1 - SLOW);
};

export const WAFFLES = [
    { who: 'dos homens', pct: 28 },
    { who: 'das mulheres', pct: 17 },
] as const;

export const WALL_SOURCE = 'Smyth, PLoS One 2021';
