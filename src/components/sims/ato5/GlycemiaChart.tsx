import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { sample, useMorphPath, type Pt } from '../kit/useMorphPath';
import { ARMS, HYPO, MEETS_AT, TEXT, X_MAX, Y_RANGE, type Arm } from './rebound.content';

/**
 * Glicemia nos primeiros 20 min de exercício (slide 85). Cada curva nasce encolhida no ponto de largada
 * (a glicemia medida antes do exercício) e se estende até se encontrar com as outras aos 10 min.
 * Entre 0 e 10 min a forma é desenho; o ponto de partida e o encontro em 10 min são do estudo.
 */
export const VB = { w: 680, h: 380 } as const;
const PLOT = { x0: 200, x1: 650, y0: 24, y1: 316 } as const;
const N = 24;

const xOf = (min: number) => PLOT.x0 + (min / X_MAX) * (PLOT.x1 - PLOT.x0);
const yOf = (mmol: number) => PLOT.y1 - ((mmol - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * (PLOT.y1 - PLOT.y0);

/** Profundidade da queda transitória no início do exercício (desenho). */
const DIP = 0.45;

/** Do valor de partida até o encontro: uma queda transitória, o encontro aos 10 min e depois plano. */
const curve = (start: number) => (t: number): number => {
    const k = Math.min(t / 10, 1);
    const ease = 1 - Math.pow(1 - k, 2.2);
    return start + (MEETS_AT - start) * ease - DIP * Math.sin(Math.PI * k);
};

const collapsed = (start: number): Pt[] => Array.from({ length: N }, () => [xOf(0), yOf(start)] as Pt);
const spread = (start: number): Pt[] => sample(N, 0, X_MAX, curve(start), (x, y) => [xOf(x), yOf(y)]);

const Curve = ({ arm, open }: { arm: Arm; open: boolean }) => {
    const ref = useMorphPath(open ? spread(arm.start) : collapsed(arm.start), 900);
    return <path ref={ref} fill="none" stroke={arm.color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />;
};

export const GlycemiaChart = ({ open, showTen }: { open: boolean; showTen: boolean }) => (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="h-full w-full" aria-hidden>
        <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.y1} y2={PLOT.y1} stroke={C.co2} strokeWidth={3} />
        <line x1={PLOT.x0} x2={PLOT.x1} y1={yOf(HYPO)} y2={yOf(HYPO)} stroke={C.risk} strokeWidth={2.5} strokeDasharray="10 8" />
        <SvgText x={PLOT.x1} y={yOf(HYPO) - 10} text={`${br(HYPO)} · ${TEXT.hypo}`} anchor="end" size={17} color={C.risk} />

        <motion.g initial={false} animate={{ opacity: showTen ? 1 : 0 }} transition={{ duration: 0.3, delay: showTen ? 0.7 : 0 }}>
            <line x1={xOf(10)} x2={xOf(10)} y1={PLOT.y0} y2={PLOT.y1} stroke={C.caveat} strokeWidth={3} />
            <SvgText x={xOf(10) + 8} y={PLOT.y0 + 16} text={TEXT.ten} size={18} color={C.caveat} weight={700} />
        </motion.g>

        {ARMS.map(arm => <Curve key={arm.id} arm={arm} open={open} />)}
        {ARMS.map(arm => (
            <g key={`l${arm.id}`}>
                <circle cx={xOf(0)} cy={yOf(arm.start)} r={8} fill={arm.color} />
                <SvgText x={xOf(0) - 18} y={yOf(arm.start) + 7} text={`${arm.label} antes · ${br(arm.start)}`} anchor="end" size={20} color={arm.color} weight={700} />
            </g>
        ))}

        {[0, 10, 20].map(t => <SvgText key={t} x={xOf(t)} y={PLOT.y1 + 28} text={String(t)} anchor="middle" size={17} color={C.muted} />)}
        <SvgText x={PLOT.x1} y={PLOT.y1 + 56} text={TEXT.xAxis} anchor="end" size={17} color={C.muted} />
        <SvgText x={20} y={PLOT.y1 + 56} text={TEXT.yAxis} size={17} color={C.muted} />
    </svg>
);
