import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { HEX } from './geometry';

/**
 * Palco do slide 23 (viewBox 640 × 456): o ciclo do glicogênio em duas pistas. Em cima, a quebra
 * (glicogênio → fosforilase → glicose-1-P → glicólise); embaixo, a síntese no sentido oposto
 * (glicose-1-P → UDP-glicose → glicogênio sintase + ramificadora → glicogênio). No passo 3 entram os
 * controles de cada pista; no 4, os dois Nobel. Cada clique faz uma glicose percorrer o trecho novo (sem laço).
 */
export const LM_W = 640;
export const LM_H = 456;

const TOP = 104;
const BOT = 330;
const G1P = { x: 450, y: 214 };
const UDP = { x: 450, y: BOT };
const GLY = { x: 78, y: 218 };

const TOP_LANE = `M 112 178 C 128 ${TOP}, 160 ${TOP}, 200 ${TOP} L 404 ${TOP} C 440 ${TOP}, ${G1P.x} 130, ${G1P.x} ${G1P.y - 24}`;
const BOT_LANE = `M ${UDP.x - 72} ${BOT} L 200 ${BOT} C 156 ${BOT}, 128 312, 112 262`;
const UDP_LINK = `M ${G1P.x} ${G1P.y + 20} L ${UDP.x} ${UDP.y - 22}`;

type Pt = readonly [number, number];
const TRAVELS: readonly (readonly { pts: readonly Pt[]; back?: boolean }[])[] = [
    [{ pts: [[112, 178], [200, TOP], [404, TOP], [G1P.x, G1P.y - 24]] }, { pts: [[G1P.x, G1P.y - 24], [404, TOP], [200, TOP], [112, 178]], back: true }],
    [{ pts: [[G1P.x, G1P.y + 20], [UDP.x, UDP.y], [300, BOT], [200, BOT], [112, 262]] }],
    [{ pts: [[112, 178], [200, TOP], [404, TOP], [G1P.x, G1P.y - 24]] }],
    [],
];

const Token = ({ pts, delay }: { pts: readonly Pt[]; delay: number }) => {
    const times = pts.map((_, i) => i / (pts.length - 1));
    return (
        <motion.g initial={{ x: pts[0][0], y: pts[0][1], opacity: 0 }}
            animate={{ x: pts.map(p => p[0]), y: pts.map(p => p[1]), opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.1, delay, ease: EASE_IN_OUT, times, opacity: { duration: 1.1, delay, times: [0, 0.1, 0.85, 1] } }}>
            <polygon points={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={4} transform="scale(0.55)" />
        </motion.g>
    );
};

const Show = ({ on, now, delay = 0.3, children }: { on: boolean; now: boolean; delay?: number; children: ReactNode }) => (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, delay: on && now ? delay : 0, ease: EASE_OUT }}>
        {children}
    </motion.g>
);

const Pill = ({ x, y, w, label, color, solid = false }: { x: number; y: number; w: number; label: string; color: string; solid?: boolean }) => (
    <g>
        <rect x={x - w / 2} y={y - 17} width={w} height={34} rx={17} fill={solid ? color : `${color}2E`} stroke={color} strokeWidth={solid ? 0 : 2.5} />
        {solid
            ? <text x={x} y={y + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>{label}</text>
            : <SvgText x={x} y={y + 6} text={label} size={17} anchor="middle" color="#F9FAFB" weight={700} />}
    </g>
);

/** Seta de efeito: + (verde, ponta) ou − (vermelho, barra chata). */
const Effect = ({ d, sign }: { d: string; sign: '+' | '-' }) => (
    <path d={d} fill="none" stroke={sign === '+' ? C.ok : C.risk} strokeWidth={3.5} strokeLinecap="round"
        markerEnd={`url(#leloir-${sign === '+' ? 'act' : 'inh'})`} />
);

const Defs = () => (
    <defs>
        {[{ id: 'brk', color: C.glucose }, { id: 'syn', color: C.glycogen }, { id: 'act', color: C.ok }].map(m => (
            <marker key={m.id} id={`leloir-${m.id}`} viewBox="0 0 10 10" refX={6} refY={5} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 Z" fill={m.color} />
            </marker>
        ))}
        <marker id="leloir-inh" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={4} markerHeight={4} orient="auto">
            <rect x={3} y={0} width={4} height={10} fill={C.risk} />
        </marker>
    </defs>
);

const Granule = () => (
    <g>
        <circle cx={GLY.x} cy={GLY.y} r={54} fill={`${C.glycogen}38`} stroke={C.glycogen} strokeWidth={3} />
        {[-1, 0, 1, 2, 3, 4, 5].map(i => {
            const a = ((i * 60 + 30) * Math.PI) / 180;
            const r = i < 0 ? 0 : 28;
            return <polygon key={i} points={HEX} fill={C.glycogen} transform={`translate(${GLY.x + Math.cos(a) * r} ${GLY.y + Math.sin(a) * r}) scale(0.48)`} />;
        })}
        <SvgText x={GLY.x} y={GLY.y + 78} text="glicogênio" size={18} anchor="middle" color={C.glycogenSoft} weight={800} />
    </g>
);

export const LeloirMap = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const draw = (on: boolean, now: boolean, delay = 0.1) => ({
        initial: false as const,
        animate: { pathLength: on ? 1 : 0, opacity: on ? 1 : 0 },
        transition: { duration: reduce ? 0 : DUR.bar, delay: on && now ? delay : 0, ease: EASE_OUT },
    });
    return (
        <svg viewBox={`0 0 ${LM_W} ${LM_H}`} width={LM_W} height={LM_H} className="block" role="img"
            aria-label="Ciclo do glicogênio: a fosforilase quebra, a glicogênio sintase constrói a partir de UDP-glicose, com controles opostos">
            <Defs />
            <Granule />
            {/* pista da quebra: no passo 1 é mão dupla (in vitro) */}
            <path d={TOP_LANE} fill="none" stroke={C.glucose} strokeWidth={6} strokeLinecap="round" markerEnd="url(#leloir-brk)" />
            <motion.path d="M 116 160 L 111 182" fill="none" stroke={C.glucose} strokeWidth={6} markerEnd="url(#leloir-brk)" initial={false}
                animate={{ opacity: step === 0 ? 1 : 0 }} transition={{ duration: DUR.enter }} />
            <Pill x={300} y={TOP} w={150} label="fosforilase" color={C.glucose} solid />
            <Pill x={G1P.x} y={G1P.y} w={150} label="glicose-1-P" color={C.glucose} />
            <path d={`M ${G1P.x + 78} ${G1P.y} L ${G1P.x + 104} ${G1P.y}`} stroke={C.glucoseSoft} strokeWidth={3} markerEnd="url(#leloir-brk)" />
            <SvgText x={G1P.x + 110} y={G1P.y + 6} text="glicólise" size={16} color={C.glucoseSoft} />
            <SvgText x={G1P.x + 78} y={G1P.y + 34} text="(via glicose-6-P)" size={16} anchor="middle" color={C.muted} />

            <Show on={step === 0} now={step === 0} delay={0.6}>
                <SvgText x={256} y={160} text="1939, no tubo:" size={18} anchor="middle" color="#E5E7EB" weight={700} />
                <SvgText x={256} y={184} text="a fosforilase também" size={18} anchor="middle" color="#E5E7EB" />
                <SvgText x={256} y={208} text="monta polissacarídeo" size={18} anchor="middle" color="#E5E7EB" />
                <SvgText x={290} y={BOT + 6} text="síntese = a mesma rua, ao contrário?" size={20} anchor="middle" color={C.muted} weight={700} />
            </Show>

            {/* pista da síntese */}
            <motion.path d={UDP_LINK} fill="none" stroke={C.glycogen} strokeWidth={5} markerEnd="url(#leloir-syn)" {...draw(step >= 1, step === 1, 0.1)} />
            <motion.path d={BOT_LANE} fill="none" stroke={C.glycogen} strokeWidth={6} strokeLinecap="round" markerEnd="url(#leloir-syn)" {...draw(step >= 1, step === 1, 0.45)} />
            <Show on={step >= 1} now={step === 1} delay={0.35}>
                <SvgText x={G1P.x - 12} y={262} text="UDP-glicose" size={16} anchor="end" color="#E5E7EB" />
                <SvgText x={G1P.x - 12} y={284} text="pirofosforilase" size={16} anchor="end" color="#E5E7EB" />
                <SvgText x={G1P.x + 12} y={274} text="← UTP" size={16} color={C.glucoseSoft} weight={700} />
                <Pill x={UDP.x} y={UDP.y} w={140} label="UDP-glicose" color={C.glucose} />
                <SvgText x={UDP.x} y={UDP.y + 38} text="glicose ativada" size={16} anchor="middle" color={C.muted} />
                <Pill x={290} y={BOT} w={186} label="glicogênio sintase" color={C.glycogen} solid />
                <SvgText x={290} y={BOT - 28} text="+ enzima ramificadora (α-1,6)" size={16} anchor="middle" color={C.glycogenSoft} weight={700} />
            </Show>
            <Show on={step === 1} now={step === 1} delay={0.7}>
                <SvgText x={270} y={192} text="no corpo: duas enzimas," size={18} anchor="middle" color="#E5E7EB" />
                <SvgText x={270} y={216} text="dois sentidos" size={18} anchor="middle" color="#E5E7EB" />
            </Show>

            {/* controles */}
            <Show on={step >= 2} now={step === 2} delay={0.3}>
                <SvgText x={300} y={32} text="Ca²⁺ (contração) → calmodulina → fosforilase quinase" size={16} anchor="middle" color="#E5E7EB" weight={700} />
                <Effect d={`M 300 42 L 300 ${TOP - 22}`} sign="+" />
                <SvgText x={386} y={70} text="AMP · Pi" size={16} color={C.ok} weight={700} />
                <Effect d={`M 382 66 L 366 ${TOP - 20}`} sign="+" />
                <SvgText x={150} y={404} text="+ insulina" size={16} anchor="middle" color={C.ok} weight={700} />
                <SvgText x={150} y={428} text="+ glicose-6-P" size={16} anchor="middle" color={C.ok} weight={700} />
                <Effect d={`M 214 396 L 244 ${BOT + 21}`} sign="+" />
                <SvgText x={430} y={404} text="− glicogênio cheio" size={16} anchor="middle" color={C.risk} weight={700} />
                <SvgText x={430} y={428} text="− fosforilação" size={16} anchor="middle" color={C.risk} weight={700} />
                <Effect d={`M 360 396 L 334 ${BOT + 22}`} sign="-" />
            </Show>
            <Show on={step >= 3} now={step === 3} delay={0.3}>
                {[{ x: 196, year: '1947', who: 'Cori', what: 'a quebra', color: C.glucose, soft: C.glucoseSoft },
                    { x: 316, year: '1970', who: 'Leloir', what: 'a síntese', color: C.glycogenSoft, soft: C.glycogenSoft }].map(m => (
                    <g key={m.year}>
                        <circle cx={m.x} cy={168} r={32} fill="#04080F" stroke={m.color} strokeWidth={4} />
                        <SvgText x={m.x} y={174} text={m.year} size={18} anchor="middle" color={m.soft} weight={800} />
                        <SvgText x={m.x} y={222} text={m.who} size={17} anchor="middle" color="#F9FAFB" weight={700} />
                        <SvgText x={m.x} y={242} text={m.what} size={16} anchor="middle" color={C.muted} />
                    </g>
                ))}
                <SvgText x={256} y={174} text="Nobel" size={16} anchor="middle" color={C.muted} weight={700} />
            </Show>
            {!reduce && <g key={`travel-${step}`}>{TRAVELS[step].map((t, i) => <Token key={i} pts={t.pts} delay={t.back ? 0.15 : 0.1} />)}</g>}
        </svg>
    );
};
