/** Slide 160 · 47% das Fibras — números de KRUSTRUP2006 (dossiê 06, confirmados no abstract). */

export const GLY_PRE = 449; // mmol/kg peso seco, antes do jogo
export const GLY_POST = 255; // mmol/kg peso seco, fim do jogo
export const EMPTY_PCT = 47; // % das fibras vazias ou quase vazias
export const SPRINT_SLOWER = 2.8; // % de aumento no tempo médio dos tiros de 30 m

/** Cálculos nossos a partir dos números acima (vão com o selo "cálculo"). */
export const MEAN_DROP = Math.round((1 - GLY_POST / GLY_PRE) * 100); // 43
export const LAG_M = 30 - 30 / (1 + SPRINT_SLOWER / 100); // ≈ 0,8 m

export const STEPS = [
    { minute: "0'", say: 'Antes do jogo, o vasto lateral começa cheio: 449 mmol/kg de glicogênio.' },
    { minute: "90'", say: 'No apito final, quase metade das fibras está vazia ou quase vazia.' },
    { minute: "90'", say: 'A média caiu 43%. Mas média não corre: quem corre é cada fibra.' },
    { minute: "90'", say: 'E o tiro de 30 m do fim do jogo saiu 2,8% mais lento.' },
] as const;

export const DESIGN = 'observacional · n = 31 · 3 amistosos · biópsia';
export const SOURCE = 'Krustrup P et al. Med Sci Sports Exerc 2006;38(6):1165-74.';
