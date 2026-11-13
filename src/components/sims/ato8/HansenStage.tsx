import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { LEG_LEVELS } from './hansen.content';

/**
 * Palco do slide 140, um SVG 1:1 (676 × 436). À esquerda, em cima, o calendário de 4 dias do protocolo; embaixo, as
 * duas pernas do mesmo voluntário (a coxa é o tanque). À direita, a cascata do sinal: glicogênio baixo → AMPK e p38
 * → p53 e PGC-1α → mitocôndria. Tudo entra no passo `at` e fica; no clique, o sinal desce uma vez (≤ 1,2 s).
 */

const W = 676;
const H = 436;
const TRAVEL = 1.15;

type Pt = readonly [number, number];

/* ---------- calendário ---------- */
const CELL_X = (d: number) => 92 + d * 64;
const CELL_W = 56;

const Block = ({ x, y, hollow }: { x: number; y: number; hollow: boolean }) => (
    <g>
        <rect x={x} y={y} width={CELL_W} height={24} rx={6} fill={hollow ? '#04080F' : C.glycogen}
            stroke={C.glycogen} strokeWidth={3} strokeDasharray={hollow ? '6 4' : undefined} />
        <SvgText x={x + CELL_W / 2} y={y + 18} text="1 h" size={16} anchor="middle" color={hollow ? C.glycogenSoft : '#FFFFFF'} weight={700} />
    </g>
);

const Calendar = () => (
    <g>
        {[0, 1, 2, 3].map(d => <SvgText key={d} x={CELL_X(d) + CELL_W / 2} y={20} text={`dia ${d + 1}`} size={16} anchor="middle" color={C.muted} />)}
        <SvgText x={12} y={72} text="LOW" size={20} color="#FFFFFF" weight={800} />
        <SvgText x={12} y={134} text="HIGH" size={20} color="#D1D5DB" weight={800} />
        {[0, 1, 2, 3].map(d => (
            <g key={d}>
                <rect x={CELL_X(d) - 4} y={30} width={CELL_W + 8} height={70} rx={10} fill="rgba(255,255,255,0.04)" />
                <rect x={CELL_X(d) - 4} y={108} width={CELL_W + 8} height={42} rx={10} fill="rgba(255,255,255,0.04)" />
                {d % 2 === 0 && <><Block x={CELL_X(d)} y={36} hollow={false} /><Block x={CELL_X(d)} y={70} hollow /></>}
                <Block x={CELL_X(d)} y={117} hollow={false} />
            </g>
        ))}
        <rect x={12} y={166} width={22} height={16} rx={4} fill="#04080F" stroke={C.glycogen} strokeWidth={3} strokeDasharray="6 4" />
        <SvgText x={42} y={180} text="2ª sessão: 2 h depois, em jejum" size={16} color={C.glycogenSoft} weight={600} />
        <SvgText x={12} y={204} text="mesma carga total · 10 semanas" size={16} color="#D1D5DB" weight={600} />
    </g>
);

/* ---------- pernas ---------- */
const Leg = ({ x, level, label, focus }: { x: number; level: number; label: string; focus: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <g>
            <rect x={x} y={232} width={82} height={168} rx={36} fill="#1E293B" stroke={focus ? C.stone : '#475569'} strokeWidth={3} />
            <rect x={x + 9} y={248} width={64} height={96} rx={26} fill="rgba(255,255,255,0.06)" />
            <clipPath id={`hansen-coxa-${label}`}><rect x={x + 9} y={248} width={64} height={96} rx={26} /></clipPath>
            <g clipPath={`url(#hansen-coxa-${label})`}>
                <motion.rect x={x + 9} y={248} width={64} height={96} fill={C.glycogen}
                    style={{ originX: 0.5, originY: 1 }}
                    initial={false} animate={{ scaleY: level }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }} />
            </g>
            <line x1={x + 18} x2={x + 64} y1={362} y2={362} stroke="#475569" strokeWidth={3} strokeLinecap="round" />
            <rect x={x - 4} y={396} width={90} height={14} rx={7} fill="#334155" />
            <SvgText x={x + 41} y={432} text={label} anchor="middle" size={20} weight={800} color={focus ? '#FFFFFF' : '#D1D5DB'} />
        </g>
    );
};

const Legs = ({ step }: { step: number }) => {
    const [high, low] = LEG_LEVELS[step];
    return (
        <g>
            <rect x={70} y={220} width={226} height={30} rx={14} fill="#334155" />
            <Leg x={80} level={high} label="HIGH" focus={false} />
            <Leg x={204} level={low} label="LOW" focus={step >= 1} />
        </g>
    );
};

/* ---------- cascata ---------- */
interface Node { x: number; y: number; w: number; h: number; title: string; lines: readonly string[]; color: string; at: number }

const CX = 394;
const NODES: readonly Node[] = [
    { x: CX, y: 6, w: 282, h: 56, title: 'glicogênio baixo · Bartlett', lines: ['LOW 103 · HIGH 467 mmol/kg ps'], color: C.glycogen, at: 1 },
    { x: CX, y: 98, w: 136, h: 90, title: 'AMPK ↑', lines: ['p-ACC', 'LOW 2,9', 'HIGH 1,4'], color: C.insulin, at: 1 },
    { x: CX + 146, y: 98, w: 136, h: 90, title: 'p38 MAPK ↑', lines: ['jejum', 'noturno'], color: C.insulin, at: 1 },
    { x: CX, y: 210, w: 136, h: 90, title: 'p53 ↑', lines: ['p-Ser15', 'LOW 2,6', 'HIGH 0,9'], color: C.insulin, at: 1 },
    { x: CX + 146, y: 210, w: 136, h: 90, title: 'PGC-1α', lines: ['mRNA ~3×', 'com ou sem CHO'], color: C.insulin, at: 1 },
    { x: CX, y: 322, w: 282, h: 56, title: 'mitocôndria · enzimas', lines: ['HAD só na LOW · CS mais na LOW'], color: C.ok, at: 2 },
];

const ARROWS: readonly { d: string; at: number }[] = [
    { d: `M ${CX + 68} 64 L ${CX + 68} 92`, at: 1 },
    { d: `M ${CX + 214} 64 L ${CX + 214} 92`, at: 1 },
    { d: `M ${CX + 68} 190 L ${CX + 68} 204`, at: 1 },
    { d: `M ${CX + 120} 190 L ${CX + 156} 204`, at: 1 },
    { d: `M ${CX + 214} 190 L ${CX + 214} 204`, at: 1 },
    { d: `M ${CX + 68} 302 L ${CX + 68} 316`, at: 2 },
    { d: `M ${CX + 214} 302 L ${CX + 214} 316`, at: 2 },
];

/** Da coxa LOW até o topo da cascata. */
const LINK = `M 288 296 C 352 296, 352 34, ${CX - 6} 34`;

const NodeView = ({ n, step }: { n: Node; step: number }) => {
    const shown = step >= n.at;
    const current = step === n.at;
    /** No passo 4, o PGC-1α ganha a borda da ressalva: subiu com ou sem carboidrato. */
    const caveat = n.title === 'PGC-1α' && step >= 3;
    return (
        <motion.g initial={false} animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: DUR.enter, delay: shown && current ? 0.3 : 0, ease: EASE_OUT }}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={12} fill={`${n.color}24`} stroke={caveat ? C.stone : n.color} strokeWidth={current || caveat ? 4 : 2} />
            <SvgText x={n.x + n.w / 2} y={n.y + 23} text={n.title} size={18} anchor="middle" color="#FFFFFF" weight={800} />
            {n.lines.map((l, i) => <SvgText key={l} x={n.x + n.w / 2} y={n.y + 43 + i * 19} text={l} size={16} anchor="middle" color="#E5E7EB" weight={600} />)}
        </motion.g>
    );
};

const Token = ({ pts, color }: { pts: readonly Pt[]; color: string }) => (
    <motion.circle r={8} cx={0} cy={0} fill={color} stroke="#04080F" strokeWidth={2}
        initial={{ x: pts[0][0], y: pts[0][1], opacity: 0 }}
        animate={{ x: pts.map(p => p[0]), y: pts.map(p => p[1]), opacity: [0, 1, 1, 0] }}
        transition={{ duration: TRAVEL, ease: EASE_IN_OUT, opacity: { duration: TRAVEL, times: [0, 0.1, 0.85, 1] } }} />
);

const TRAVELS: readonly (readonly { pts: readonly Pt[]; color: string }[])[] = [
    [],
    [
        { pts: [[288, 296], [346, 220], [352, 80], [CX + 20, 34]], color: C.glycogen },
        { pts: [[CX + 68, 60], [CX + 68, 136], [CX + 68, 200], [CX + 68, 248]], color: C.insulin },
        { pts: [[CX + 214, 60], [CX + 214, 136], [CX + 214, 200], [CX + 214, 248]], color: C.insulin },
    ],
    [
        { pts: [[CX + 68, 302], [CX + 100, 312], [CX + 141, 350], [CX + 141, 352]], color: C.ok },
        { pts: [[CX + 214, 302], [CX + 180, 312], [CX + 141, 350], [CX + 141, 352]], color: C.ok },
    ],
    [],
];

export const HansenStage = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" role="img"
            aria-label="Protocolo de Hansen 2005 (perna LOW e perna HIGH) e a cascata do sinal: glicogênio baixo, AMPK, p38, p53, PGC-1α, mitocôndria">
            <defs>
                <marker id="hansen-head" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill={C.insulinSoft} />
                </marker>
            </defs>
            <Calendar />
            <Legs step={step} />
            <motion.path d={LINK} fill="none" stroke={C.glycogen} strokeWidth={4} strokeDasharray="10 7" strokeLinecap="round"
                initial={false} animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }} />
            {ARROWS.map(a => (
                <motion.path key={a.d} d={a.d} fill="none" stroke={C.insulinSoft} strokeWidth={3} markerEnd="url(#hansen-head)"
                    initial={false} animate={{ pathLength: step >= a.at ? 1 : 0, opacity: step >= a.at ? 1 : 0 }}
                    transition={{ duration: reduce ? 0 : DUR.bar, delay: step === a.at ? 0.45 : 0, ease: EASE_OUT }} />
            ))}
            {NODES.map(n => <NodeView key={n.title} n={n} step={step} />)}
            <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.7 : 0 }}>
                <SvgText x={CX + 141} y={406} text="Bartlett n = 8 · MacDonald n = 8" size={16} anchor="middle" color={C.muted} weight={600} />
                <SvgText x={CX + 141} y={428} text="Lane n = 7 · McBride in vitro" size={16} anchor="middle" color={C.muted} weight={600} />
            </motion.g>
            {!reduce && <g key={`hansen-travel-${step}`}>{TRAVELS[step].map((t, i) => <Token key={i} {...t} />)}</g>}
        </svg>
    );
};
