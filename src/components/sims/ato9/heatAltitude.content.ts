/**
 * Slide 166 · Calor e Altitude — JENTJENS2002, FEBBRAIO1996, PERONNET2006, BRAUN2000 (dossiê 06, confirmados no abstract).
 */

/** Jentjens 2002: 90 min a 55% Wmax, 16,4 °C × 35,4 °C, glicose a 8%. g/min. */
export const HEAT = {
    cool: { temp: '16 °C', glycogen: 1.66, exo: 0.84 },
    hot: { temp: '35 °C', glycogen: 2.07, exo: 0.76 },
} as const;
export const GAUGE_MAX = 2.2;

/** Cálculos nossos a partir dos números acima. */
export const GLY_UP = Math.round((HEAT.hot.glycogen / HEAT.cool.glycogen - 1) * 100); // 25
export const EXO_DOWN = Math.round((1 - HEAT.hot.exo / HEAT.cool.exo) * 100); // 10

/** Péronnet 2006, mesma carga relativa (77%): normóxia × hipóxia de 4.300 m. */
export const ALT = {
    choShare: { sea: 78.1, alt: 92.0 },
    exoGrams: { sea: 20.2, alt: 17.2 },
} as const;

export const WOMEN_DROP = 23; // Braun 2000: oxidação de CHO corrigida pelo gasto, 4.300 m × nível do mar

export const STEPS = [
    { say: 'Ciclistas pedalam 90 min bebendo glicose a 8%, primeiro a 16 °C.', design: 'cruzado · n = 9 · 13C', source: 'Jentjens RL et al. J Appl Physiol 2002;92(4):1562-72.' },
    { say: 'A 35 °C, o músculo queima mais glicogênio e aproveita menos o que se bebe.', design: 'cruzado · n = 9 · 13C', source: 'Jentjens RL et al. J Appl Physiol 2002;92(4):1562-72.' },
    { say: 'E no calor, nenhuma bebida com CHO prolongou o tempo até a fadiga.', design: 'cruzado · 33 °C × 5 °C · até a fadiga', source: 'Febbraio MA et al. Med Sci Sports Exerc 1996;28(11):1380-7.' },
    { say: 'A 4.300 m, o CHO vira quase toda a energia, mas o que vem do copo não aumenta.', design: 'cruzado · n = 5 · câmara hipobárica', source: 'Péronnet F et al. Eur J Appl Physiol 2006;97(5):527-34.' },
    { say: 'Em mulheres, a 4.300 m, a oxidação de CHO caiu.', design: '16 mulheres · traçadores', source: 'Braun B et al. J Appl Physiol 2000;88(1):246-56.' },
] as const;
