import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { CountSvgText } from '../kit/CountUp';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { PDH_10MIN, PDH_BARS, PHOS } from './fatbrake.content';

/**
 * Faixa de baixo do palco do slide 45 (dois gráficos de 320 × 178, HOWLETT1998): a PDH ativa por potência (barras que
 * crescem, números que contam) e a fosforilase a que NÃO sobe (faixa estável e a queda aos 10 min a 90%).
 */

const TOP = 252;
const BASE = 400;
const PDH_MAX = 4.6;
const PDH_H = 104;
const ph = (v: number) => (v / PDH_MAX) * PDH_H;

export const PdhBars = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <SvgText x={0} y={TOP + 16} text="PDH ativa, 1º min" size={16} color="#F3F4F6" weight={800} />
            <SvgText x={0} y={TOP + 38} text="mmol·kg⁻¹·min⁻¹" size={16} color={C.muted} />
            <line x1={0} y1={BASE + 1} x2={300} y2={BASE + 1} stroke="#94A3B8" strokeWidth={3} />
            {PDH_BARS.map((b, i) => {
                const x = 14 + i * 66;
                const delay = 0.2 + i * 0.12;
                return (
                    <g key={b.label}>
                        <motion.rect x={x} y={BASE - ph(b.value)} width={44} height={ph(b.value)} rx={4} fill={C.glucose}
                            style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
                            initial={false} animate={{ scaleY: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: show ? delay : 0, ease: EASE_OUT }} />
                        {show && <CountSvgText x={x + 22} y={BASE - ph(b.value) - 8} text={b.text} delay={delay} size={17} anchor="middle" color={C.glucoseSoft} weight={800} />}
                        <SvgText x={x + 22} y={BASE + 22} text={b.label} size={16} anchor="middle" color="#D1D5DB" />
                    </g>
                );
            })}
            <line x1={14 + 3 * 66 - 4} y1={BASE - ph(PDH_10MIN.value)} x2={14 + 3 * 66 + 48} y2={BASE - ph(PDH_10MIN.value)} stroke="#FFFFFF" strokeWidth={3} strokeDasharray="6 5" />
            <SvgText x={14 + 3 * 66 + 22} y={BASE - ph(PDH_10MIN.value) - 8} text="4,45 aos 10 min" size={16} anchor="middle" color="#F3F4F6" />
        </motion.g>
    );
};

/** Fosforilase a: escala 0–40%. A faixa 21,4–29,6% cobre as três intensidades; o ponto é 90% aos 10 min. */
const PH_H = 112;
const py = (pct: number) => BASE - (pct / 40) * PH_H;

export const PhosphorylaseBand = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <SvgText x={0} y={TOP + 16} text="fosforilase a · % do total" size={16} color="#F3F4F6" weight={800} />
            <line x1={0} y1={BASE + 1} x2={310} y2={BASE + 1} stroke="#94A3B8" strokeWidth={3} />
            {[0, 20].map(v => <SvgText key={v} x={26} y={py(v) + 6} text={`${v}`} size={16} anchor="end" color="#D1D5DB" />)}
            <motion.rect x={36} y={py(PHOS.high)} width={186} height={py(PHOS.low) - py(PHOS.high)} rx={6} fill={C.glycogen}
                style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                initial={false} animate={{ scaleX: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: show ? 0.2 : 0, ease: EASE_OUT }} />
            <text x={48} y={py(PHOS.high) + (py(PHOS.low) - py(PHOS.high)) / 2 + 6} fontSize={17} fontWeight={800} fill="#FFFFFF" style={{ fontFamily: 'var(--font-body)' }}>21,4–29,6%</text>
            {['35', '65', '90'].map((v, i) => <SvgText key={v} x={66 + i * 62} y={BASE + 22} text={`${v}%`} size={16} anchor="middle" color="#D1D5DB" />)}
            <motion.g initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : -10 }} transition={{ duration: DUR.enter, delay: show ? 0.7 : 0, ease: EASE_OUT }}>
                <circle cx={262} cy={py(PHOS.drop)} r={10} fill={C.stone} stroke="#04080F" strokeWidth={2} />
                <SvgText x={262} y={py(PHOS.drop) - 16} text="15,3%" size={17} anchor="middle" color={C.stone} weight={800} />
                <SvgText x={262} y={BASE + 22} text="90%·10′" size={16} anchor="middle" color="#D1D5DB" />
            </motion.g>
        </motion.g>
    );
};
