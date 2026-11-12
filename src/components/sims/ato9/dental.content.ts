/** Slide 170 · O Preço no Sorriso — NEEDLEMAN2013, GALLAGHER2018 e GALLAGHER2019 (dossiê 06, confirmados no abstract). */

export const TEETH = 20;
export const EROSION_PCT = 45; // Londres 2012
export const ERODED = Math.round((TEETH * EROSION_PCT) / 100); // 9 de 20 (1 dente = 5% dos atletas)

export interface DentalStep {
    say: string;
    big: string;
    caption: string;
    extra?: string;
    design: string;
    source: string;
}

export const STEPS: readonly DentalStep[] = [
    {
        say: 'Londres 2012: quase metade dos atletas examinados tinha erosão dentária.',
        big: '45%', caption: 'com erosão · 1 dente = 5% dos atletas',
        design: 'transversal · 278 atletas · quem procurou a clínica', source: 'Needleman I et al. Br J Sports Med 2013;47(16):1054-8.',
    },
    {
        say: 'O atleta escova, mas bebe carboidrato ácido o treino inteiro.',
        big: '80%', caption: 'usam bebida esportiva em treino ou prova', extra: '94% escovam 2 vezes ao dia',
        design: 'transversal · 352 atletas britânicos', source: 'Gallagher J et al. Br Dent J 2019;227(4):276-80.',
    },
    {
        say: 'Em esporte coletivo, a chance de erosão dobrou. Prescrever CHO inclui a boca.',
        big: '2,0×', caption: 'chance de erosão: coletivo × endurance', extra: 'IC 95% 1,3 a 3,1',
        design: 'transversal · examinador calibrado', source: 'Gallagher J et al. Community Dent Oral Epidemiol 2018;46(6):563-8.',
    },
];
