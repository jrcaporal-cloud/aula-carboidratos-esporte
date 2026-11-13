import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { sample, useMorphPath } from '../kit/useMorphPath';
import { SLOW, planSpeed, wallSpeed } from './wall.content';

/**
 * Slide 68 · a volta da Marina em velocidade relativa ao plano, km a km: a linha reta se transforma na do muro
 * (morfose), a zona dos ~10 km lentos aparece e uma corredora percorre o trecho novo uma vez. No último passo,
 * a faixa "ano de recorde pessoal" lembra quem arrisca o ritmo.
 */

export const WALL_W = 660;
export const WALL_H = 240;

const X0 = 64;
const X1 = 640;
const KM = 42.2;
const sx = (km: number) => X0 + (km / KM) * (X1 - X0);
const sy = (v: number) => 46 + ((1.05 - v) / 0.45) * 150;
const BASE = sy(0.6);
const toPts = (f: (km: number) => number) => sample(43, 0, KM, f, (km, v) => [sx(km), sy(v)] as const);
const PLAN = toPts(planSpeed);
const WALL = toPts(wallSpeed);
const RUN = [28, 30, 31, 32, 33, 36, 39, 42.2].map(km => [sx(km), sy(wallSpeed(km))] as const);

export const WallChart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const crashed = step >= 1;
    const ref = useMorphPath(crashed ? WALL : PLAN, 800);
    return (
        <svg viewBox={`0 0 ${WALL_W} ${WALL_H}`} width={WALL_W} height={WALL_H} className="block" role="img"
            aria-label="Velocidade da Marina relativa ao plano ao longo da maratona, com queda a partir do km 32">
            <SvgText x={4} y={20} text="velocidade, % da planejada" size={16} color={C.muted} weight={600} />
            {[1, 0.8].map(v => (
                <g key={v}>
                    <line x1={X0} y1={sy(v)} x2={X1} y2={sy(v)} stroke="#2A3140" strokeWidth={2} />
                    <SvgText x={X0 - 10} y={sy(v) + 6} text={`${Math.round(v * 100)}%`} size={16} anchor="end" color={C.muted} />
                </g>
            ))}
            <motion.g initial={false} animate={{ opacity: crashed ? 1 : 0 }} transition={{ duration: DUR.enter, delay: crashed ? 0.5 : 0 }}>
                <rect x={sx(32)} y={sy(1.02)} width={sx(KM) - sx(32)} height={BASE - sy(1.02)} fill={`${C.risk}1F`} />
                <line x1={sx(32)} y1={sy(1.04)} x2={sx(32)} y2={BASE} stroke={C.stone} strokeWidth={3} />
                <SvgText x={sx(32) - 8} y={sy(0.66)} text="km 32" size={18} anchor="end" color={C.stone} weight={800} />
                <SvgText x={sx(37.1)} y={sy(0.88)} text="~10 km" size={17} anchor="middle" color={C.risk} weight={800} />
                <SvgText x={sx(37.1)} y={sy(0.66) + 2} text="min/km +40%" size={17} anchor="middle" color={C.risk} weight={800} />
                <SvgText x={X0 - 10} y={sy(SLOW) + 6} text="71%" size={16} anchor="end" color={C.risk} weight={800} />
                <line x1={X0} y1={sy(SLOW)} x2={sx(32)} y2={sy(SLOW)} stroke={C.risk} strokeWidth={2} strokeDasharray="4 6" />
            </motion.g>
            <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                <rect x={sx(3)} y={sy(0.9) - 18} width={250} height={30} rx={8} fill="#04080F" stroke={C.stone} strokeWidth={2} />
                <SvgText x={sx(3) + 125} y={sy(0.9) + 3} text="perto do recorde pessoal: mais muro" size={16} anchor="middle" color={C.stone} weight={700} />
            </motion.g>
            {crashed && <line x1={X0} y1={sy(1)} x2={X1} y2={sy(1)} stroke={C.stone} strokeWidth={3} strokeDasharray="8 7" />}
            <path ref={ref} fill="none" stroke={crashed ? C.risk : C.stone} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
            {crashed && !reduce && step === 1 && (
                <motion.circle r={11} fill={C.stone} stroke="#04080F" strokeWidth={3} initial={{ x: RUN[0][0], y: RUN[0][1], opacity: 0 }}
                    animate={{ x: RUN.map(p => p[0]), y: RUN.map(p => p[1]), opacity: RUN.map((_, i) => (i === 0 ? 0 : 1)) }}
                    transition={{ duration: 1.2, delay: 0.2, ease: EASE_IN_OUT }} />
            )}
            {crashed && (reduce || step !== 1) && <circle cx={RUN[RUN.length - 1][0]} cy={RUN[RUN.length - 1][1]} r={11} fill={C.stone} stroke="#04080F" strokeWidth={3} />}
            <line x1={X0} y1={BASE} x2={X1} y2={BASE} stroke={C.co2} strokeWidth={2} />
            <SvgText x={X0 - 10} y={BASE + 6} text="60%" size={16} anchor="end" color={C.muted} />
            {[0, 10, 20, 30, 42.2].map(k => (
                <SvgText key={k} x={sx(k)} y={BASE + 26} text={k === 42.2 ? '42,2 km' : `${k}`} size={16} anchor={k === 42.2 ? 'end' : 'middle'} color={C.muted} />
            ))}
            <SvgText x={sx(1)} y={sy(1) - 12} text="ritmo planejado" size={16} color={C.caveat} weight={700} />
        </svg>
    );
};
