import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Slide 46 · a cadeia respiratória na membrana interna da mitocôndria (660 × 244 de projeto, 1:1).
 * Duas portas de entrada dos elétrons: NADH → complexo I (bombeia H⁺) e FADH₂ → Q (pula o complexo I).
 * H⁺ bombeado em I, III e IV; volta pela ATP-sintase. O O₂ é o aceptor final no complexo IV.
 * No 1º passo, um par de elétrons de cada porta percorre a cadeia uma vez (≤ 1,2 s); depois fica a pose.
 */

export const CHAIN_W = 660;
export const CHAIN_H = 244;
const TOP = 82;
const BOT = 132;
const MID = (TOP + BOT) / 2;
const MEMB = '#334155';
const PROT = '#1E293B';
const TRAVEL = 1.15;

interface Cx { id: string; label: string; x: number; w: number; y: number; h: number; pump: boolean }

const COMPLEXES: readonly Cx[] = [
    { id: 'I', label: 'I', x: 40, w: 78, y: TOP - 16, h: BOT - TOP + 32, pump: true },
    { id: 'II', label: 'II', x: 150, w: 58, y: MID - 4, h: BOT - MID + 26, pump: false },
    { id: 'III', label: 'III', x: 276, w: 78, y: TOP - 16, h: BOT - TOP + 32, pump: true },
    { id: 'IV', label: 'IV', x: 418, w: 78, y: TOP - 16, h: BOT - TOP + 32, pump: true },
];
const Q = { x: 240, y: MID };
const CYT = { x: 386, y: TOP - 4 };
const SYN = { x: 588 };

type Pt = readonly [number, number];
const NADH_PATH: readonly Pt[] = [[79, 196], [79, MID], [Q.x, Q.y], [315, MID], [CYT.x, CYT.y], [457, MID], [457, 190]];
const FADH_PATH: readonly Pt[] = [[179, 196], [179, MID + 8], [Q.x, Q.y], [315, MID], [CYT.x, CYT.y], [457, MID], [457, 190]];

const Electron = ({ pts, color, delay }: { pts: readonly Pt[]; color: string; delay: number }) => (
    <motion.circle r={9} fill={color} stroke="#04080F" strokeWidth={2}
        initial={{ x: pts[0][0], y: pts[0][1], opacity: 0 }}
        animate={{ x: pts.map(p => p[0]), y: pts.map(p => p[1]), opacity: [0, 1, 1, 1, 1, 1, 0] }}
        transition={{ duration: TRAVEL, delay, ease: EASE_IN_OUT, times: pts.map((_, i) => i / (pts.length - 1)) }} />
);

const Pump = ({ x, delay, reduce }: { x: number; delay: number; reduce: boolean }) => (
    <g>
        <motion.path d={`M ${x} ${TOP - 18} L ${x} ${TOP - 44}`} stroke={C.stone} strokeWidth={4} fill="none" markerEnd="url(#oxy-head)"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduce ? 0 : DUR.bar, delay: reduce ? 0 : delay, ease: EASE_OUT }} />
        <SvgText x={x + 10} y={TOP - 26} text="H⁺" size={18} color={C.stone} weight={800} />
    </g>
);

const Door = ({ x, carrier, po, color, emphasis }: { x: number; carrier: string; po: string; color: string; emphasis: boolean }) => (
    <g>
        <path d={`M ${x} 184 L ${x} ${BOT + 22}`} stroke={color} strokeWidth={4} fill="none" markerEnd="url(#oxy-head-door)" />
        <SvgText x={x} y={204} text={carrier} size={18} anchor="middle" color={color} weight={800} />
        <SvgText x={x} y={230} text={po} size={emphasis ? 20 : 18} anchor="middle" color="#FFFFFF" weight={800} />
    </g>
);

export const OxygenChain = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const e = 'M 118 107 L 224 107 M 256 107 L 276 107 M 354 96 L 374 82 M 398 82 L 418 96';
    return (
        <svg viewBox={`0 0 ${CHAIN_W} ${CHAIN_H}`} className="block h-auto w-full" role="img"
            aria-label="Cadeia respiratória: NADH entra no complexo I, FADH₂ entra na ubiquinona; H⁺ bombeado em I, III e IV; O₂ recebe os elétrons no complexo IV">
            <defs>
                <marker id="oxy-head" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill={C.stone} />
                </marker>
                <marker id="oxy-head-door" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={3.6} markerHeight={3.6} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill="#E5E7EB" />
                </marker>
            </defs>
            <SvgText x={4} y={20} text="espaço intermembranas · H⁺ acumula" size={16} color={C.muted} weight={700} />
            <SvgText x={656} y={20} text="ATP-sintase" size={16} anchor="end" color={C.muted} weight={700} />

            {/* membrana interna */}
            <rect x={0} y={TOP} width={CHAIN_W} height={BOT - TOP} fill={MEMB} />
            {/* trilha dos elétrons */}
            <path d={e} stroke={C.caveat} strokeWidth={3} strokeDasharray="6 5" fill="none" />
            <SvgText x={200} y={100} text="e⁻" size={16} anchor="middle" color={C.caveat} weight={700} />

            {COMPLEXES.map(c => (
                <g key={c.id}>
                    <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={14} fill={PROT} stroke={c.pump ? C.stone : C.co2} strokeWidth={3} />
                    <SvgText x={c.x + c.w / 2} y={c.id === 'II' ? c.y + 30 : MID + 7} text={c.label} size={20} anchor="middle" color="#FFFFFF" weight={800} />
                </g>
            ))}
            <circle cx={Q.x} cy={Q.y} r={17} fill="#04080F" stroke={C.caveat} strokeWidth={3} />
            <SvgText x={Q.x} y={Q.y + 6} text="Q" size={18} anchor="middle" color="#FFFFFF" weight={800} />
            <circle cx={CYT.x} cy={CYT.y} r={14} fill="#04080F" stroke={C.caveat} strokeWidth={3} />
            <SvgText x={CYT.x} y={CYT.y + 6} text="c" size={17} anchor="middle" color="#FFFFFF" weight={800} />

            {/* ATP-sintase: o H⁺ volta e gira o rotor */}
            <rect x={SYN.x - 18} y={TOP - 8} width={36} height={BOT - TOP + 16} rx={8} fill={PROT} stroke={C.stone} strokeWidth={3} />
            <circle cx={SYN.x} cy={BOT + 30} r={24} fill={PROT} stroke={C.stone} strokeWidth={3} />
            <path d={`M ${SYN.x} ${TOP - 44} L ${SYN.x} ${TOP - 14}`} stroke={C.stone} strokeWidth={4} fill="none" markerEnd="url(#oxy-head)" />
            <SvgText x={SYN.x - 10} y={TOP - 26} text="H⁺" size={18} anchor="end" color={C.stone} weight={800} />
            <SvgText x={SYN.x} y={BOT + 36} text="ATP" size={16} anchor="middle" color={C.glucoseSoft} weight={800} />
            <SvgText x={SYN.x} y={230} text="ADP + Pi → ATP" size={16} anchor="middle" color="#E5E7EB" weight={700} />

            {/* bombas: I, III e IV (o II não bombeia) */}
            {[79, 315, 457].map((x, i) => <Pump key={x} x={x} delay={0.3 + i * 0.15} reduce={reduce} />)}

            {/* as duas portas e o aceptor final */}
            <Door x={79} carrier="NADH" po="P/O ≈ 2,5" color="#FFFFFF" emphasis={step === 0} />
            <Door x={179} carrier="FADH₂" po="P/O ≈ 1,5" color={C.co2} emphasis={step === 0} />
            <path d={`M 457 ${BOT + 18} L 457 180`} stroke={C.lactateSoft} strokeWidth={4} fill="none" markerEnd="url(#oxy-head-door)" />
            <SvgText x={457} y={204} text="½ O₂ → H₂O" size={18} anchor="middle" color="#FFFFFF" weight={800} />
            <SvgText x={457} y={230} text="aceptor final" size={16} anchor="middle" color={C.muted} weight={600} />
            <SvgText x={4} y={BOT + 56} text="matriz" size={16} color={C.muted} weight={700} />

            {/* o II pula o bombeamento do I: marca */}
            <SvgText x={179} y={TOP - 26} text="sem bomba" size={16} anchor="middle" color={C.co2} weight={700} />

            {step === 0 && !reduce && (
                <g>
                    <Electron pts={NADH_PATH} color="#FFFFFF" delay={0.1} />
                    <Electron pts={FADH_PATH} color={C.co2} delay={0.25} />
                </g>
            )}
        </svg>
    );
};
