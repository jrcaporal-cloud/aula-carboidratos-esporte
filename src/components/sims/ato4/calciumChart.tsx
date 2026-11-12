import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { BAR_GROUPS, type BarGroup } from './calcium.content';

/**
 * Slide 66 · curso no tempo do braço (Ørtenblad 2011) e a replicação (Gejl 2014): barras lado a lado, em % do valor
 * antes. Cada barra cresce de baixo (scaleY). Nenhuma linha liga as barras: são grandezas diferentes.
 * À direita, no passo da replicação, r = 0,30 vira 9 de 100 quadrados (r² ≈ 0,09, conta nossa).
 */

export const CHART_W = 680;
export const CHART_H = 264;

const X0 = 52;
const GW = 74;
const BASE = 226;
const TOP = 66;
const yOf = (v: number) => BASE - ((BASE - TOP) * v) / 100;
const BW = 28;

const Bar = ({ x, v, color, label, show, delay, reduce }: { x: number; v: number; color: string; label: string; show: boolean; delay: number; reduce: boolean }) => (
    <g>
        <motion.rect x={x} y={yOf(v)} width={BW} height={BASE - yOf(v)} fill={color} style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
            initial={false} animate={{ scaleY: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: show ? delay : 0, ease: EASE_OUT }} />
        <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, delay: show ? delay + 0.4 : 0 }}>
            <SvgText x={x + BW / 2} y={yOf(v) - 8} text={label} size={16} anchor="middle" color="#FFFFFF" weight={700} />
        </motion.g>
    </g>
);

const Group = ({ g, i, step, reduce }: { g: BarGroup; i: number; step: number; reduce: boolean }) => {
    const show = step >= g.at;
    const cx = X0 + GW * i + GW / 2;
    const delay = step === g.at ? 0.1 + (i % 3) * 0.12 : 0;
    const caLabel = g.caText ?? `${g.ca}`;
    return (
        <g>
            {g.gly !== null && <Bar x={cx - BW - 3} v={g.gly} color={C.glycogen} label={`${g.gly}`} show={show} delay={delay} reduce={reduce} />}
            <Bar x={g.gly === null ? cx - BW / 2 : cx + 3} v={g.ca} color={C.insulin} label={caLabel} show={show} delay={delay + 0.08} reduce={reduce} />
            <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, delay: show ? delay : 0 }}>
                <SvgText x={cx} y={BASE + 24} text={g.label} size={16} anchor="middle" color={i === 5 ? C.caveat : '#E5E7EB'} weight={600} />
            </motion.g>
        </g>
    );
};

/** r = 0,30 → r² ≈ 0,09: 9 de 100 quadrados acesos. */
const Waffle = ({ show, reduce }: { show: boolean; reduce: boolean }) => (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
        <SvgText x={516} y={30} text="r = 0,30" size={24} color="#FFFFFF" weight={800} />
        <SvgText x={516} y={52} text="r² ≈ 0,09" size={16} color={C.caveat} weight={700} />
        {Array.from({ length: 100 }, (_, k) => {
            const col = k % 10;
            const row = 9 - Math.floor(k / 10);
            const lit = k < 9;
            return (
                <motion.rect key={k} x={516 + col * 16} y={66 + row * 16} width={13} height={13} rx={2}
                    initial={false} animate={{ fill: show && lit ? C.insulin : '#2A3140' }}
                    transition={{ duration: reduce ? 0 : DUR.text, delay: show && lit && !reduce ? 0.5 + k * 0.06 : 0 }} />
            );
        })}
        <SvgText x={516} y={250} text="≈ 9% da variação" size={16} color={C.insulinSoft} weight={700} />
    </motion.g>
);

export const CalciumChart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width={CHART_W} height={CHART_H} className="block" role="img"
            aria-label="Glicogênio e liberação de cálcio do retículo, em porcentagem do valor antes, ao longo do tempo">
            <rect x={X0} y={8} width={14} height={14} fill={C.glycogen} />
            <SvgText x={X0 + 20} y={21} text="glicogênio do braço" size={16} color={C.glycogenSoft} weight={700} />
            <rect x={X0 + 200} y={8} width={14} height={14} fill={C.insulin} />
            <SvgText x={X0 + 220} y={21} text="liberação de Ca²⁺ do RS" size={16} color={C.insulinSoft} weight={700} />
            {[0, 50, 100].map(v => (
                <g key={v}>
                    <line x1={X0 - 4} y1={yOf(v)} x2={X0 + GW * 6} y2={yOf(v)} stroke={v === 0 ? C.co2 : '#2A3140'} strokeWidth={2} />
                    <SvgText x={X0 - 10} y={yOf(v) + 6} text={`${v}%`} size={16} anchor="end" color={C.muted} />
                </g>
            ))}
            <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                <line x1={X0 + GW * 5} y1={TOP - 20} x2={X0 + GW * 5} y2={BASE} stroke={C.co2} strokeWidth={2} strokeDasharray="6 5" />
            </motion.g>
            {BAR_GROUPS.map((g, i) => <Group key={g.label} g={g} i={i} step={step} reduce={reduce} />)}
            <Waffle show={step >= 3} reduce={reduce} />
        </svg>
    );
};
