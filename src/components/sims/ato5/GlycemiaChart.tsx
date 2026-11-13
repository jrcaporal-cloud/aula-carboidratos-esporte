import { motion, useReducedMotion } from 'framer-motion';
import { EASE_IN_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { ARMS, HYPO, MEETS_AT, TEXT, X_MAX, Y_RANGE } from './rebound.content';

/**
 * Glicemia de Moseley 2003 (slide 85, faixa 2), só em minutos de EXERCÍCIO (0–20), uma escala. Do estudo: a largada
 * (6,6 / 4,5 / 3,7 mmol/L, rotuladas no próprio eixo) e o encontro aos 10 min. O caminho entre o 0 e os 10 min é desenho.
 */
const W = 272;
const H = 172;
const P = { x0: 46, x1: 262, y0: 22, y1: 130 } as const;

const xOf = (min: number) => P.x0 + (min / X_MAX) * (P.x1 - P.x0);
const yOf = (mmol: number) => P.y1 - ((mmol - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * (P.y1 - P.y0);

type Pt = readonly [number, number];

/** Catmull-Rom → Bézier: curva suave que passa pelos pontos dados (min, mmol/L). */
const smooth = (pts: readonly Pt[]): string => {
    const xy = pts.map(([t, g]) => [xOf(t), yOf(g)] as const);
    return xy.reduce((d, p, i) => {
        if (i === 0) return `M ${p[0]} ${p[1]}`;
        const p0 = xy[Math.max(i - 2, 0)];
        const p1 = xy[i - 1];
        const p3 = xy[Math.min(i + 1, xy.length - 1)];
        const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6];
        const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6];
        return `${d} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p[0]} ${p[1]}`;
    }, '');
};

/** As três se encontram aos 10 min (deslocadas 0,05 para as três aparecerem). Forma ilustrativa. */
const RIDE: Readonly<Record<string, readonly Pt[]>> = {
    a15: [[0, 6.6], [3, 5.6], [6, 4.95], [10, MEETS_AT + 0.05], [20, MEETS_AT + 0.05]],
    a45: [[0, 4.5], [5, 4.45], [10, MEETS_AT], [20, MEETS_AT]],
    a75: [[0, 3.7], [4, 4.05], [7, 4.4], [10, MEETS_AT - 0.05], [20, MEETS_AT - 0.05]],
};

export const GlycemiaChart = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block shrink-0" role="img"
            aria-label="Glicemia nos primeiros 20 minutos de exercício: largadas de 6,6, 4,5 e 3,7 mmol/L se encontram aos 10 minutos (forma ilustrativa)">
            <SvgText x={2} y={14} text={TEXT.yAxis} size={16} color={C.muted} />
            <line x1={P.x0} x2={P.x1} y1={yOf(HYPO)} y2={yOf(HYPO)} stroke={C.risk} strokeWidth={2.5} strokeDasharray="8 6" />
            <SvgText x={P.x1} y={yOf(HYPO) - 7} text={TEXT.hypo} anchor="end" size={16} color={C.risk} weight={700} />
            <line x1={P.x0} x2={P.x1} y1={P.y1} y2={P.y1} stroke={C.co2} strokeWidth={3} />
            <line x1={P.x0} x2={P.x0} y1={P.y0} y2={P.y1} stroke={C.co2} strokeWidth={3} />
            <g>
                <line x1={xOf(10)} x2={xOf(10)} y1={P.y0 + 18} y2={yOf(MEETS_AT) - 6} stroke={C.text} strokeWidth={2.5} strokeDasharray="5 5" />
                <SvgText x={xOf(10)} y={P.y0 + 12} text={TEXT.ten} anchor="middle" size={16} color="#FFFFFF" weight={800} />
            </g>
            {ARMS.map((a, i) => (
                <motion.path key={a.id} d={smooth(RIDE[a.id])} fill="none" stroke={a.color} strokeWidth={4.5} strokeLinecap="round"
                    initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: reduce ? 0 : 0.9, delay: 0.5 + i * 0.12, ease: EASE_IN_OUT }} />
            ))}
            {ARMS.map(a => (
                <g key={a.id}>
                    <circle cx={P.x0} cy={yOf(a.start)} r={7} fill={a.color} stroke="#04080F" strokeWidth={3} />
                    <SvgText x={P.x0 - 12} y={yOf(a.start) + 6} text={br(a.start)} anchor="end" size={17} color={a.color} weight={800} />
                </g>
            ))}
            {[0, 10, 20].map(t => (
                <SvgText key={t} x={xOf(t)} y={P.y1 + 20} text={String(t)} anchor="middle" size={16} color={C.muted} />
            ))}
            <SvgText x={(P.x0 + P.x1) / 2} y={H - 2} text={TEXT.xAxis} anchor="middle" size={16} color={C.muted} />
        </svg>
    );
};
