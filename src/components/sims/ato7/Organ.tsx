import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';

/**
 * Silhueta chapada de órgão que enche de baixo para cima (fígado ou músculo).
 * O líquido é um retângulo recortado pelo contorno, crescendo por scaleY (transform), nunca por altura.
 */
const SHAPES = {
    // fígado estilizado: lobo direito grande à esquerda, afinando para o lobo esquerdo
    liver: 'M12 58 C 18 18, 92 6, 152 12 C 188 16, 200 36, 190 56 C 180 80, 140 110, 96 126 C 70 134, 50 122, 40 108 C 26 88, 8 82, 12 58 Z',
    // ventre muscular fusiforme com os dois tendões
    muscle: 'M4 70 L 22 70 C 50 26, 150 26, 178 70 L 196 70 L 178 70 C 150 114, 50 114, 22 70 Z',
} as const;

/** Faixa vertical ocupada por cada contorno no viewBox: o nível vai de 0 (base) a 1 (topo) DO ÓRGÃO. */
const BOUNDS = { liver: [6, 134], muscle: [36, 104] } as const;

interface OrganProps {
    kind: keyof typeof SHAPES;
    /** Nível de 0 a 1. Mudar o nível anima o enchimento a partir de onde estava. */
    level: number;
    width?: number;
    color?: string;
    delay?: number;
}

export const Organ = ({ kind, level, width = 220, color = C.glycogen, delay = 0 }: OrganProps) => {
    const reduce = useReducedMotion();
    const clip = useId();
    const height = (width * 140) / 200;
    const [top, bottom] = BOUNDS[kind];
    return (
        <svg viewBox="0 0 200 140" width={width} height={height} role="img" aria-label={`${kind === 'liver' ? 'fígado' : 'músculo'} ${Math.round(level * 100)}%`}>
            <defs>
                <clipPath id={clip}><path d={SHAPES[kind]} /></clipPath>
            </defs>
            <path d={SHAPES[kind]} fill="rgba(255,255,255,0.06)" />
            <g clipPath={`url(#${clip})`}>
                <motion.rect x={0} y={top} width={200} height={bottom - top} fill={color}
                    style={{ originX: 0.5, originY: 1 }}
                    initial={false} animate={{ scaleY: Math.max(0, Math.min(1, level)) }}
                    transition={{ duration: reduce ? 0 : DUR.draw, delay: reduce ? 0 : delay, ease: EASE_OUT }} />
            </g>
            <path d={SHAPES[kind]} fill="none" stroke="rgba(243,244,246,0.85)" strokeWidth={3} strokeLinejoin="round" />
        </svg>
    );
};
