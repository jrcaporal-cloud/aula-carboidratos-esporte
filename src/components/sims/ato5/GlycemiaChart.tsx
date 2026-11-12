import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { ARMS, BASAL, HYPO, MEETS_AT, TEXT, X_RANGE, Y_RANGE, type Arm } from './rebound.content';

/**
 * Glicemia de Moseley 2003 (slide 85), do jejum à 20ª min de pedal. Do estudo: a hora da ingestão
 * (−75, −45, −15), a glicemia no 0 (6,6 / 4,5 / 3,7) e o encontro aos 10 min. O caminho entre esses
 * pontos é desenho. Passo 1 desenha o trecho de repouso; passo 2, o de exercício (uma vez, ≤ 1,2 s).
 */
export const CHART = { w: 440, h: 404 } as const;
const P = { x0: 54, x1: 430, y0: 44, y1: 346 } as const;
/** Fração do eixo para o repouso (−80 → 0); o exercício (0 → 20) ganha o resto, em escala maior. */
const REST_FRAC = 0.55;
const REST_W = (P.x1 - P.x0) * REST_FRAC;

const xOf = (min: number) => (min < 0
    ? P.x0 + ((min - X_RANGE[0]) / -X_RANGE[0]) * REST_W
    : P.x0 + REST_W + (min / X_RANGE[1]) * (P.x1 - P.x0 - REST_W));
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

/** Repouso: jejum até a dose; sobe; quem esperou mais já está descendo no 0 (forma ilustrativa). */
const REST: Readonly<Record<string, readonly Pt[]>> = {
    a15: [[-80, BASAL], [-15, BASAL], [-8, 5.7], [0, 6.6]],
    a45: [[-80, BASAL], [-45, BASAL], [-30, 6.6], [-17, 7.2], [-7, 6.0], [0, 4.5]],
    a75: [[-80, BASAL], [-75, BASAL], [-60, 6.6], [-45, 7.3], [-30, 6.0], [-15, 4.4], [0, 3.7]],
};

/** Exercício: as três se encontram aos 10 min (deslocadas 3 px para as três aparecerem). */
const RIDE: Readonly<Record<string, readonly Pt[]>> = {
    a15: [[0, 6.6], [4, 5.5], [10, MEETS_AT + 0.05], [20, MEETS_AT + 0.05]],
    a45: [[0, 4.5], [5, 4.35], [10, MEETS_AT], [20, MEETS_AT]],
    a75: [[0, 3.7], [4, 4.1], [10, MEETS_AT - 0.05], [20, MEETS_AT - 0.05]],
};

/** Ordem de desenho: quem tomou primeiro desenha primeiro. */
const ORDER: Readonly<Record<string, number>> = { a75: 0, a45: 1, a15: 2 };

const Segment = ({ d, color, on, delay, reduce }: { d: string; color: string; on: boolean; delay: number; reduce: boolean }) => (
    <motion.path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
        initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.75, delay: on ? delay : 0, ease: EASE_IN_OUT, opacity: { duration: 0.1, delay: on ? delay : 0 } }} />
);

const Dose = ({ arm, on, current }: { arm: Arm; on: boolean; current: boolean }) => (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : -30 }}
        transition={{ duration: DUR.enter, delay: current ? 0.1 + ORDER[arm.id] * 0.18 : 0, ease: EASE_OUT }}>
        <path d={`M ${xOf(-arm.before) - 10} ${P.y1 - 24} L ${xOf(-arm.before) + 10} ${P.y1 - 24} L ${xOf(-arm.before)} ${P.y1 - 6} Z`} fill={arm.color} stroke="#04080F" strokeWidth={2} />
    </motion.g>
);

export const GlycemiaChart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const rest = step >= 1;
    const ride = step >= 2;
    return (
        <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} width={CHART.w} height={CHART.h} className="block" role="img"
            aria-label="Glicemia antes e durante o exercício com 75 g de glicose 15, 45 ou 75 min antes; as curvas se encontram aos 10 min (forma ilustrativa)">
            <rect x={xOf(0)} y={P.y0} width={xOf(20) - xOf(0)} height={P.y1 - P.y0} fill="rgba(255,255,255,0.05)" />
            <SvgText x={(xOf(0) + xOf(20)) / 2} y={P.y0 - 14} text={TEXT.exercise} anchor="middle" size={16} color={C.caveat} weight={700} />
            <SvgText x={xOf(-6)} y={P.y0 - 14} text={TEXT.rest} anchor="end" size={16} color={C.muted} weight={700} />
            {[4, 5, 6, 7, 8, 9].map(g => (
                <g key={g}>
                    <line x1={P.x0} x2={P.x1} y1={yOf(g)} y2={yOf(g)} stroke="rgba(255,255,255,0.09)" strokeWidth={2} />
                    <SvgText x={P.x0 - 10} y={yOf(g) + 6} text={String(g)} anchor="end" size={16} color={C.muted} />
                </g>
            ))}
            <line x1={P.x0} x2={P.x1} y1={yOf(HYPO)} y2={yOf(HYPO)} stroke={C.risk} strokeWidth={2.5} strokeDasharray="10 8" />
            <SvgText x={xOf(-72)} y={yOf(HYPO) - 8} text={TEXT.hypo} size={16} color={C.risk} weight={700} />
            <line x1={P.x0} x2={P.x1} y1={P.y1} y2={P.y1} stroke={C.co2} strokeWidth={3} />
            <line x1={xOf(0)} x2={xOf(0)} y1={P.y0} y2={P.y1} stroke={C.co2} strokeWidth={3} />

            <motion.g initial={false} animate={{ opacity: ride ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 2 ? 0.8 : 0 }}>
                <line x1={xOf(10)} x2={xOf(10)} y1={P.y0} y2={P.y1} stroke={C.text} strokeWidth={3} strokeDasharray="6 6" />
                <SvgText x={xOf(10)} y={P.y0 + 20} text={TEXT.ten} anchor="middle" size={16} color="#fff" weight={800} />
            </motion.g>

            {ARMS.map(a => <Dose key={a.id} arm={a} on={rest} current={step === 1} />)}
            {ARMS.map(a => (
                <g key={a.id}>
                    <Segment d={smooth(REST[a.id])} color={a.color} on={rest} delay={0.25 + ORDER[a.id] * 0.12} reduce={reduce} />
                    <Segment d={smooth(RIDE[a.id])} color={a.color} on={ride} delay={0.1} reduce={reduce} />
                </g>
            ))}
            {ARMS.map(a => (
                <motion.circle key={a.id} cx={xOf(0)} cy={yOf(a.start)} r={8} fill={a.color} stroke="#04080F" strokeWidth={3}
                    initial={false} animate={{ opacity: rest ? 1 : 0 }} transition={{ duration: DUR.text, delay: step === 1 ? 0.95 : 0 }} />
            ))}

            {/* legenda: hora da glicose e glicemia no 0 (dado) */}
            <motion.g initial={false} animate={{ opacity: rest ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.3 : 0 }}>
                <SvgText x={P.x0 + 8} y={P.y0 + 18} text={TEXT.legend} size={16} color={C.caveat} weight={700} />
                {ARMS.map((a, i) => (
                    <g key={a.id}>
                        <rect x={P.x0 + 8} y={P.y0 + 28 + i * 22} width={14} height={14} rx={3} fill={a.color} />
                        <SvgText x={P.x0 + 30} y={P.y0 + 41 + i * 22} text={`${a.before} min antes → ${br(a.start)}`} size={16} color="#F3F4F6" weight={600} />
                    </g>
                ))}
            </motion.g>

            {[-75, -45, -15, 0, 10, 20].map(t => (
                <SvgText key={t} x={xOf(t)} y={P.y1 + 24} text={t < 0 ? `−${-t}` : String(t)} anchor="middle" size={16} color={C.muted} />
            ))}
            <SvgText x={P.x1} y={P.y1 + 48} text={TEXT.xAxis} anchor="end" size={16} color={C.muted} />
            <SvgText x={4} y={P.y0 - 14} text="mmol/L" size={16} color={C.muted} />
        </svg>
    );
};
