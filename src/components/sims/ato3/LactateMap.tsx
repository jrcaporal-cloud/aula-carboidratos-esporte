import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Mapa da lançadeira (viewBox 640 × 428, desenhado 1:1). Esquerda: a fibra glicolítica que produz lactato (e, no passo 1,
 * a lixeira da leitura antiga). Centro: o sangue. Direita: fibra oxidativa e coração (combustível) e fígado (ciclo de Cori).
 * Loop permitido: moedas de lactato (e a glicose que volta do fígado) circulando, ≤ 6 formas, ciclo de 3,2 s.
 */

export const MAP_W = 640;
export const MAP_H = 428;
const VESSEL = { l: 288, r: 324, top: 34, bottom: 404 } as const;
const VX = (VESSEL.l + VESSEL.r) / 2;
const BLOOD = '#0E1729';
const SLATE = '#475569';
const BOX_X = 404;
const BOX_W = 228;
const FAST = { x: 8, y: 40, w: 228, h: 136 } as const;
const EXIT_Y = 96;
const BACK_Y = 150;

interface Organ { key: string; y: number; h: number; title: string; lines: readonly { text: string; color: string }[]; at: number; color: string; inY: number }
const ORGANS: readonly Organ[] = [
    { key: 'lenta', y: 20, h: 96, title: 'fibra oxidativa (I)', at: 1, color: C.lactate, inY: 68,
        lines: [{ text: 'LDH: lactato → piruvato', color: C.lactateSoft }, { text: '→ mitocôndria → CO₂', color: '#D1D5DB' }] },
    { key: 'coracao', y: 136, h: 76, title: 'coração', at: 1, color: C.lactate, inY: 174,
        lines: [{ text: 'oxida o lactato', color: C.lactateSoft }] },
    { key: 'figado', y: 262, h: 128, title: 'fígado', at: 2, color: C.glucose, inY: 300,
        lines: [{ text: 'gliconeogênese', color: C.glucoseSoft }, { text: '2 lactato → 1 glicose', color: '#F3F4F6' }, { text: 'custo: 4 ATP + 2 GTP', color: '#D1D5DB' }] },
];
const LIVER_OUT_Y = 366;

type Pt = readonly [number, number];
interface Route { pts: readonly Pt[]; letter: 'L' | 'G'; at: number }
const toOrgan = (y: number): Pt[] => [[FAST.x + FAST.w, EXIT_Y], [VX, EXIT_Y], [VX, y], [BOX_X + 10, y]];
const ROUTES: readonly Route[] = [
    { pts: toOrgan(68), letter: 'L', at: 1 },
    { pts: toOrgan(174), letter: 'L', at: 1 },
    { pts: toOrgan(300), letter: 'L', at: 2 },
    { pts: [[BOX_X, LIVER_OUT_Y], [VX, LIVER_OUT_Y], [VX, BACK_Y], [FAST.x + FAST.w - 6, BACK_Y]], letter: 'G', at: 2 },
];

const Coin = ({ r, i }: { r: Route; i: number }) => {
    const color = r.letter === 'L' ? C.lactate : C.glucose;
    const t = { duration: 3.2, delay: 0.7 + i * 0.55, repeat: Infinity, repeatDelay: 0.5, ease: EASE_IN_OUT };
    return (
        <motion.g initial={{ x: r.pts[0][0], y: r.pts[0][1], opacity: 0 }}
            animate={{ x: r.pts.map(p => p[0]), y: r.pts.map(p => p[1]), opacity: [0, 1, 1, 0] }}
            transition={{ ...t, times: [0, 0.3, 0.7, 1], opacity: { ...t, times: [0, 0.1, 0.88, 1] } }}>
            <circle r={12} fill={color} stroke="#04080F" strokeWidth={2} />
            <text y={6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>{r.letter}</text>
        </motion.g>
    );
};

const Fade = ({ show, delay = 0, children }: { show: boolean; delay?: number; children: ReactNode }) => (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, delay: show ? delay : 0, ease: EASE_OUT }}>{children}</motion.g>
);

const Line = ({ d, color, show, dashed = false, reduce }: { d: string; color: string; show: boolean; dashed?: boolean; reduce: boolean }) => (
    <motion.path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? '9 7' : undefined}
        markerEnd={`url(#lac-head-${color === C.glucose ? 'g' : color === C.lactate ? 'l' : 's'})`}
        initial={false} animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: show ? 0.15 : 0, ease: EASE_OUT }} />
);

/** A lixeira da leitura antiga: no passo 1 é o destino; depois fica riscada e esmaecida. */
const Trash = ({ step }: { step: number }) => (
    <g>
        <motion.g initial={false} animate={{ opacity: step === 0 ? 1 : 0.6 }} transition={{ duration: DUR.enter }}>
            <path d="M 104 214 L 148 214 M 116 214 L 118 206 L 134 206 L 136 214" fill="none" stroke={C.muted} strokeWidth={4} strokeLinecap="round" />
            <path d="M 108 220 L 112 266 L 140 266 L 144 220 Z" fill="none" stroke={C.muted} strokeWidth={4} strokeLinejoin="round" />
            <SvgText x={126} y={292} text="descarte?" size={16} anchor="middle" color={C.muted} weight={700} />
        </motion.g>
        <Fade show={step >= 1} delay={0.2}>
            <path d="M 92 202 L 160 278 M 160 202 L 92 278" stroke={C.stone} strokeWidth={5} strokeLinecap="round" />
        </Fade>
    </g>
);

/** Fluxo circulante do lactato em relação ao da glicose (HUI2017): a glicose vale a régua (1×). */
const FLUX = [{ label: 'alimentado', v: 1.1, text: '1,1×' }, { label: 'jejum', v: 2.5, text: '2,5×' }] as const;
const UNIT_PX = 56;
const Flux = ({ show, reduce }: { show: boolean; reduce: boolean }) => (
    <Fade show={show}>
        <SvgText x={8} y={334} text="fluxo circulante (glicose = 1×)" size={16} color="#F3F4F6" weight={700} />
        {FLUX.map((f, i) => {
            const y = 364 + i * 36;
            return (
                <g key={f.label}>
                    <SvgText x={8} y={y + 6} text={f.label} size={16} color="#D1D5DB" />
                    <rect x={100} y={y - 12} width={UNIT_PX} height={6} rx={2} fill={C.glucose} />
                    <motion.rect x={100} y={y - 3} width={f.v * UNIT_PX} height={14} rx={3} fill={C.lactate}
                        style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                        initial={false} animate={{ scaleX: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: show ? 0.3 + i * 0.15 : 0, ease: EASE_OUT }} />
                    <SvgText x={108 + f.v * UNIT_PX} y={y + 9} text={f.text} size={18} color={C.lactate} weight={800} />
                </g>
            );
        })}
    </Fade>
);

const Heads = () => (
    <defs>
        {[['g', C.glucose], ['l', C.lactate], ['s', SLATE]].map(([id, color]) => (
            <marker key={id} id={`lac-head-${id}`} viewBox="0 0 10 10" refX={6} refY={5} markerWidth={3.5} markerHeight={3.5} orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 Z" fill={color} />
            </marker>
        ))}
    </defs>
);

export const LactateMap = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const routes = ROUTES.filter(r => r.at <= step);
    const coins = step === 0 ? [] : step === 1 ? [...routes, ...routes] : [...routes, routes[0], routes[2]];
    return (
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width={MAP_W} height={MAP_H} className="block" role="img"
            aria-label="Mapa da lançadeira de lactato: fibra glicolítica, sangue, fibra oxidativa, coração e fígado (ciclo de Cori)">
            <Heads />
            <rect x={VESSEL.l} y={VESSEL.top} width={VESSEL.r - VESSEL.l} height={VESSEL.bottom - VESSEL.top} rx={18} fill={BLOOD} stroke={SLATE} strokeWidth={3} />
            <SvgText x={VX} y={24} text="sangue" size={16} anchor="middle" color={C.muted} weight={700} />

            <rect x={FAST.x} y={FAST.y} width={FAST.w} height={FAST.h} rx={16} fill="#0B1220" stroke={C.lactate} strokeWidth={3} />
            <SvgText x={FAST.x + 14} y={FAST.y + 28} text="fibra glicolítica (II)" size={18} color="#FFFFFF" weight={800} />
            <SvgText x={FAST.x + 14} y={FAST.y + 58} text="glicose → piruvato" size={16} color={C.glucoseSoft} />
            <SvgText x={FAST.x + 14} y={FAST.y + 86} text="LDH: → lactato" size={16} color={C.lactateSoft} weight={700} />
            <SvgText x={FAST.x + 14} y={FAST.y + 114} text="e devolve o NAD⁺" size={16} color="#D1D5DB" />

            <Line d={`M 126 ${FAST.y + FAST.h + 2} L 126 196`} color={SLATE} show={step === 0} dashed reduce={reduce} />
            <Trash step={step} />

            <Line d={`M ${FAST.x + FAST.w} ${EXIT_Y} L ${VESSEL.l - 6} ${EXIT_Y}`} color={C.lactate} show={step >= 1} reduce={reduce} />
            <Fade show={step >= 1} delay={0.3}>
                <rect x={240} y={EXIT_Y - 34} width={44} height={24} rx={12} fill="#04080F" stroke={C.lactate} strokeWidth={2} />
                <SvgText x={262} y={EXIT_Y - 16} text="MCT" size={16} anchor="middle" color={C.lactateSoft} weight={800} />
            </Fade>
            {ORGANS.map(o => (
                <g key={o.key}>
                    <Line d={`M ${VESSEL.r} ${o.inY} L ${BOX_X - 6} ${o.inY}`} color={C.lactate} show={step >= o.at} reduce={reduce} />
                    <Fade show={step >= o.at} delay={0.25}>
                        <rect x={BOX_X} y={o.y} width={BOX_W} height={o.h} rx={16} fill="#0B1220" stroke={o.color} strokeWidth={3} />
                        <SvgText x={BOX_X + 14} y={o.y + 26} text={o.title} size={18} color="#FFFFFF" weight={800} />
                        {o.lines.map((l, i) => <SvgText key={l.text} x={BOX_X + 14} y={o.y + 54 + i * 26} text={l.text} size={16} color={l.color} weight={600} />)}
                    </Fade>
                </g>
            ))}
            <Fade show={step >= 1} delay={0.3}>
                <SvgText x={364} y={58} text="MCT1" size={16} anchor="middle" color={C.lactateSoft} weight={800} />
            </Fade>
            <Line d={`M ${BOX_X} ${LIVER_OUT_Y} L ${VESSEL.r + 6} ${LIVER_OUT_Y}`} color={C.glucose} show={step >= 2} dashed reduce={reduce} />
            <Line d={`M ${VESSEL.l} ${BACK_Y} L ${FAST.x + FAST.w + 6} ${BACK_Y}`} color={C.glucose} show={step >= 2} dashed reduce={reduce} />
            <Fade show={step >= 2} delay={0.5}>
                <SvgText x={262} y={BACK_Y + 26} text="glicose" size={16} anchor="middle" color={C.glucoseSoft} weight={700} />
                <SvgText x={BOX_X + 14} y={MAP_H - 6} text="ciclo de Cori" size={18} color={C.glucoseSoft} weight={800} />
            </Fade>
            <Flux show={step >= 3} reduce={reduce} />
            {!reduce && <g key={`coins-${Math.min(step, 2)}`}>{coins.map((r, i) => <Coin key={i} r={r} i={i} />)}</g>}
        </svg>
    );
};
