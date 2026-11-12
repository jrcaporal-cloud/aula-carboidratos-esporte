import { C } from '../kit/palette';

/**
 * Formas químicas chapadas do Ato II, desenhadas em torno de (0, 0) para serem movidas por transform.
 * Glicose e galactose: anel de seis (hexágono). Frutose: anel de cinco (pentágono), como na forma furanose.
 */
export type SugarKind = 'glc' | 'fru' | 'gal' | 'gyg';

const ring = (sides: number, r: number, rot: number): string =>
    Array.from({ length: sides }, (_, i) => {
        const a = rot + (i * 2 * Math.PI) / sides;
        return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
    }).join(' ');

export const HEX = ring(6, 24, -Math.PI / 2);
export const PENT = ring(5, 25, -Math.PI / 2);

export const SUGAR_COLOR: Record<SugarKind, string> = {
    glc: C.glucose,
    fru: C.fructose,
    gal: C.caveat,
    gyg: C.protein,
};
