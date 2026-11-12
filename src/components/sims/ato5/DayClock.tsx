import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountUp } from '../kit/CountUp';

/**
 * Relógio de 24 h: 24 gomos que acendem um a um (só opacidade) quando a carga começa.
 * `run` muda a chave e reacende do zero; `sprint` desenha o gomo vermelho dos 3 min antes da hora 0.
 */
const SIZE = 380;
const MID = SIZE / 2;
const R_IN = 112;
const R_OUT = 150;
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
const LABELS = [0, 6, 12, 18].map(h => ({ h, pos: polar(R_OUT + 22, h * HOUR_DEG) }));
const SPRINT = wedge(-11, -2, R_OUT + 6, R_OUT + 30);

interface DayClockProps {
    /** Chave da rodada de enchimento (troque para reacender). */
    run: string;
    lit: boolean;
    sprint: boolean;
    sprintLabel: string;
    hoursLabel: string;
}

export const DayClock = ({ run, lit, sprint, sprintLabel, hoursLabel }: DayClockProps) => {
    const reduce = useReducedMotion();
    return (
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} aria-hidden>
                <g key={run}>
                    {HOURS.map((d, i) => (
                        <motion.path key={d} d={d} fill={C.glucose}
                            initial={{ opacity: 0.14 }} animate={{ opacity: lit ? 1 : 0.14 }}
                            transition={{ delay: reduce || !lit ? 0 : 0.15 + i * 0.035, duration: 0.12 }} />
                    ))}
                </g>
                {LABELS.map(({ h, pos }) => (
                    <SvgText key={h} x={h === 0 ? pos[0] + 4 : pos[0]} y={pos[1] + 6} text={`${h}h`} anchor={h === 0 ? 'start' : 'middle'} size={18} color={C.muted} />
                ))}
                <motion.g initial={false} animate={{ opacity: sprint ? 1 : 0 }} transition={{ duration: 0.25 }}>
                    <path d={SPRINT} fill={C.risk} />
                    <SvgText x={polar(R_OUT + 40, -30)[0] - 4} y={polar(R_OUT + 40, -30)[1] + 6} text={sprintLabel} anchor="end" size={20} color={C.risk} weight={700} />
                </motion.g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <CountUp key={run} text={lit ? '24 h' : '0 h'} duration={reduce ? 0 : 0.95} delay={0.15}
                    className="font-display text-[72px] font-bold leading-none text-white" />
                <span className="text-[18px] text-gray-300">{hoursLabel}</span>
            </div>
        </div>
    );
};
