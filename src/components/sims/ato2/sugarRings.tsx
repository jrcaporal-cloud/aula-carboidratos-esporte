import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Lupas químicas do slide 20: dois anéis de glicose (piranose) com os carbonos numerados e o oxigênio
 * do anel, ligados pelo O da ligação glicosídica. α-1,4 = C1 de uma → C4 da outra (fila);
 * α-1,6 = C1 de uma → C6 (fora do anel, preso ao C5) da outra (ramo). Fonte: Roach 2012.
 */

/** Ordem dos vértices do anel a partir do C1, de 60 em 60 graus: C1, C2, C3, C4, C5 e o O do anel. */
const ORDER = ['1', '2', '3', '4', '5', 'O'] as const;
type Vertex = (typeof ORDER)[number];

interface RingProps {
    cx: number;
    cy: number;
    r: number;
    /** Ângulo (graus) do vértice do C1. */
    c1: number;
    /** Carbonos que ganham número. */
    show: readonly Vertex[];
}

const vertex = (cx: number, cy: number, r: number, c1: number, v: Vertex): [number, number] => {
    const a = ((c1 + 60 * ORDER.indexOf(v)) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

const Atom = ({ x, y }: { x: number; y: number }) => (
    <g>
        <circle cx={x} cy={y} r={12} fill="#04080F" stroke={C.stone} strokeWidth={2.5} />
        <SvgText x={x} y={y + 6} text="O" size={17} anchor="middle" color={C.stone} weight={800} />
    </g>
);

const Ring = ({ cx, cy, r, c1, show }: RingProps) => {
    const pts = ORDER.map(v => vertex(cx, cy, r, c1, v));
    const [ox, oy] = pts[5];
    return (
        <g>
            <polygon points={pts.map(p => p.join(',')).join(' ')} fill={`${C.glucose}2E`} stroke={C.glucose} strokeWidth={3.5} strokeLinejoin="round" />
            <Atom x={ox} y={oy} />
            {show.map(v => {
                const [vx, vy] = vertex(cx, cy, r * 0.62, c1, v);
                return <SvgText key={v} x={vx} y={vy + 6} text={v} size={17} anchor="middle" color={C.glucoseSoft} weight={800} />;
            })}
        </g>
    );
};

const Bond = ({ d }: { d: string }) => <path d={d} fill="none" stroke="#F3F4F6" strokeWidth={3.5} strokeLinecap="round" />;

const Frame = ({ x, y, w, h, title, foot, delay }: { x: number; y: number; w: number; h: number; title: string; foot: string; delay: number }) => (
    <g>
        <rect x={x} y={y} width={w} height={h} rx={14} fill="#04080F" stroke={C.co2} strokeWidth={2} />
        <SvgText x={x + w / 2} y={y + 28} text={title} size={18} anchor="middle" color={C.glucoseSoft} weight={800} />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.3, duration: DUR.enter }}>
            <SvgText x={x + w / 2} y={y + h - 14} text={foot} size={17} anchor="middle" color="#E5E7EB" />
        </motion.g>
    </g>
);

const Pop = ({ delay, children }: { delay: number; children: ReactNode }) => {
    const reduce = useReducedMotion();
    return (
        <motion.g initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: DUR.enter, ease: EASE_OUT }}>
            {children}
        </motion.g>
    );
};

/** Lupa α-1,4: dois anéis lado a lado; C1 (direita) → O → C4 (esquerda) do vizinho. */
export const Inset14 = ({ delay = 0.5 }: { delay?: number }) => {
    const r = 38;
    const a = { x: 400, y: 136 };
    const b = { x: 552, y: 136 };
    const [x1, y1] = vertex(a.x, a.y, r, 0, '1');
    const [x4, y4] = vertex(b.x, b.y, r, 0, '4');
    const mid = (x1 + x4) / 2;
    return (
        <Pop delay={delay}>
            <Frame x={322} y={40} w={306} h={186} title="lupa · ligação α-1,4" foot="C1 → O → C4: a fila cresce" delay={delay} />
            <Ring cx={a.x} cy={a.y} r={r} c1={0} show={['1', '4']} />
            <Ring cx={b.x} cy={b.y} r={r} c1={0} show={['1', '4']} />
            <Bond d={`M ${x1} ${y1} L ${mid - 12} ${y1} M ${mid + 12} ${y4} L ${x4} ${y4}`} />
            <Atom x={mid} y={y1} />
        </Pop>
    );
};

/** Lupa α-1,6: o C6 sai do anel pelo C5; o C1 do ramo prende nele pelo O. */
export const Inset16 = ({ delay = 0.5 }: { delay?: number }) => {
    const r = 32;
    const main = { x: 548, y: 360 };
    const [x5, y5] = vertex(main.x, main.y, r, 0, '5');
    const c6 = { x: x5, y: y5 - 24 };
    const o = { x: x5, y: c6.y - 22 };
    const branch = { x: x5, y: o.y - 24 - r };
    const [bx1, by1] = vertex(branch.x, branch.y, r, 90, '1');
    return (
        <Pop delay={delay}>
            <Frame x={458} y={150} w={170} h={290} title="lupa · α-1,6" foot="C1 → O → C6" delay={delay} />
            <Ring cx={branch.x} cy={branch.y} r={r} c1={90} show={['1']} />
            <Ring cx={main.x} cy={main.y} r={r} c1={0} show={['1', '4', '5']} />
            <Bond d={`M ${x5} ${y5} L ${c6.x} ${c6.y} M ${c6.x} ${c6.y} L ${o.x} ${o.y + 12} M ${o.x} ${o.y - 12} L ${bx1} ${by1}`} />
            <SvgText x={c6.x - 10} y={c6.y + 4} text="6" size={17} anchor="end" color={C.glucoseSoft} weight={800} />
            <Atom x={o.x} y={o.y} />
            <SvgText x={o.x + 18} y={o.y + 6} text="ramo" size={16} anchor="start" color="#E5E7EB" />
        </Pop>
    );
};
