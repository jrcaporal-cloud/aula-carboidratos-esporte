import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { RUNS, TEXT, Y_MAX, Y_MIN, type LoadRun } from './oneDayLoad.content';

/**
 * O herói do slide 81: glicogênio (mmol/kg de peso úmido) × horas desde o início da carga (0–72 h), uma escala só.
 * A faixa clara de 0 a 24 h é o dia de carga (a mesma cor da linha do tempo acima). Bussau sobe de 95 a 180 em 24 h e
 * fica estável até o dia 3 (tracejado ilustrativo: o abstract não dá número); Fairchild sobe de 109 a 198.
 */
const W = 640;
const H = 252;
const X0 = 52;
const X1 = 628;
const Y0 = 30;
const Y1 = 204;
const x = (h: number) => X0 + (h / 72) * (X1 - X0);
const y = (v: number) => Y1 - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (Y1 - Y0);
const COLOR: Record<LoadRun['id'], string> = { bussau: C.glycogen, fairchild: C.glycogenSoft };

const Run = ({ r, step }: { r: LoadRun; step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const on = step >= r.at;
    const fresh = step === r.at;
    const color = COLOR[r.id];
    const t = (delay: number, duration: number = DUR.draw) => ({ duration: reduce ? 0 : duration, delay: on && fresh && !reduce ? delay : 0, ease: EASE_OUT });
    return (
        <g>
            <motion.path d={`M${x(0)} ${y(r.from)} L${x(24)} ${y(r.to)}`} stroke={color} strokeWidth={5} strokeLinecap="round" fill="none"
                initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={t(0.1)} />
            {r.plateau && (
                <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={t(1, DUR.enter)}>
                    <path d={`M${x(24)} ${y(r.to)} L${x(72)} ${y(r.to)}`} stroke={color} strokeWidth={4} strokeDasharray="9 7" fill="none" />
                    <SvgText x={X1} y={y(r.to) + 26} text={TEXT.plateau} anchor="end" size={16} color={C.glycogenSoft} />
                </motion.g>
            )}
            <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={t(0.85, DUR.enter)}>
                <circle cx={x(0)} cy={y(r.from)} r={6} fill={color} />
                <circle cx={x(24)} cy={y(r.to)} r={7} fill={color} />
                <SvgText x={x(24) + 14} y={r.plateau ? y(r.to) + 26 : y(r.to) - 2} text={`${r.label} ${r.to}`} size={17} color="#FFFFFF" weight={700} />
            </motion.g>
        </g>
    );
};

export const OneDayChart = ({ step }: { step: number }) => (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" role="img"
        aria-label="glicogênio muscular em mmol/kg de peso úmido nas primeiras 72 horas de carga">
        <rect x={x(0)} y={Y0} width={x(24) - x(0)} height={Y1 - Y0} fill="rgba(245,158,11,0.08)" />
        <SvgText x={(x(0) + x(24)) / 2} y={Y0 - 10} text={TEXT.band} anchor="middle" size={16} color={C.glucoseSoft} weight={700} />
        {[100, 150, 200].map(v => (
            <g key={v}>
                <line x1={X0} x2={X1} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
                <SvgText x={X0 - 10} y={y(v) + 6} text={String(v)} anchor="end" size={16} color={C.muted} />
            </g>
        ))}
        <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke={C.co2} strokeWidth={3} />
        <line x1={X0} x2={X0} y1={Y0} y2={Y1} stroke={C.co2} strokeWidth={3} />
        {[0, 24, 48, 72].map(h => (
            <SvgText key={h} x={x(h)} y={Y1 + 22} text={h === 72 ? '72 h' : String(h)} anchor={h === 72 ? 'end' : 'middle'} size={16} color={C.muted} />
        ))}
        <SvgText x={(X0 + X1) / 2} y={H - 4} text={TEXT.xAxis} anchor="middle" size={16} color={C.muted} />
        {RUNS.map(r => <Run key={r.id} r={r} step={step} />)}
    </svg>
);
