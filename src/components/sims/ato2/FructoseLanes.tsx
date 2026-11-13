import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { CountSvgText } from '../kit/CountUp';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SugarShape, type SugarKind } from './shapes';

/**
 * Slide 27 · o palco em duas faixas paralelas (viewBox 620 × 424): frutose em cima, galactose embaixo; cada faixa com
 * 3 elos na mesma ordem (intestino → fígado → músculo), UM número por elo e a espécie/desenho do estudo no selo do elo.
 * A frutose se monta elo a elo (passos 1–3), a galactose entra inteira no 4 e o 5 carimba a diferença na porta.
 * Antes do passo, só a moldura tracejada. Nada some.
 */
export const LANES_W = 620;
export const LANES_H = 424;

const COL_X = [0, 218, 436] as const;
const CELL_W = 184;
const CELL_H = 148;
const INK = '#E5E7EB';
const DARK = '#04080F';

type Evidence = 'animal' | 'human' | 'mech';
const EVIDENCE_COLOR: Record<Evidence, string> = { animal: C.stone, human: C.co2, mech: C.caveat };

interface LinkCell { big: string; lines: readonly [string, string]; tag: string; evidence: Evidence }

interface Lane {
    kind: SugarKind;
    name: string;
    door: string;
    color: string;
    soft: string;
    y: number;
    /** Passo em que cada elo aparece. */
    at: readonly [number, number, number];
    cells: readonly [LinkCell, LinkCell, LinkCell];
    badge: string;
}

const LANES: readonly Lane[] = [
    {
        kind: 'fru', name: 'FRUTOSE', door: 'entra pelo GLUT5', color: C.fructose, soft: C.fructoseSoft, y: 34, at: [0, 1, 2],
        badge: '+ pista nova',
        cells: [
            { big: '~90%', lines: ['da dose baixa fica', 'no intestino (KHK)'], tag: 'camundongo', evidence: 'animal' },
            { big: '~41%', lines: ['vira glicose', 'em 3–6 h'], tag: 'humanos · revisão', evidence: 'human' },
            { big: '½ + ½', lines: ['chega como lactato', 'e como glicose'], tag: 'humanos · n = 7', evidence: 'human' },
        ],
    },
    {
        kind: 'gal', name: 'GALACTOSE', door: 'entra pelo SGLT1', color: C.caveat, soft: C.caveat, y: 234, at: [3, 3, 3],
        badge: '= mesma fila',
        cells: [
            { big: 'SGLT1', lines: ['a mesma porta', 'da glicose'], tag: 'mecanismo', evidence: 'mech' },
            { big: 'Leloir', lines: ['vira glicose antes', 'de ir ao músculo'], tag: 'mecanismo', evidence: 'mech' },
            { big: '0,41', lines: ['g/min no pico;', 'glicose: 0,85'], tag: 'humanos · n = 8', evidence: 'human' },
        ],
    },
];

const HEAD_H = 30;

const Appear = ({ show, born, delay = 0.15, children }: { show: boolean; born: boolean; delay?: number; children: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    if (!show) return null;
    return (
        <motion.g initial={born && !reduce ? { opacity: 0 } : false} animate={{ opacity: 1 }}
            transition={{ duration: DUR.enter, delay: born ? delay : 0, ease: EASE_OUT }}>
            {children}
        </motion.g>
    );
};

const Tag = ({ x, y, text, evidence }: { x: number; y: number; text: string; evidence: Evidence }) => {
    const color = EVIDENCE_COLOR[evidence];
    const w = CELL_W - 24;
    return (
        <g>
            <rect x={x} y={y} width={w} height={26} rx={13} fill="none" stroke={color} strokeWidth={2} strokeDasharray={evidence === 'mech' ? '5 4' : undefined} />
            <SvgText x={x + w / 2} y={y + 19} text={text} size={16} anchor="middle" color={color} weight={600} />
        </g>
    );
};

const Cell = ({ lane, i, step }: { lane: Lane; i: number; step: number }) => {
    const x = COL_X[i];
    const y = lane.y + HEAD_H + 4;
    const at = lane.at[i];
    const show = step >= at;
    const born = step === at;
    const c = lane.cells[i];
    const word = !/\d/.test(c.big);
    return (
        <g>
            <rect x={x + 1} y={y} width={CELL_W - 2} height={CELL_H} rx={12} fill={show ? `${lane.color}14` : 'none'}
                stroke={show ? lane.color : '#334155'} strokeWidth={show ? 2.5 : 2} strokeDasharray={show ? undefined : '8 7'} />
            {i < 2 && (
                <Appear show={step >= lane.at[i + 1]} born={step === lane.at[i + 1]} delay={0.05}>
                    <path d={`M ${x + CELL_W + 4} ${y + 66} L ${COL_X[i + 1] - 6} ${y + 66} M ${COL_X[i + 1] - 14} ${y + 59} L ${COL_X[i + 1] - 5} ${y + 66} L ${COL_X[i + 1] - 14} ${y + 73}`}
                        fill="none" stroke={lane.color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                </Appear>
            )}
            <Appear show={show} born={born} delay={i === 0 || lane.at[0] !== lane.at[2] ? 0.15 : 0.15 + i * 0.2}>
                {word
                    ? <SvgText x={x + 14} y={y + 40} text={c.big} size={30} color={lane.soft} weight={800} />
                    : <CountSvgText x={x + 14} y={y + 40} text={c.big} size={30} color={lane.soft} weight={800} run={show} delay={0.3} duration={0.7} />}
                <SvgText x={x + 14} y={y + 66} text={c.lines[0]} size={16} color={INK} />
                <SvgText x={x + 14} y={y + 86} text={c.lines[1]} size={16} color={INK} />
                <Tag x={x + 12} y={y + 106} text={c.tag} evidence={c.evidence} />
            </Appear>
        </g>
    );
};

const LaneRow = ({ lane, step }: { lane: Lane; step: number }) => {
    const live = step >= lane.at[0];
    const reduce = useReducedMotion() ?? false;
    return (
        <g>
            <g transform={`translate(14 ${lane.y + 14}) scale(0.4)`} opacity={live ? 1 : 0.6}><SugarShape kind={lane.kind} /></g>
            <SvgText x={32} y={lane.y + 20} text={lane.name} size={17} color={live ? lane.soft : '#94A3B8'} weight={800} />
            <SvgText x={lane.kind === 'fru' ? 120 : 140} y={lane.y + 20} text={lane.door} size={16} color={live ? INK : '#94A3B8'} />
            <motion.g initial={false} animate={{ opacity: step >= 4 ? 1 : 0, scale: step >= 4 || reduce ? 1 : 0.85 }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                transition={{ duration: DUR.enter, delay: step === 4 ? 0.3 : 0, type: 'spring', stiffness: 420, damping: 24 }}>
                <rect x={LANES_W - 136} y={lane.y + 1} width={134} height={28} rx={14} fill={lane.color} />
                <text x={LANES_W - 69} y={lane.y + 21} textAnchor="middle" fontSize={16} fontWeight={800} fill={DARK}
                    style={{ fontFamily: 'var(--font-body)' }}>{lane.badge}</text>
            </motion.g>
            {[0, 1, 2].map(i => <Cell key={i} lane={lane} i={i} step={step} />)}
        </g>
    );
};

export const FructoseLanes = ({ step }: { step: number }) => (
    <svg viewBox={`0 0 ${LANES_W} ${LANES_H}`} width={LANES_W} height={LANES_H} className="block" role="img"
        aria-label="Frutose e galactose em duas faixas: intestino, fígado e músculo, um número por elo">
        {['INTESTINO', 'FÍGADO', 'MÚSCULO'].map((t, i) => (
            <SvgText key={t} x={COL_X[i] + CELL_W / 2} y={18} text={t} size={16} anchor="middle" color={C.muted} weight={700} />
        ))}
        {LANES.map(l => <LaneRow key={l.kind} lane={l} step={step} />)}
    </svg>
);
