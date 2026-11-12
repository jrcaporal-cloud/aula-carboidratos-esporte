import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CRAVEN, MARGOLIS, VANLOON, type EffectRow } from './protein.content';

/**
 * Slide 122 · as três peças do tríptico. (1) van Loon 2000: barras de ressíntese com a dose embaixo de cada uma
 * (CHO âmbar + proteína laranja), para ver que 0,8 + 0,4 tem os gramas do CHO 1,2. (2) Margolis 2021: floresta
 * em g de Hedges. (3) Craven 2021: CHO × água e + proteína × CHO na mesma régua (mmol/kg ps/h).
 * viewBox = tamanho real (340 × 206): texto ≥ 16 fica ≥ 16.
 */

export const CARD_SVG_W = 340;
export const CARD_SVG_H = 206;

const TONE: Record<EffectRow['tone'], string> = { protein: C.protein, neutral: C.stone, cho: C.glucose, muted: C.caveat };

const show = (on: boolean, current: boolean, delay: number) => ({
    initial: false as const,
    animate: { opacity: on ? 1 : 0 },
    transition: { duration: DUR.enter, delay: on && current ? delay : 0, ease: EASE_OUT },
});

/* ---------- van Loon 2000 ---------- */
const VL_AXIS = 138;
const VL_TOP = 44;
const VL_MAX = 50;
const vlY = (v: number) => VL_AXIS - (v / VL_MAX) * (VL_AXIS - VL_TOP);
const VL_COL = 112;
const DOSE_PX = 70;

export const VanLoonBars = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${CARD_SVG_W} ${CARD_SVG_H}`} width={CARD_SVG_W} height={CARD_SVG_H} className="block" role="img"
            aria-label="van Loon 2000: 16,6, 35,4 e 44,8 mmol/kg ps/h">
            <rect x={0} y={VL_AXIS} width={CARD_SVG_W} height={2} fill="rgba(255,255,255,0.5)" />
            {VANLOON.map((a, i) => {
                const on = step >= a.at;
                const cx = 60 + i * VL_COL;
                const top = vlY(a.rate);
                return (
                    <g key={a.id}>
                        <motion.rect x={cx - 30} y={top} width={60} height={VL_AXIS - top} rx={4}
                            fill={a.id === 'low' ? 'rgba(139,92,246,0.3)' : C.glycogen} stroke={C.glycogen} strokeWidth={3}
                            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                            initial={false} animate={{ scaleY: on ? 1 : 0, opacity: on ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : DUR.bar, delay: on && step === a.at ? 0.1 + i * 0.12 : 0, ease: EASE_OUT }} />
                        <motion.g {...show(on, step === a.at, 0.5 + i * 0.1)}>
                            <SvgText x={cx} y={top - 8} text={a.rateText} size={24} anchor="middle" color={a.id === 'low' ? '#F3F4F6' : C.glycogenSoft} weight={800} />
                            {/* dose: CHO âmbar + proteína laranja, 70 px por g/kg/h */}
                            <rect x={cx - (DOSE_PX * 1.2) / 2} y={148} width={DOSE_PX * a.cho} height={14} rx={2} fill={C.glucose} />
                            {a.pro > 0 && <rect x={cx - (DOSE_PX * 1.2) / 2 + DOSE_PX * a.cho + 2} y={148} width={DOSE_PX * a.pro - 2} height={14} rx={2} fill={C.protein} />}
                            <SvgText x={cx} y={182} text={a.label} size={16} anchor="middle" color="#F3F4F6" />
                            {a.insulin && <SvgText x={cx} y={202} text={a.insulin} size={16} anchor="middle" color={C.insulinSoft} weight={500} />}
                        </motion.g>
                    </g>
                );
            })}
            <SvgText x={0} y={16} text="mmol/kg ps/h" size={16} color={C.caveat} weight={600} />
            {/* legenda da dose (g/kg/h) */}
            <rect x={196} y={4} width={14} height={14} rx={2} fill={C.glucose} />
            <SvgText x={214} y={17} text="CHO" size={16} color={C.glucoseSoft} weight={600} />
            <rect x={262} y={4} width={14} height={14} rx={2} fill={C.protein} />
            <SvgText x={280} y={17} text="PTN" size={16} color={C.proteinSoft} weight={600} />
        </svg>
    );
};

/* ---------- floresta compacta (Margolis e Craven) ---------- */
interface ForestProps {
    rows: readonly EffectRow[];
    domain: readonly [number, number];
    ticks: readonly number[];
    unit: string;
    at: number;
    step: number;
    rowH: number;
    /** Linha de rodapé (ex.: as doses dos braços). */
    note?: string;
}

const PLOT_X0 = 28;
const PLOT_X1 = 280;

export const MiniForest = ({ rows, domain, ticks, unit, at, step, rowH, note }: ForestProps) => {
    const sx = (v: number) => PLOT_X0 + ((v - domain[0]) / (domain[1] - domain[0])) * (PLOT_X1 - PLOT_X0);
    const axisY = 12 + rows.length * rowH;
    const on = step >= at;
    return (
        <svg viewBox={`0 0 ${CARD_SVG_W} ${CARD_SVG_H}`} width={CARD_SVG_W} height={CARD_SVG_H} className="block" role="img" aria-label={unit}>
            <motion.g {...show(on, step === at, 0)}>
                <path d={`M ${sx(0)} 6 L ${sx(0)} ${axisY}`} stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeDasharray="5 5" />
                <rect x={PLOT_X0} y={axisY} width={PLOT_X1 - PLOT_X0} height={2} fill="rgba(255,255,255,0.5)" />
                {ticks.map(t => <SvgText key={t} x={sx(t)} y={axisY + 20} text={`${t}`.replace('.', ',').replace('-', '−')} size={16} anchor="middle" color="#D1D5DB" weight={500} />)}
                <SvgText x={(PLOT_X0 + PLOT_X1) / 2} y={axisY + 40} text={unit} size={16} anchor="middle" color={C.caveat} weight={500} />
                {note && <SvgText x={0} y={CARD_SVG_H - 4} text={note} size={16} color="#D1D5DB" weight={500} />}
            </motion.g>
            {rows.map((r, i) => {
                const y = 12 + i * rowH + rowH * 0.62;
                const color = TONE[r.tone];
                return (
                    <motion.g key={r.id} initial={false} animate={{ opacity: on ? 1 : 0, x: on ? 0 : -10 }}
                        transition={{ duration: DUR.enter, delay: on && step === at ? 0.15 + i * 0.12 : 0, ease: EASE_OUT }}>
                        <SvgText x={PLOT_X0} y={y - 12} text={r.label} size={16} color="#E5E7EB" weight={600} />
                        <path d={`M ${sx(r.lo)} ${y} L ${sx(r.hi)} ${y}`} stroke={color} strokeWidth={4} strokeLinecap="round" />
                        <rect x={sx(r.est) - 7} y={y - 7} width={14} height={14} fill={color} stroke="#04080F" strokeWidth={2} />
                        <SvgText x={CARD_SVG_W} y={y + 6} text={r.text} size={20} anchor="end" color={color} weight={800} />
                    </motion.g>
                );
            })}
        </svg>
    );
};

export const MargolisForest = ({ step }: { step: number }) => (
    <MiniForest rows={MARGOLIS} domain={[-0.4, 0.6]} ticks={[-0.4, -0.2, 0, 0.2, 0.4, 0.6]} unit="g de Hedges (IC95%)" at={2} step={step} rowH={36} />
);

export const CravenForest = ({ step }: { step: number }) => (
    <MiniForest rows={CRAVEN} domain={[-5, 30]} ticks={[0, 10, 20, 30]} unit="mmol/kg ps/h (IC95%)" at={3} step={step} rowH={56}
        note="doses: CHO 0,86 + PTN 0,27 × CHO 0,95" />
);
