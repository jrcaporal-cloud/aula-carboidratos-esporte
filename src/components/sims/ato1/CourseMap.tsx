import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { CHAPTERS } from '../../../data/chapters';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * O percurso da aula: os 10 atos como marcos de uma prova, numa estrada que sobe e desce.
 * viewBox = tamanho da caixa (1:1): fonte 16 do SVG = 16 px de projeto.
 */
export const MAP_W = 1136;
export const MAP_H = 316;
const X0 = 104;
const X1 = MAP_W - 104;
const Y_HIGH = 104;
const Y_LOW = 220;

type P = readonly [number, number];
const POINTS: readonly P[] = CHAPTERS.map((_, i): P => [X0 + ((X1 - X0) * i) / (CHAPTERS.length - 1), i % 2 === 0 ? Y_LOW : Y_HIGH]);

/** Curva suave entre dois marcos (alças horizontais: a estrada nunca dá ré). */
const segment = ([x1, y1]: P, [x2, y2]: P): string => {
    const dx = (x2 - x1) / 2;
    return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
};
const SEGMENTS = POINTS.slice(1).map((p, i) => segment(POINTS[i], p));
const DARK = '#04080F';

export const CourseMap = ({ current }: { current: number }) => {
    const reduce = useReducedMotion();
    return (
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width={MAP_W} height={MAP_H} role="img"
            aria-label={`Percurso da aula: ato ${current + 1} de ${CHAPTERS.length}`}>
            {/* o percurso inteiro, ainda por correr */}
            {SEGMENTS.map(d => <path key={`base-${d}`} d={d} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" />)}
            {/* o trecho já corrido: cada pedaço se desenha quando o marco seguinte é alcançado */}
            {SEGMENTS.map((d, i) => {
                const on = i < current;
                return (
                    <motion.path key={`run-${d}`} d={d} fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                        transition={{
                            pathLength: { duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT },
                            opacity: { duration: 0.01, delay: on ? 0 : DUR.draw },
                        }} />
                );
            })}
            {CHAPTERS.map((ch, i) => {
                const [x, y] = POINTS[i];
                const reached = i <= current;
                const here = i === current;
                const above = y === Y_HIGH;
                return (
                    <g key={ch.roman}>
                        <motion.g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                            initial={false} animate={{ scale: here ? 1.25 : 1 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
                            <circle cx={x} cy={y} r={22} fill={reached ? ch.color : DARK} stroke={ch.color} strokeWidth={3} />
                            <text x={x} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={800}
                                fill={reached ? DARK : ch.color} style={{ fontFamily: 'var(--font-body)' }}>{ch.roman}</text>
                        </motion.g>
                        <motion.g initial={false} animate={{ opacity: here ? 1 : reached ? 0.85 : 0.55 }}
                            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                            <SvgText x={x} y={above ? y - 42 : y + 54} text={ch.title} anchor="middle" size={here ? 19 : 17}
                                color={here ? ch.color : C.text} weight={here ? 700 : 600} />
                        </motion.g>
                    </g>
                );
            })}
        </svg>
    );
};
