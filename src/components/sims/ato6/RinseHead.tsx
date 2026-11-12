import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Corte sagital esquemático (slide 110): cabeça de perfil, cérebro, tronco encefálico e cerebelo. O sinal sai dos
 * receptores da língua, desce ao tronco e sobe à ínsula; dali acendem orbitofrontal, estriado e cingulado anterior
 * (Chambers 2009). As regiões são numeradas (a legenda fica em HTML). viewBox 330 × 232.
 */

export const HEAD_W = 330;
export const HEAD_H = 232;

const HEAD = 'M 96 232 C 92 202, 70 186, 58 160 C 30 110, 50 40, 120 22 C 190 4, 262 30, 278 80 C 284 100, 282 112, 290 122 L 306 146 L 290 152 L 293 165 L 284 171 L 292 180 C 290 196, 276 202, 262 200 C 240 200, 226 206, 222 232';
const BRAIN = 'M 78 128 C 60 80, 100 40, 160 38 C 220 36, 266 70, 262 108 C 258 128, 236 136, 210 132 C 190 150, 150 150, 130 140 C 110 146, 86 144, 78 128 Z';
const STEM = 'M 142 140 C 144 170, 148 196, 152 232 L 172 232 C 168 196, 166 168, 170 140 Z';
const CALLOSUM = 'M 126 104 C 150 76, 210 72, 230 98';
const ACC = 'M 196 80 C 214 78, 232 86, 242 100';
const TONGUE = 'M 236 186 C 248 170, 270 166, 284 172';
/** Do receptor na língua ao tronco e à ínsula. */
const NERVE = 'M 262 172 C 224 190, 190 196, 168 186 L 160 156 C 166 140, 180 132, 196 128';
const NERVE_PTS: readonly (readonly [number, number])[] = [[262, 172], [214, 190], [168, 186], [160, 156], [196, 128]];

interface RegionSpec { n: number; cx: number; cy: number; rx: number; ry: number; lx: number; ly: number }

const REGION_SHAPES: readonly RegionSpec[] = [
    { n: 1, cx: 200, cy: 124, rx: 16, ry: 10, lx: 196, ly: 154 },
    { n: 2, cx: 240, cy: 120, rx: 20, ry: 9, lx: 266, ly: 140 },
    { n: 3, cx: 172, cy: 104, rx: 18, ry: 11, lx: 142, ly: 90 },
];

const Badge = ({ n, x, y }: { n: number; x: number; y: number }) => (
    <g>
        <circle cx={x} cy={y} r={11} fill="#F9FAFB" stroke="#04080F" strokeWidth={2} />
        <text x={x} y={y + 5.5} textAnchor="middle" fontSize={16} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>{n}</text>
    </g>
);

const SignalLoop = () => (
    <g>
        {[0, 0.8].map(d => (
            <motion.circle key={d} r={6} fill={C.glucose} stroke="#04080F" strokeWidth={2}
                initial={{ x: NERVE_PTS[0][0], y: NERVE_PTS[0][1], opacity: 0 }}
                animate={{ x: NERVE_PTS.map(p => p[0]), y: NERVE_PTS.map(p => p[1]), opacity: [0, 1, 1, 1, 0] }}
                transition={{ delay: 1.2 + d, duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: 'linear' }} />
        ))}
    </g>
);

export const RinseHead = ({ live }: { live: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const light = (i: number) => ({ delay: reduce ? 0 : 0.7 + i * 0.12, duration: DUR.morph, ease: EASE_OUT });
    return (
        <svg viewBox={`0 0 ${HEAD_W} ${HEAD_H}`} width={HEAD_W} height={HEAD_H} role="img"
            aria-label="Corte sagital esquemático: o sinal vai da língua ao tronco encefálico e à ínsula, e acende orbitofrontal, estriado e cingulado">
            <path d={HEAD} fill="#0F172A" stroke="#94A3B8" strokeWidth={3} strokeLinejoin="round" />
            <ellipse cx={110} cy={152} rx={28} ry={16} fill="#1E293B" stroke="#64748B" strokeWidth={2} />
            <path d={STEM} fill="#1E293B" stroke="#64748B" strokeWidth={2} />
            <path d={BRAIN} fill="#1E293B" stroke="#94A3B8" strokeWidth={2.5} />
            <path d={CALLOSUM} fill="none" stroke="#64748B" strokeWidth={6} strokeLinecap="round" />
            <path d={TONGUE} fill="none" stroke={C.fructoseSoft} strokeWidth={10} strokeLinecap="round" />
            <motion.path d={NERVE} fill="none" stroke={C.glucoseSoft} strokeWidth={4} strokeDasharray="1 0"
                initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: live ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : DUR.draw, delay: 0.1, ease: EASE_IN_OUT }} />
            <motion.path d={ACC} fill="none" stroke={C.glucose} strokeWidth={12} strokeLinecap="round"
                initial={reduce ? false : { opacity: 0.25 }} animate={{ opacity: live ? 1 : 0.25 }} transition={light(3)} />
            {REGION_SHAPES.map((r, i) => (
                <motion.ellipse key={r.n} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} fill={C.glucose} stroke="#04080F" strokeWidth={2}
                    initial={reduce ? false : { opacity: 0.25 }} animate={{ opacity: live ? 1 : 0.25 }} transition={light(i)} />
            ))}
            {[268, 278].map(x => <circle key={x} cx={x} cy={170} r={5} fill={C.glucose} stroke="#04080F" strokeWidth={1.5} />)}
            {REGION_SHAPES.map(r => <Badge key={r.n} n={r.n} x={r.lx} y={r.ly} />)}
            <Badge n={4} x={222} y={66} />
            <SvgText x={180} y={224} text="tronco" size={16} color={C.caveat} />
            {live && !reduce && <SignalLoop />}
        </svg>
    );
};
