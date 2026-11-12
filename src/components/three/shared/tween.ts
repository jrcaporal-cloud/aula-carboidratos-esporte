import { lerp, seg, smoother } from './math';

/*
 * Parâmetros de cena por etapa, interpolados no relógio da etapa. Ao trocar de etapa, o valor atual
 * vira o ponto de partida (voltar ou pular etapas nunca dá salto). Objetos de quadro: criados uma vez
 * e alterados no lugar (nada de alocação dentro do useFrame).
 */

export type Params<K extends string> = Record<K, number>;
export type Window = readonly [number, number];

export interface StepTarget<K extends string> {
    to: Params<K>;
    /** Janela (s) de cada parâmetro dentro da etapa; padrão = [0, anim]. */
    win?: Partial<Record<K, Window>>;
}

export interface Tween<K extends string> { from: Params<K>; cur: Params<K>; step: number; keys: readonly K[] }

export const makeTween = <K extends string>(init: Params<K>): Tween<K> => ({
    from: { ...init }, cur: { ...init }, step: -1, keys: Object.keys(init) as K[],
});

/** Avança a interpolação para (etapa, t). */
export const advanceTween = <K extends string>(tw: Tween<K>, targets: readonly StepTarget<K>[], step: number, t: number, anim: number): Params<K> => {
    const goal = targets[step];
    if (tw.step !== step) {
        for (const k of tw.keys) tw.from[k] = tw.cur[k];
        tw.step = step;
    }
    for (const k of tw.keys) {
        const w = goal.win?.[k];
        const e = smoother(w ? seg(t, w[0], w[1]) : seg(t, 0, Math.max(anim, 0.001)));
        tw.cur[k] = lerp(tw.from[k], goal.to[k], e);
    }
    return tw.cur;
};
