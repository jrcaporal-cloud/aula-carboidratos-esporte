import { motion } from 'framer-motion';
import { C } from '../../sims/kit/palette';

/**
 * A ideia da aula num traço: anéis de glicose que se encadeiam (o glicogênio) e acendem um a um.
 * Sem números de propósito — é símbolo, não dado.
 */
const RINGS = 7;
const R = 18;
const GAP = 64;

const hexPath = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, k) => {
        const a = ((k * 60 - 30) * Math.PI) / 180;
        return `${k === 0 ? 'M' : 'L'} ${cx + R * Math.cos(a)} ${cy - R * Math.sin(a)}`;
    }).join(' ') + ' Z';

export const GlucoseChain = () => {
    const width = GAP * (RINGS - 1) + R * 2 + 8;
    const cy = 30;
    return (
        <svg width={width} height={60} viewBox={`0 0 ${width} 60`} aria-hidden className="overflow-visible">
            {Array.from({ length: RINGS }, (_, i) => {
                const cx = R + 4 + i * GAP;
                return (
                    <g key={i}>
                        {i > 0 && (
                            <motion.line
                                x1={cx - GAP + R} y1={cy} x2={cx - R} y2={cy}
                                stroke={C.glycogenSoft} strokeWidth={2.5} strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ delay: 1.0 + i * 0.22, duration: 0.3, ease: 'easeOut' }}
                            />
                        )}
                        <motion.path
                            d={hexPath(cx, cy)}
                            fill="none"
                            stroke={C.glucose}
                            strokeWidth={3}
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ delay: 0.9 + i * 0.22, duration: 0.5, ease: 'easeInOut' }}
                        />
                    </g>
                );
            })}
        </svg>
    );
};
