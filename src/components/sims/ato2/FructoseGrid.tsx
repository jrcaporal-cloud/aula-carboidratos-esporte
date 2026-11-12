import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { CountSvgText } from '../kit/CountUp';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SugarShape } from './shapes';

/**
 * Slide 27 · o mapa em grade (viewBox 690 × 424): colunas = estações (intestino, fígado, músculo),
 * linhas = açúcar (frutose em cima, galactose embaixo). A frutose se monta estação a estação (passos 1–3),
 * a galactose entra inteira no passo 4 e o passo 5 marca a diferença na porta. Nada some.
 * Laço só a partir do passo 3: lactato e glicose feitos da frutose seguindo do fígado ao músculo.
 */
export const GRID_W = 690;
export const GRID_H = 424;

const COLS = [{ x: 0, w: 222 }, { x: 246, w: 220 }, { x: 490, w: 200 }] as const;
const ROW_F = { y: 40, h: 214 }, ROW_G = { y: 270, h: 150 };
const FLOW_Y = ROW_F.y + 104;
const INK = '#E5E7EB';

/** Texto escuro sobre pílula colorida (sem o contorno do SvgText, que apagaria a letra). */
const Dark = ({ x, y, text }: { x: number; y: number; text: string }) => (
    <text x={x} y={y} textAnchor="middle" fontSize={16} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>{text}</text>
);

const At = ({ at, step, delay = 0.3, children }: { at: number; step: number; delay?: number; children: ReactNode }) => (
    <motion.g initial={false} animate={{ opacity: step >= at ? 1 : 0 }}
        transition={{ duration: DUR.enter, delay: step === at ? delay : 0, ease: EASE_OUT }}>
        {children}
    </motion.g>
);

const Cell = ({ col, row, color }: { col: number; row: { y: number; h: number }; color: string }) => (
    <rect x={COLS[col].x + 2} y={row.y} width={COLS[col].w - 4} height={row.h} rx={12} fill={`${color}14`} stroke={color} strokeWidth={2.5} />
);

const Link = ({ col, y, color }: { col: number; y: number; color: string }) => {
    const x0 = COLS[col].x + COLS[col].w - 2, x1 = COLS[col + 1].x + 2;
    return <path d={`M ${x0} ${y} L ${x1 - 4} ${y} M ${x1 - 12} ${y - 7} L ${x1 - 3} ${y} L ${x1 - 12} ${y + 7}`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />;
};

/** Medidor horizontal de fração (0–100%). */
const Gauge = ({ y, label, pct, text, color, step }: { y: number; label: string; pct: number; text: string; color: string; step: number }) => {
    const x = COLS[1].x + 14, w = 150;
    const reduce = useReducedMotion() ?? false;
    return (
        <g>
            <SvgText x={x} y={y} text={label} size={16} color={INK} />
            <rect x={x} y={y + 8} width={w} height={16} rx={4} fill="#1E293B" />
            <motion.rect x={x} y={y + 8} width={w * pct} height={16} rx={4} fill={color}
                style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                initial={false} animate={{ scaleX: step >= 1 ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: step === 1 ? 0.5 : 0, ease: EASE_OUT }} />
            <CountSvgText x={x + w + 8} y={y + 22} text={text} size={18} color={color} weight={800} run={step >= 1} delay={0.5} duration={0.7} />
        </g>
    );
};

const Hbar = ({ y, label, v, text, color, run }: { y: number; label: string; v: number; text: string; color: string; run: boolean }) => {
    const x = COLS[2].x + 92, w = 52;
    return (
        <g>
            <SvgText x={COLS[2].x + 14} y={y + 14} text={label} size={16} color={INK} />
            <motion.rect x={x} y={y} width={w * (v / 0.85)} height={18} rx={4} fill={color}
                style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                initial={false} animate={{ scaleX: run ? 1 : 0 }} transition={{ duration: DUR.bar, delay: run ? 0.5 : 0, ease: EASE_OUT }} />
            <CountSvgText x={x + w * (v / 0.85) + 6} y={y + 16} text={text} size={16} color={color} weight={800} run={run} delay={0.5} duration={0.7} />
        </g>
    );
};

/** Frutose: intestino (passo 1), fígado (passo 2), músculo (passo 3). */
const FructoseRow = ({ step }: { step: number }) => {
    const ix = COLS[0].x + 14, lx = COLS[1].x + 14, mx = COLS[2].x + 14;
    return (
        <g>
            <At at={0} step={step} delay={0}>
                <Cell col={0} row={ROW_F} color={C.fructose} />
                <g transform={`translate(${ix + 12} ${ROW_F.y + 24}) scale(0.42)`}><SugarShape kind="fru" /></g>
                <SvgText x={ix + 30} y={ROW_F.y + 30} text="FRUTOSE · GLUT5" size={16} color={C.fructoseSoft} weight={800} />
                <CountSvgText x={ix} y={ROW_F.y + 74} text="~90%" size={34} color={C.fructoseSoft} weight={800} run={step >= 0} delay={0.3} />
                <SvgText x={ix} y={ROW_F.y + 98} text="da dose baixa fica aqui," size={16} color={INK} />
                <SvgText x={ix} y={ROW_F.y + 118} text="metabolizada pela KHK" size={16} color={INK} />
                <SvgText x={ix} y={ROW_F.y + 146} text="sai: glicose, lactato," size={16} color={INK} />
                <SvgText x={ix} y={ROW_F.y + 166} text="glicerato (sangue portal)" size={16} color={INK} />
                <SvgText x={ix} y={ROW_F.y + 194} text="≥ 1 g/kg satura → fígado" size={16} color={C.caveat} weight={700} />
            </At>
            <At at={1} step={step} delay={0.1}>
                <Link col={0} y={ROW_F.y + 106} color={C.fructose} />
                <Cell col={1} row={ROW_F} color={C.fructose} />
                <SvgText x={lx} y={ROW_F.y + 30} text="destino em humanos" size={16} color={C.fructoseSoft} weight={800} />
                <Gauge y={ROW_F.y + 62} label="oxidada" pct={0.45} text="~45%" color={C.co2} step={step} />
                <Gauge y={ROW_F.y + 110} label="vira glicose" pct={0.41} text="~41%" color={C.glucose} step={step} />
                <Gauge y={ROW_F.y + 158} label="vira lactato" pct={0.25} text="~¼" color={C.lactate} step={step} />
                <SvgText x={lx} y={ROW_F.y + 206} text="frações se sobrepõem" size={16} color={C.caveat} />
            </At>
            <At at={2} step={step} delay={0.1}>
                <Link col={1} y={FLOW_Y} color={C.fructose} />
                <Cell col={2} row={ROW_F} color={C.fructose} />
                <SvgText x={mx} y={ROW_F.y + 30} text="no exercício" size={16} color={C.fructoseSoft} weight={800} />
                <SvgText x={mx} y={ROW_F.y + 56} text="da frutose oxidada:" size={16} color={INK} />
                <rect x={mx} y={ROW_F.y + 68} width={84} height={26} rx={4} fill={C.lactate} />
                <rect x={mx + 88} y={ROW_F.y + 68} width={84} height={26} rx={4} fill={C.glucose} />
                <Dark x={mx + 42} y={ROW_F.y + 87} text="½ lactato" />
                <Dark x={mx + 130} y={ROW_F.y + 87} text="½ glicose" />
                <SvgText x={mx} y={ROW_F.y + 126} text="lactato no sangue" size={16} color={INK} />
                <SvgText x={mx} y={ROW_F.y + 146} text="(µmol/kg/min):" size={16} color={INK} />
                <CountSvgText x={mx} y={ROW_F.y + 176} text="94 → 120" size={24} color={C.lactate} weight={800} run={step >= 2} delay={0.5} />
                <SvgText x={mx} y={ROW_F.y + 198} text="sem × com frutose" size={16} color={C.caveat} />
            </At>
        </g>
    );
};

/** Galactose: a linha inteira entra no passo 4. */
const GalactoseRow = ({ step }: { step: number }) => {
    const ix = COLS[0].x + 14, lx = COLS[1].x + 14;
    return (
        <At at={3} step={step} delay={0.1}>
            <Cell col={0} row={ROW_G} color={C.caveat} />
            <Cell col={1} row={ROW_G} color={C.caveat} />
            <Cell col={2} row={ROW_G} color={C.caveat} />
            <Link col={0} y={ROW_G.y + 76} color={C.caveat} />
            <Link col={1} y={ROW_G.y + 76} color={C.caveat} />
            <g transform={`translate(${ix + 12} ${ROW_G.y + 24}) scale(0.42)`}><SugarShape kind="gal" /></g>
            <SvgText x={ix + 30} y={ROW_G.y + 30} text="GALACTOSE · SGLT1" size={16} color={C.caveat} weight={800} />
            <SvgText x={ix} y={ROW_G.y + 62} text="a mesma porta" size={16} color={INK} />
            <SvgText x={ix} y={ROW_G.y + 82} text="da glicose: divide" size={16} color={INK} />
            <SvgText x={ix} y={ROW_G.y + 102} text="a fila, não abre pista" size={16} color={INK} />
            <SvgText x={lx} y={ROW_G.y + 34} text="via de Leloir" size={20} color={C.caveat} weight={800} />
            <SvgText x={lx} y={ROW_G.y + 62} text="a galactose vira glicose" size={16} color={INK} />
            <SvgText x={lx} y={ROW_G.y + 82} text="no fígado antes de" size={16} color={INK} />
            <SvgText x={lx} y={ROW_G.y + 102} text="servir ao músculo" size={16} color={INK} />
            <SvgText x={COLS[2].x + 14} y={ROW_G.y + 30} text="pico, g/min" size={16} color={C.caveat} weight={800} />
            <Hbar y={ROW_G.y + 44} label="galactose" v={0.41} text="0,41" color={C.caveat} run={step >= 3} />
            <Hbar y={ROW_G.y + 74} label="glicose" v={0.85} text="0,85" color={C.glucose} run={step >= 3} />
            <SvgText x={COLS[2].x + 14} y={ROW_G.y + 126} text="21% × 46% do ingerido" size={16} color={INK} />
        </At>
    );
};

/** Passo 5: a diferença na porta, carimbada na coluna do intestino. */
const DoorBadges = ({ step }: { step: number }) => (
    <motion.g initial={false} animate={{ opacity: step >= 4 ? 1 : 0, scale: step >= 4 ? 1 : 0.85 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        transition={{ duration: DUR.enter, delay: step === 4 ? 0.3 : 0, type: 'spring', stiffness: 420, damping: 24 }}>
        <rect x={COLS[0].x + 92} y={ROW_F.y + ROW_F.h - 14} width={124} height={28} rx={14} fill={C.fructose} />
        <Dark x={COLS[0].x + 154} y={ROW_F.y + ROW_F.h + 6} text="+ pista nova" />
        <rect x={COLS[0].x + 92} y={ROW_G.y + ROW_G.h - 26} width={124} height={26} rx={13} fill={C.caveat} />
        <Dark x={COLS[0].x + 154} y={ROW_G.y + ROW_G.h - 7} text="= mesma fila" />
    </motion.g>
);

type Pt = readonly [number, number];
const FLOW: readonly { kind: 'lac' | 'glc'; delay: number }[] = [
    { kind: 'lac', delay: 0 }, { kind: 'glc', delay: 0.7 }, { kind: 'lac', delay: 1.4 }, { kind: 'glc', delay: 2.1 },
];

/** Laço do passo 3 em diante: lactato e glicose feitos da frutose cruzando do fígado ao músculo. */
const Flow = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    if (step < 2 || reduce) return null;
    const path: readonly Pt[] = [[COLS[1].x + COLS[1].w - 6, FLOW_Y], [COLS[2].x + 4, FLOW_Y], [COLS[2].x + 18, FLOW_Y]];
    return (
        <g>
            {FLOW.map((f, i) => (
                <motion.g key={i} initial={{ x: path[0][0], y: path[0][1], opacity: 0 }}
                    animate={{ x: path.map(p => p[0]), y: path.map(p => p[1]), opacity: [0, 1, 0] }}
                    transition={{ duration: 2.8, delay: 0.8 + f.delay, repeat: Infinity, repeatDelay: 0, ease: 'linear' }}>
                    {f.kind === 'lac'
                        ? <circle r={8} fill={C.lactate} stroke="#04080F" strokeWidth={2} />
                        : <g transform="scale(0.4)"><SugarShape kind="glc" /></g>}
                </motion.g>
            ))}
        </g>
    );
};

export const FructoseGrid = ({ step }: { step: number }) => (
    <svg viewBox={`0 0 ${GRID_W} ${GRID_H}`} width={GRID_W} height={GRID_H} className="block" role="img"
        aria-label="Caminho da frutose e da galactose: intestino, fígado e músculo">
        {['INTESTINO', 'FÍGADO', 'MÚSCULO'].map((t, i) => (
            <SvgText key={t} x={COLS[i].x + 14} y={26} text={t} size={16} color={C.muted} weight={700} />
        ))}
        {[ROW_F, ROW_G].flatMap(r => [0, 1, 2].map(c => (
            <rect key={`${r.y}-${c}`} x={COLS[c].x + 2} y={r.y} width={COLS[c].w - 4} height={r.h} rx={12}
                fill="none" stroke="#334155" strokeWidth={2} strokeDasharray="8 7" />
        )))}
        {step < 1 && <SvgText x={COLS[1].x + COLS[1].w / 2} y={ROW_F.y + ROW_F.h / 2} text="frutose →" size={18} color="#94A3B8" anchor="middle" />}
        {step < 3 && <SvgText x={COLS[1].x + COLS[1].w / 2} y={ROW_G.y + ROW_G.h / 2 + 6} text="galactose →" size={18} color="#94A3B8" anchor="middle" />}
        <FructoseRow step={step} />
        <GalactoseRow step={step} />
        <Flow step={step} />
        <DoorBadges step={step} />
    </svg>
);
