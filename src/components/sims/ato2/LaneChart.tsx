import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { CountSvgText } from '../kit/CountUp';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { BARS } from './twoLanes.content';

/**
 * Slide 26 · o gráfico do Jentjens 2004 (viewBox 410 × 432): dose ingerida (contorno tracejado) e pico de
 * oxidação exógena (barra cheia), em g/min, com a faixa do teto de uma fonte só (~1,0–1,1 g/min).
 * A faixa vem no passo 1, as barras de glicose no 2, a de glicose + frutose no 3; nada some.
 */
export const CHART_W = 410;
export const CHART_H = 424;

const X0 = 62, X1 = 400, Y0 = 344, PX = 140; // 1 g/min = 140 px
const yOf = (v: number): number => Y0 - v * PX;
const COL = [128, 230, 336] as const;
const BAR_W = 64;

const Bar = ({ i, step, reduce }: { i: number; step: number; reduce: boolean }) => {
    const b = BARS[i];
    const on = step >= b.at;
    const now = step === b.at;
    const x = COL[i];
    const delay = now ? 0.2 + (i % 2) * 0.18 : 0;
    return (
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, delay: now ? 0.1 : 0 }}>
            <rect x={x - BAR_W / 2 - 6} y={yOf(b.ingested)} width={BAR_W + 12} height={b.ingested * PX} rx={6}
                fill="none" stroke={C.caveat} strokeWidth={2.5} strokeDasharray="7 5" />
            <motion.rect x={x - BAR_W / 2} y={yOf(b.oxidized)} width={BAR_W} height={b.oxidized * PX} rx={4} fill={b.color}
                style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
                initial={false} animate={{ scaleY: on ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay, ease: EASE_OUT }} />
            <CountSvgText x={x} y={yOf(b.oxidized) - 10} text={b.text} size={24} anchor="middle" weight={800}
                color={i === 2 ? C.fructoseSoft : C.glucoseSoft} run={on} delay={delay} duration={0.7} />
            <SvgText x={x} y={Y0 + 26} text={b.label[0]} size={16} anchor="middle" color="#E5E7EB" />
            <SvgText x={x} y={Y0 + 46} text={b.label[1]} size={16} anchor="middle" color="#E5E7EB" />
        </motion.g>
    );
};

export const LaneChart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width={CHART_W} height={CHART_H} className="block" role="img"
            aria-label="Pico de oxidação exógena: 0,80 com glicose 1,2; 0,83 com glicose 1,8; 1,26 com glicose 1,2 + frutose 0,6 g/min">
            <SvgText x={8} y={24} text="PICO DE OXIDAÇÃO EXÓGENA" size={16} color={C.muted} weight={700} />
            <SvgText x={8} y={46} text="g/min · 120 min a 50% Wmáx" size={16} color={C.caveat} />
            {[0, 0.5, 1, 1.5].map(v => (
                <g key={v}>
                    <line x1={X0} y1={yOf(v)} x2={X1} y2={yOf(v)} stroke="#334155" strokeWidth={2} />
                    <SvgText x={X0 - 10} y={yOf(v) + 6} text={String(v).replace('.', ',')} size={16} anchor="end" color="#D1D5DB" />
                </g>
            ))}
            <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#94A3B8" strokeWidth={3} />

            {/* faixa do teto com uma fonte só */}
            <rect x={X0} y={yOf(1.1)} width={X1 - X0} height={0.1 * PX} fill={`${C.stone}38`} />
            <line x1={X0} y1={yOf(1.1)} x2={X1} y2={yOf(1.1)} stroke={C.stone} strokeWidth={2.5} strokeDasharray="8 6" />
            <line x1={X0} y1={yOf(1.0)} x2={X1} y2={yOf(1.0)} stroke={C.stone} strokeWidth={2.5} strokeDasharray="8 6" />
            <rect x={8} y={58} width={26} height={14} fill={`${C.stone}38`} stroke={C.stone} strokeWidth={2} strokeDasharray="5 4" />
            <SvgText x={42} y={71} text="teto com uma fonte só: ~1,0–1,1" size={16} color={C.stone} weight={700} />

            {BARS.map((_, i) => <Bar key={i} i={i} step={step} reduce={reduce} />)}

            {/* legenda: contorno = ingerido, cheia = oxidado */}
            <g>
                <rect x={X0} y={398} width={22} height={18} rx={3} fill="none" stroke={C.caveat} strokeWidth={2.5} strokeDasharray="5 4" />
                <SvgText x={X0 + 30} y={413} text="ingerido" size={16} color={C.caveat} />
                <rect x={X0 + 120} y={398} width={22} height={18} rx={3} fill={C.glucose} />
                <SvgText x={X0 + 150} y={413} text="oxidado (pico)" size={16} color={C.caveat} />
            </g>
            <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 2 ? 0.8 : 0 }}>
                <SvgText x={COL[2]} y={yOf(1.26) - 40} text="+55%" size={20} anchor="middle" color={C.fructoseSoft} weight={800} />
            </motion.g>
        </svg>
    );
};
