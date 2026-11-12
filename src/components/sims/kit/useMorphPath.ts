import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export type Pt = readonly [number, number];

/** Polilinha SVG ("M x y L x y …") a partir de pontos já em coordenadas do viewBox. */
export const toPath = (pts: readonly Pt[]): string =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

/** Amostra uma função y(x) em `n` pontos entre x0 e x1, já mapeada para o viewBox por `map`. */
export const sample = (n: number, x0: number, x1: number, f: (x: number) => number, map: (x: number, y: number) => Pt): Pt[] =>
    Array.from({ length: n }, (_, i) => {
        const x = x0 + ((x1 - x0) * i) / (n - 1);
        return map(x, f(x));
    });

const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Curva que se transforma em outra quando os pontos mudam (ex.: a glicemia de um alimento virando a de outro).
 * Escreve o atributo `d` direto no elemento a cada quadro, sem re-render do React.
 * Não passe `d` no JSX: ligue o ref devolvido a um <path>. Mesmo número de pontos = morfose; outro número = troca direta.
 */
export const useMorphPath = (points: readonly Pt[], ms = 650) => {
    const ref = useRef<SVGPathElement>(null);
    const shown = useRef<readonly Pt[] | null>(null);
    const reduce = useReducedMotion();
    const key = toPath(points);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const from = shown.current;
        const to = points;
        if (!from || from.length !== to.length || reduce) {
            el.setAttribute('d', toPath(to));
            shown.current = to;
            return;
        }
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const k = easeInOut(Math.min((now - start) / ms, 1));
            const mid = to.map(([x, y], i): Pt => [from[i][0] + (x - from[i][0]) * k, from[i][1] + (y - from[i][1]) * k]);
            el.setAttribute('d', toPath(mid));
            shown.current = mid;
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
        // `key` resume os pontos: o efeito só roda quando a curva muda de fato.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, reduce, ms]);

    return ref;
};
