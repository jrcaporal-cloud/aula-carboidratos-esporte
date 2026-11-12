import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Slide 67 · Coyle 1986 em régua de tempo: placebo 3,02 h × carboidrato 4,02 h (barras que crescem da esquerda) e,
 * embaixo, o glicogênio usado por hora (51,5 → 23 → ~5 mmol/kg/h), igual nos dois tratamentos nas 3 primeiras horas.
 */

export const COYLE_W = 640;
export const COYLE_H = 190;

const X0 = 118;
const PX_H = 108;
const xOf = (h: number) => X0 + h * PX_H;

const Row = ({ y, h, color, label, labelColor, show, delay, children }: {
    y: number; h: number; color: string; label: string; labelColor: string; show: boolean; delay: number; children?: ReactNode;
}) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <SvgText x={X0 - 10} y={y + 21} text={label} size={17} anchor="end" color={labelColor} weight={800} />
            <motion.rect x={X0} y={y} width={xOf(h) - X0} height={30} rx={6} fill={color} style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                initial={false} animate={{ scaleX: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.draw, delay: show ? delay : 0, ease: EASE_OUT }} />
            <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, delay: show ? delay + 0.7 : 0 }}>{children}</motion.g>
        </motion.g>
    );
};

/** Glicogênio usado por hora: altura proporcional à taxa. */
const USE = [
    { h0: 0, h1: 2, rate: 51.5, text: '51,5 · igual nos dois' },
    { h0: 2, h1: 3, rate: 23, text: '23 · igual' },
    { h0: 3, h1: 4, rate: 5, text: '~5 (NS)' },
] as const;

export const CoyleTimeline = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const use = step >= 2;
    return (
        <svg viewBox={`0 0 ${COYLE_W} ${COYLE_H}`} width={COYLE_W} height={COYLE_H} className="block" role="img"
            aria-label="Coyle 1986: tempo até a fadiga com placebo e com carboidrato, e glicogênio usado por hora">
            <SvgText x={X0} y={18} text="Coyle 1986 · tempo até a fadiga a 71% do VO₂máx" size={16} color={C.caveat} weight={700} />
            <Row y={30} h={3.02} color={C.co2} label="placebo" labelColor={C.caveat} show={step >= 1} delay={0.1}>
                <SvgText x={xOf(3.02) + 10} y={51} text="3,02 h · glicose 2,5 mM" size={17} color={C.risk} weight={800} />
            </Row>
            <Row y={70} h={4.02} color={C.glucose} label="carboidrato" labelColor={C.glucoseSoft} show={use} delay={0.1}>
                <text x={xOf(4.02) - 10} y={91} textAnchor="end" fontSize={17} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>4,02 h · glicose 4,2–5,2 mM</text>
            </Row>
            <motion.g initial={false} animate={{ opacity: use ? 1 : 0 }} transition={{ duration: DUR.enter, delay: use ? 0.6 : 0 }}>
                <SvgText x={X0 - 10} y={134} text="glicogênio" size={16} anchor="end" color={C.glycogenSoft} weight={700} />
                <SvgText x={X0 - 10} y={152} text="mmol/kg/h" size={16} anchor="end" color={C.glycogenSoft} weight={700} />
                {USE.map((u, i) => {
                    const hpx = Math.max(4, u.rate * 0.6);
                    return (
                        <g key={u.text}>
                            <motion.rect x={xOf(u.h0) + 3} y={156 - hpx} width={xOf(u.h1) - xOf(u.h0) - 6} height={hpx} fill={C.glycogen}
                                style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }} initial={false}
                                animate={{ scaleY: use ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: use ? 0.7 + i * 0.12 : 0, ease: EASE_OUT }} />
                            <text x={(xOf(u.h0) + xOf(u.h1)) / 2} y={u.rate > 30 ? 156 - hpx + 22 : 156 - hpx - 8} textAnchor="middle" fontSize={16} fontWeight={700}
                                fill={u.rate > 30 ? '#FFFFFF' : C.glycogenSoft} style={{ fontFamily: 'var(--font-body)' }}>{u.text}</text>
                        </g>
                    );
                })}
            </motion.g>
            <line x1={X0} y1={160} x2={xOf(4.5)} y2={160} stroke={C.co2} strokeWidth={2} />
            {[0, 1, 2, 3, 4].map(h => <SvgText key={h} x={xOf(h)} y={182} text={`${h} h`} size={16} anchor="middle" color={C.muted} />)}
        </svg>
    );
};
