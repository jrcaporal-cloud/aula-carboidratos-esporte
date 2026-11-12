import { DUR, EASE_OUT } from '../../../lib/motion';

/** Entrada de uma linha do livro-caixa: escalonada só no passo em que ela nasce; depois fica parada. */
export const rowEnter = (born: boolean, i: number, base = 0.5) => ({
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR.enter, delay: born ? base + Math.min(i * 0.12, 0.4) : 0, ease: EASE_OUT },
});
