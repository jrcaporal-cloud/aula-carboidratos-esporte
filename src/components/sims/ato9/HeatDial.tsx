import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { DIAL_MAX } from './heatAltitude.content';

/**
 * Mostrador de dois ponteiros do slide 166 (Jentjens 2002): violeta = glicogênio queimado, âmbar = glicose bebida oxidada,
 * na mesma escala (g/min). Ao passar de 16 °C para 35 °C, os ponteiros giram em sentidos opostos e a posição antiga
 * fica marcada por um anel na borda.
 */

const W = 270;
const H = 160;
const CX = 135;
const CY = 148;
const R = 112;
const TICKS = [0, 0.5, 1, 1.5, 2] as const;

const theta = (v: number) => Math.PI - (v / DIAL_MAX) * Math.PI;
const at = (v: number, r: number) => ({ x: CX + r * Math.cos(theta(v)), y: CY - r * Math.sin(theta(v)) });
const deg = (v: number) => -90 + (v / DIAL_MAX) * 180;

interface Needle { value: number; color: string; length: number }

interface HeatDialProps {
    glycogen: number;
    exo: number;
    /** Posições de referência (16 °C) marcadas na borda quando o ponteiro já saiu delas. */
    ghost?: { glycogen: number; exo: number };
}

export const HeatDial = ({ glycogen, exo, ghost }: HeatDialProps) => {
    const reduce = useReducedMotion() ?? false;
    const needles: readonly Needle[] = [
        { value: glycogen, color: C.glycogen, length: 104 },
        { value: exo, color: C.glucose, length: 84 },
    ];
    const start = at(0, R);
    const end = at(DIAL_MAX, R);
    return (
        <div className="relative shrink-0" style={{ width: W, height: H }} role="img"
            aria-label={`glicogênio ${br(glycogen, 2)} e glicose bebida ${br(exo, 2)} g/min`}>
            <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0" aria-hidden>
                <path d={`M${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={12} />
                {TICKS.map(t => {
                    const a = at(t, R - 10);
                    const b = at(t, R + 6);
                    const l = at(t, R + 22);
                    return (
                        <g key={t}>
                            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.co2} strokeWidth={3} />
                            <SvgText x={l.x} y={l.y + 6} text={br(t, t % 1 ? 1 : 0)} anchor={t === 0 ? 'start' : 'middle'} size={16} color={C.muted} weight={500} />
                        </g>
                    );
                })}
                {ghost && [
                    { v: ghost.glycogen, c: C.glycogenSoft },
                    { v: ghost.exo, c: C.glucoseSoft },
                ].map(g => {
                    const p = at(g.v, R);
                    return (
                        <motion.circle key={g.c} cx={p.x} cy={p.y} r={8} fill="#04080F" stroke={g.c} strokeWidth={3}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay: 0.5, ease: EASE_OUT }} />
                    );
                })}
                <SvgText x={CX + 22} y={CY + 10} text="g/min" size={16} color={C.muted} weight={500} />
            </svg>
            {needles.map(n => (
                <motion.span key={n.color} aria-hidden className="absolute block rounded-full"
                    style={{ left: CX - 3, top: CY - n.length, width: 6, height: n.length, background: n.color, transformOrigin: '50% 100%' }}
                    initial={reduce ? false : { rotate: -90 }} animate={{ rotate: deg(n.value) }}
                    transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
            ))}
            <span aria-hidden className="absolute block h-[18px] w-[18px] rounded-full" style={{ left: CX - 9, top: CY - 9, background: C.text, border: '3px solid #04080F' }} />
        </div>
    );
};
