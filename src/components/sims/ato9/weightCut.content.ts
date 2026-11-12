/**
 * Slide 164 · A Balança e a Água — FERNANDEZELIAS2015-AGUA, KING2018, FOO2022, REALE2017-EJSS (dossiê 06).
 * Tiago é personagem fictício (kit/cast.ts); o peso de partida dele é inventado para a cena.
 */

export const TIAGO_START = 76.5; // kg, fictício
export const TIAGO_TARGET = 73; // kg, categoria −73 kg
export const FIBER_DROP_PCT = 0.74; // % da massa, manhã do dia 5 (FOO2022)
/** Cálculo nosso: −0,74% aplicado ao peso fictício do Tiago. */
export const TIAGO_AFTER_FIBER = TIAGO_START * (1 - FIBER_DROP_PCT / 100);

export const WATER_MIN = 3; // g de água por g de glicogênio com pouca água
export const WATER_MAX = 17; // g de água por g de glicogênio com água plena

export const SWEAT_ML = 2000;
export const PLASMA_GAIN_ML = 55;

export const LEVERS = ['glicogênio, com a água dele', 'conteúdo do intestino', 'água corporal'] as const;

export const STEPS = [
    { say: 'Tiago precisa sair de 76,5 para 73 kg até a pesagem. O que sai rápido?', design: null, source: 'Reale R et al. Eur J Sport Sci 2017;17(6):727-40.' },
    { say: 'Cada grama de glicogênio sai com água: no mínimo 3 g.', design: 'cruzado · n = 9 · biópsia', source: 'Fernández-Elías VE et al. Eur J Appl Physiol 2015;115(9):1919-26.' },
    { say: 'Com água à vontade, a mesma grama guardou até 17 g.', design: 'cruzado · n = 9 · biópsia', source: 'Fernández-Elías VE et al. Eur J Appl Physiol 2015;115(9):1919-26.' },
    { say: 'Essa água não é um cantil: com 2 L de suor perdidos, devolve uns 55 mL ao plasma.', design: 'in vitro + modelagem', source: 'King RFGJ et al. Eur J Appl Physiol 2018;118(2):283-90.' },
    { say: 'Menos de 10 g de fibra por 4 dias: −0,74% da massa, sem mexer em CHO nem água.', design: 'pré-pós · n = 19 · não atletas', source: 'Foo WL et al. Int J Sport Nutr Exerc Metab 2022;32(4):256-64.' },
] as const;
