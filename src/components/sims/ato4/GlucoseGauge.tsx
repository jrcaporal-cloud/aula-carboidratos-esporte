import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { GLUCOSE_RANGE } from './twoTanks.content';

/** Mostrador da glicose no sangue (mM): meia-lua chapada; o ponteiro gira (transform) até o valor. */

const W = 264;
const H = 150;
const CX = W / 2;
const CY = 118;
const R = 92;

const angleOf = (mM: number) => {
    const [lo, hi] = GLUCOSE_RANGE;
    const t = Math.max(0, Math.min(1, (mM - lo) / (hi - lo)));
    return -90 + t * 180;
};

const arc = (a0: number, a1: number) => {
    const p = (a: number) => [CX + R * Math.sin((a * Math.PI) / 180), CY - R * Math.cos((a * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`;
};

export const GlucoseGauge = ({ mM }: { mM: number | null }) => {
    const reduce = useReducedMotion() ?? false;
    const on = mM !== null;
    const low = on && mM < 3.5;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H, opacity: on ? 1 : 0 }} className="block transition-opacity duration-300"
            role="img" aria-label={on ? `Glicose no sangue: ${mM} mM` : 'Glicose no sangue'}>
            <path d={arc(-90, angleOf(3.5))} stroke={C.risk} strokeWidth={14} fill="none" />
            <path d={arc(angleOf(3.5), 90)} stroke="#3A4152" strokeWidth={14} fill="none" />
            {[2, 4, 6].map(v => {
                const a = (angleOf(v) * Math.PI) / 180;
                return <SvgText key={v} x={CX + (R + 24) * Math.sin(a)} y={CY - (R + 24) * Math.cos(a) + 6} text={String(v)} size={16} anchor="middle" color={C.muted} />;
            })}
            <motion.g style={{ transformOrigin: `${CX}px ${CY}px` }} initial={false} animate={{ rotate: angleOf(mM ?? 5) }}
                transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }}>
                <rect x={CX - 3} y={CY - R + 8} width={6} height={R - 8} rx={3} fill={low ? C.risk : C.glucoseSoft} />
            </motion.g>
            <circle cx={CX} cy={CY} r={9} fill={C.stone} />
            <SvgText x={CX} y={H - 2} text="glicose no sangue, mM" size={16} anchor="middle" color={C.caveat} />
        </svg>
    );
};
