import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * A via da glicólise desenhada em três colunas: preparatória (1 hexose), pagamento (tudo ×2) e destino.
 * Cada peça entra no passo `at` e fica (o quadro final mostra a via inteira). A cada clique, uma molécula
 * percorre o trecho novo uma vez só (≤ 1,2 s, sem laço). Geometria em px do palco: viewBox 680 × 396.
 */

export const MAP_W = 680;
export const MAP_H = 396;
const ROW = [56, 115, 174, 233, 292, 351] as const;
const PILL_H = 32;
const TRAVEL = 1.15;

interface Node {
    id: string;
    label: string;
    cx: number;
    y: number;
    w: number;
    color: string;
    at: number;
}

const COL1 = 140;
const COL2 = 430;

const NODES: readonly Node[] = [
    { id: 'glc', label: 'glicose', cx: 62, y: ROW[0], w: 104, color: C.glucose, at: 0 },
    { id: 'gly', label: 'glicogênio', cx: 218, y: ROW[0], w: 124, color: C.glycogen, at: 0 },
    { id: 'g1p', label: 'glicose-1-P', cx: 218, y: ROW[1], w: 124, color: C.glycogen, at: 0 },
    { id: 'g6p', label: 'glicose-6-P', cx: COL1, y: ROW[2], w: 140, color: C.glucose, at: 0 },
    { id: 'f6p', label: 'frutose-6-P', cx: COL1, y: ROW[3], w: 140, color: C.glucose, at: 0 },
    { id: 'fbp', label: 'frutose-1,6-bisP', cx: COL1, y: ROW[4], w: 168, color: C.glucose, at: 0 },
    { id: 'gap', label: '2 gliceraldeído-3-P', cx: COL2, y: ROW[0], w: 190, color: C.glucose, at: 1 },
    { id: 'bpg', label: '2 1,3-bisfosfoglicerato', cx: COL2, y: ROW[1], w: 200, color: C.glucose, at: 2 },
    { id: 'pg3', label: '2 3-fosfoglicerato', cx: COL2, y: ROW[2], w: 172, color: C.glucose, at: 2 },
    { id: 'pg2', label: '2 2-fosfoglicerato', cx: COL2, y: ROW[3], w: 172, color: C.glucose, at: 2 },
    { id: 'pep', label: '2 fosfoenolpiruvato', cx: COL2, y: ROW[4], w: 184, color: C.glucose, at: 2 },
    { id: 'pyr', label: '2 piruvato', cx: COL2, y: ROW[5], w: 120, color: C.glucose, at: 2 },
    { id: 'lac', label: 'lactato', cx: 616, y: ROW[3], w: 104, color: C.lactate, at: 3 },
];

type Stoich = { text: string; gain: boolean; x: number; y: number; anchor: 'start' | 'end' };

interface Edge {
    id: string;
    d: string;
    at: number;
    /** Reação irreversível (portão): seta grossa. */
    gate?: boolean;
    enzyme: { text: string; x: number; y: number; anchor?: 'start' | 'middle' | 'end' };
    stoich?: Stoich;
    color?: string;
}

/** Reta vertical entre a base de uma linha e o topo da seguinte, na coluna x. */
const down = (x: number, r: number): string => `M ${x} ${ROW[r] + PILL_H / 2 + 2} L ${x} ${ROW[r + 1] - PILL_H / 2 - 4}`;
const midGap = (r: number): number => (ROW[r] + ROW[r + 1]) / 2 + 6;

const EDGES: readonly Edge[] = [
    { id: 'hk', d: `M 62 ${ROW[0] + 18} L 104 ${ROW[2] - 20}`, at: 0, gate: true,
        enzyme: { text: 'HK', x: 72, y: 110, anchor: 'end' }, stoich: { text: '−1 ATP', gain: false, x: 72, y: 136, anchor: 'end' } },
    { id: 'phos', d: down(218, 0), at: 0, color: C.glycogen, enzyme: { text: 'fosforilase', x: 206, y: midGap(0), anchor: 'end' } },
    { id: 'pgm', d: `M 214 ${ROW[1] + 18} L 178 ${ROW[2] - 20}`, at: 0, color: C.glycogen, enzyme: { text: 'PGM', x: 214, y: 166 } },
    { id: 'pgi', d: down(COL1, 2), at: 0, enzyme: { text: 'PGI', x: COL1 + 12, y: midGap(2) } },
    { id: 'pfk', d: down(COL1, 3), at: 0, gate: true,
        enzyme: { text: 'PFK-1', x: COL1 + 12, y: midGap(3) }, stoich: { text: '−1 ATP', gain: false, x: COL1 + 64, y: midGap(3), anchor: 'start' } },
    { id: 'ald', d: `M ${COL1 + 86} ${ROW[4]} C 300 ${ROW[4]}, 296 ${ROW[0]}, ${COL2 - 99} ${ROW[0]}`, at: 1,
        enzyme: { text: 'aldolase + TPI: 1 hexose → 2 trioses', x: COL1, y: ROW[5] + 6, anchor: 'middle' } },
    { id: 'gapdh', d: down(COL2, 0), at: 2,
        enzyme: { text: 'GAPDH', x: COL2 + 12, y: midGap(0) }, stoich: { text: '+2 NADH', gain: true, x: COL2 - 12, y: midGap(0), anchor: 'end' } },
    { id: 'pgk', d: down(COL2, 1), at: 2,
        enzyme: { text: 'PGK', x: COL2 + 12, y: midGap(1) }, stoich: { text: '+2 ATP', gain: true, x: COL2 - 12, y: midGap(1), anchor: 'end' } },
    { id: 'pgam', d: down(COL2, 2), at: 2, enzyme: { text: 'PGAM', x: COL2 + 12, y: midGap(2) } },
    { id: 'eno', d: down(COL2, 3), at: 2, enzyme: { text: 'enolase', x: COL2 + 12, y: midGap(3) } },
    { id: 'pk', d: down(COL2, 4), at: 2, gate: true,
        enzyme: { text: 'PK', x: COL2 + 12, y: midGap(4) }, stoich: { text: '+2 ATP', gain: true, x: COL2 - 12, y: midGap(4), anchor: 'end' } },
    { id: 'ldh', d: `M ${COL2 + 62} ${ROW[5]} C 560 ${ROW[5]}, 600 ${ROW[4] + 10}, 604 ${ROW[3] + 20}`, at: 3, color: C.lactate,
        enzyme: { text: 'LDH', x: 584, y: ROW[4] + 4, anchor: 'start' } },
    { id: 'pdh', d: `M ${COL2 + 62} ${ROW[5]} L 548 ${ROW[5]}`, at: 3, color: C.co2,
        enzyme: { text: 'PDH', x: 520, y: ROW[5] - 12, anchor: 'middle' } },
];

/** Circuito do NAD⁺: o NADH sai da GAPDH e desce até a LDH; o NAD⁺ volta. */
const NADH_DOWN = `M ${COL2 + 70} ${ROW[0] + 24} L 648 ${ROW[0] + 24} L 648 ${ROW[3] - 22}`;
const NAD_UP = `M 588 ${ROW[3] - 22} L 588 ${ROW[0] + 40} L ${COL2 + 70} ${ROW[0] + 40}`;

/** Trajetos da molécula em cada clique (pontos por onde ela passa). */
type Pt = readonly [number, number];
const TRAVELS: readonly (readonly { pts: readonly Pt[]; color: string; shape: 'hex' | 'tri' }[])[] = [
    [
        { pts: [[62, ROW[0]], [104, ROW[2] - 14], [COL1, ROW[2]], [COL1, ROW[3]], [COL1, ROW[4]]], color: C.glucose, shape: 'hex' },
        { pts: [[218, ROW[0]], [218, ROW[1]], [178, ROW[2] - 14], [COL1, ROW[2]]], color: C.glycogen, shape: 'hex' },
    ],
    [
        { pts: [[COL1 + 86, ROW[4]], [292, ROW[3]], [298, ROW[1]], [COL2 - 99, ROW[0]]], color: C.glucose, shape: 'tri' },
        { pts: [[COL1 + 86, ROW[4] + 14], [306, ROW[3]], [312, ROW[1]], [COL2 - 99, ROW[0] + 12]], color: C.glucose, shape: 'tri' },
    ],
    [
        { pts: ROW.map(y => [COL2 - 10, y] as Pt), color: C.glucose, shape: 'tri' },
        { pts: ROW.map(y => [COL2 + 10, y] as Pt), color: C.glucose, shape: 'tri' },
    ],
    [
        { pts: [[COL2 + 62, ROW[5]], [560, ROW[5] - 8], [600, ROW[4] + 10], [616, ROW[3]]], color: C.lactate, shape: 'tri' },
        { pts: [[COL2 + 62, ROW[5]], [520, ROW[5]], [544, ROW[5]]], color: C.co2, shape: 'tri' },
    ],
];

const HEX = 'M 0 -11 L 9.5 -5.5 L 9.5 5.5 L 0 11 L -9.5 5.5 L -9.5 -5.5 Z';
const TRI = 'M 0 -10 L 9 7 L -9 7 Z';

const Token = ({ pts, color, shape }: { pts: readonly Pt[]; color: string; shape: 'hex' | 'tri' }) => {
    const times = pts.map((_, i) => i / (pts.length - 1));
    return (
        <motion.path d={shape === 'hex' ? HEX : TRI} fill={color} stroke="#04080F" strokeWidth={2}
            initial={{ x: pts[0][0], y: pts[0][1], opacity: 0 }}
            animate={{ x: pts.map(p => p[0]), y: pts.map(p => p[1]), opacity: [0, 1, 1, 0].slice(0, Math.max(2, Math.min(4, pts.length))) }}
            transition={{ duration: TRAVEL, ease: EASE_IN_OUT, times, opacity: { duration: TRAVEL, times: [0, 0.1, 0.85, 1].slice(0, Math.max(2, Math.min(4, pts.length))) } }} />
    );
};

/** Aparece no passo `at` e fica; o que é do passo atual entra depois da molécula começar a andar. */
const useShow = (at: number, step: number) => ({ shown: step >= at, current: step === at });

const Pill = ({ n, step }: { n: Node; step: number }) => {
    const { shown, current } = useShow(n.at, step);
    return (
        <motion.g initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: DUR.enter, delay: shown && current ? 0.25 : 0, ease: EASE_OUT }}>
            <rect x={n.cx - n.w / 2} y={n.y - PILL_H / 2} width={n.w} height={PILL_H} rx={PILL_H / 2}
                fill={`${n.color}${current ? '38' : '24'}`} stroke={n.color} strokeWidth={current ? 3 : 2} />
            <SvgText x={n.cx} y={n.y + 6} text={n.label} size={16} anchor="middle" color="#F9FAFB" weight={600} />
        </motion.g>
    );
};

const EdgeView = ({ e, step, reduce }: { e: Edge; step: number; reduce: boolean }) => {
    const { shown, current } = useShow(e.at, step);
    const color = e.gate ? C.stone : e.color ?? C.glucoseSoft;
    const delay = shown && current ? 0.15 : 0;
    return (
        <g>
            <motion.path d={e.d} fill="none" stroke={color} strokeWidth={e.gate ? 7 : 3} strokeLinecap="round"
                markerEnd={`url(#glyco-head-${e.gate ? 'gate' : e.id})`}
                initial={false} animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : DUR.bar, delay, ease: EASE_OUT }} />
            <motion.g initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: DUR.enter, delay: shown && current ? 0.35 : 0 }}>
                <SvgText x={e.enzyme.x} y={e.enzyme.y} text={e.enzyme.text} size={16} anchor={e.enzyme.anchor ?? 'start'} color={e.gate ? '#FFFFFF' : '#D1D5DB'} weight={e.gate ? 700 : 600} />
            </motion.g>
            {e.stoich && <StoichChip s={e.stoich} shown={shown} current={current} reduce={reduce} />}
        </g>
    );
};

/** Moeda de ATP/NADH: salta (escala) quando a molécula passa pelo degrau. */
const StoichChip = ({ s, shown, current, reduce }: { s: Stoich; shown: boolean; current: boolean; reduce: boolean }) => (
    <motion.g initial={false} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.5 }}
        transition={{ duration: reduce ? 0 : DUR.enter, delay: shown && current ? 0.5 : 0, type: reduce ? 'tween' : 'spring', stiffness: 460, damping: 22 }}>
        <SvgText x={s.x} y={s.y} text={s.text} size={17} anchor={s.anchor} color={s.gain ? C.glucoseSoft : C.caveat} weight={800} />
    </motion.g>
);

const Header = ({ x, text, at, step }: { x: number; text: string; at: number; step: number }) => (
    <motion.g initial={false} animate={{ opacity: step >= at ? 1 : 0 }} transition={{ duration: DUR.enter }}>
        <SvgText x={x} y={22} text={text} size={16} color={C.muted} weight={700} />
    </motion.g>
);

const Mito = ({ step }: { step: number }) => (
    <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0, x: step >= 3 ? 0 : 10 }} transition={{ duration: DUR.enter, delay: step === 3 ? 0.4 : 0, ease: EASE_OUT }}>
        <rect x={552} y={ROW[5] - 30} width={124} height={60} rx={12} fill={`${C.co2}24`} stroke={C.co2} strokeWidth={2.5} />
        <SvgText x={614} y={ROW[5] - 6} text="mitocôndria" size={16} anchor="middle" color="#F9FAFB" weight={700} />
        <SvgText x={614} y={ROW[5] + 18} text="~30–32 ATP" size={16} anchor="middle" color={C.glucoseSoft} weight={700} />
    </motion.g>
);

/** Ativadores da PFK-1 (passo 2): chegam pela esquerda até o portão. */
const Activators = ({ step }: { step: number }) => (
    <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0, x: step >= 1 ? 0 : -14 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.2 : 0, ease: EASE_OUT }}>
        <SvgText x={COL1 - 14} y={midGap(3)} text="ADP·AMP·Pi →" size={16} anchor="end" color={C.ok} weight={700} />
    </motion.g>
);

const NadLoop = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const on = step >= 3;
    const t = (delay: number) => ({ duration: reduce ? 0 : DUR.draw, delay: on && step === 3 ? delay : 0, ease: EASE_IN_OUT });
    return (
        <g>
            <motion.path d={NADH_DOWN} fill="none" stroke={C.lactate} strokeWidth={3} markerEnd="url(#glyco-head-nad)"
                initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={t(0.6)} />
            <motion.path d={NAD_UP} fill="none" stroke={C.lactateSoft} strokeWidth={3} strokeDasharray="8 6" markerEnd="url(#glyco-head-nad)"
                initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={t(1)} />
            <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, delay: on && step === 3 ? 0.9 : 0 }}>
                <SvgText x={596} y={ROW[1] + 30} text="NADH" size={16} color={C.lactate} weight={700} />
                <SvgText x={596} y={ROW[2] + 30} text="NAD⁺" size={16} color={C.lactateSoft} weight={700} />
            </motion.g>
        </g>
    );
};

const Heads = () => (
    <defs>
        {[...EDGES.map(e => ({ id: e.id, color: e.gate ? C.stone : e.color ?? C.glucoseSoft, size: e.gate ? 3.2 : 4 })),
            { id: 'gate', color: C.stone, size: 3.2 }, { id: 'nad', color: C.lactate, size: 4 }].map(h => (
            <marker key={h.id} id={`glyco-head-${h.id}`} viewBox="0 0 10 10" refX={6} refY={5} markerWidth={h.size} markerHeight={h.size} orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 Z" fill={h.color} />
            </marker>
        ))}
    </defs>
);

export const GlycolysisMap = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width={MAP_W} height={MAP_H} className="block" role="img"
            aria-label="Via da glicólise: fase preparatória, fase de pagamento e as duas saídas do piruvato">
            <Heads />
            <Header x={8} text="1 · PREPARATÓRIA" at={0} step={step} />
            <Header x={COL2 - 95} text="2 · PAGAMENTO · TUDO ×2" at={1} step={step} />
            <Header x={560} text="3 · DESTINO" at={3} step={step} />
            {EDGES.map(e => <EdgeView key={e.id} e={e} step={step} reduce={reduce} />)}
            <NadLoop step={step} reduce={reduce} />
            {NODES.map(n => <Pill key={n.id} n={n} step={step} />)}
            <Activators step={step} />
            <Mito step={step} />
            {!reduce && <g key={`travel-${step}`}>{TRAVELS[step].map((t, i) => <Token key={i} {...t} />)}</g>}
        </svg>
    );
};
