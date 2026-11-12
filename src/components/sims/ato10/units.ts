/** Altura da caixa de todos os simuladores do Ato X (o palco permite ≤ 516). */
export const SIM_H = 500;

/** Inteiro com ponto de milhar ("1.020"). */
export const int = (n: number): string => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
