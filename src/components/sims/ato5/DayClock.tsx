import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountUp } from '../kit/CountUp';
import { Tank } from '../kit/Tank';

/**
 * Relógio de 24 h com o tanque no miolo (slide 81). Os 24 gomos acendem um a um (só opacidade) enquanto o
 * tanque sobe: o professor vê o dia passando e o músculo enchendo ao mesmo tempo. `run` muda a chave e
 * reacende do zero; `sprint` desenha o gomo dos 3 min antes da hora 0 (Fairchild).
 */
const SIZE = 320;
const MID = SIZE / 2;
const R_IN = 98;
const R_OUT = 126;
const GAP_DEG = 1.6;
const HOUR_DEG = 15;

const polar = (r: number, deg: number): [number, number] => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [MID + r * Math.cos(a), MID + r * Math.sin(a)];
};

/** Gomo anelar entre dois ângulos (graus, 0 = topo, sentido horário). */
const wedge = (a0: number, a1: number, rIn = R_IN, rOut = R_OUT): string => {
    const [x0, y0] = polar(rOut, a0);
    const [x1, y1] = polar(rOut, a1);
    const [x2, y2] = polar(rIn, a1);
    const [x3, y3] = polar(rIn, a0);
    return `M${x0} ${y0} A${rOut} ${rOut} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${rIn} ${rIn} 0 0 0 ${x3} ${y3} Z`;
};

const HOURS = Array.from({ length: 24 }, (_, i) => wedge(i * HOUR_DEG + GAP_DEG, (i + 1) * HOUR_DEG - GAP_DEG));
const LABELS = [6, 12, 18].map(h => ({ h, pos: polar(R_OUT + 20, h * HOUR_DEG) }));
const SPRINT = wedge(-16, -2, R_OUT + 4, R_OUT + 22);
const SPRINT_LABEL = polar(R_OUT + 26, -24);

interface DayClockProps {
    /** Chave da rodada de enchimento (troque para reacender). */
    run: string;
    lit: boolean;
    sprint: boolean;
    sprintLabel: string;
    /** Nível do tanque, 0 → 1. */
    level: number;
}

export const DayClock = ({ run, lit, sprint, sprintLabel, level }: DayClockProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} aria-hidden>
                <g key={run}>
                    {HOURS.map((d, i) => (
                        <motion.path key={d} d={d} fill={C.glucose}
                            initial={{ opacity: 0.16 }} animate={{ opacity: lit ? 1 : 0.16 }}
                            transition={{ delay: reduce || !lit ? 0 : 0.1 + i * 0.034, duration: 0.12 }} />
                    ))}
                </g>
                <SvgText x={MID + 8} y={MID - R_OUT - 10} text="0 h" anchor="start" size={18} color={C.muted} />
                {LABELS.map(({ h, pos }) => (
                    <SvgText key={h} x={pos[0]} y={pos[1] + 6} text={`${h}`} anchor="middle" size={18} color={C.muted} />
                ))}
                <motion.g initial={false} animate={{ opacity: sprint ? 1 : 0 }} transition={{ duration: 0.25 }}>
                    <path d={SPRINT} fill={C.stone} />
                    <SvgText x={SPRINT_LABEL[0]} y={SPRINT_LABEL[1]} text={sprintLabel} anchor="end" size={18} color={C.stone} weight={700} />
                </motion.g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 pt-1">
                <CountUp key={run} text={lit ? '24 h' : '0 h'} duration={reduce ? 0 : 0.9} delay={0.1}
                    className="font-display text-[28px] font-bold leading-none text-white" />
                <Tank level={level} width={62} height={122} active />
            </div>
        </div>
    );
};
