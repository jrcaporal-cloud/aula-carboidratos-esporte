import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { br } from '../kit/format';
import { IllustrativeChip } from '../kit/chips';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { FiberMosaic, MOSAIC_H, MOSAIC_W, ZOOM_CELL } from './FiberMosaic';
import { hash01 } from './hash';
import { EMPTY_PCT, GLY_POST, GLY_PRE, LAG_M, LOCAL, MEAN_DROP, STEPS } from './soccerFibers.content';

/**
 * Palco do slide 160 (640 × 420 px, posições absolutas). Coluna A: relógio + corte do vasto lateral (100 fibras).
 * Coluna B acumula: a média (passo 3), a fibra ampliada com o glicogênio por endereço (passo 4) e o tiro (passo 5).
 * A cada clique, uma coisa anda: as fibras apagam, as barras crescem, a lupa sai da fibra, os corredores correm.
 */

export const STAGE_W = 640;
export const STAGE_H = 420;
const MOS_W = 330;
const MOS_Y = 56;
const K = MOS_W / MOSAIC_W;
const B_X = 352;
const B_W = STAGE_W - B_X;
const ZOOM = { x: B_X, y: 128, d: 116 };

const Block = ({ show, x, y, w, children }: { show: boolean; x: number; y: number; w: number; children: ReactNode }) => (
    <motion.div className="absolute flex flex-col gap-1" style={{ left: x, top: y, width: w }}
        initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
        {children}
    </motion.div>
);

const Title = ({ children }: { children: ReactNode }) => <span className="text-[16px] font-semibold text-gray-200">{children}</span>;

/** Passo 3: a média do homogeneizado. */
const Mean = ({ show }: { show: boolean }) => (
    <Block show={show} x={B_X} y={0} w={B_W}>
        <div className="flex items-baseline justify-between">
            <Title>média · mmol/kg ps</Title>
            <span className="font-display text-[26px] font-bold" style={{ color: C.glycogenSoft }}>−{MEAN_DROP}%</span>
        </div>
        {[{ label: 'antes', v: GLY_PRE }, { label: "90'", v: GLY_POST }].map((r, i) => (
            <div key={r.label} className="flex items-center gap-2">
                <span className="w-[44px] text-[16px] text-gray-300">{r.label}</span>
                <div className="relative h-[22px] w-[180px] overflow-hidden rounded" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <Grow value={show ? r.v / GLY_PRE : 0} color={C.glycogen} delay={0.2 + i * 0.15} />
                </div>
                <span className="font-mono text-[17px] tabular-nums text-white">{r.v}</span>
            </div>
        ))}
    </Block>
);

/** Fibra tipo 2 ampliada: 7 miofibrilas, glicogênio dentro (intra) e entre elas (inter). */
const MYO = [[0, 0], ...Array.from({ length: 6 }, (_, i) => [30 * Math.cos((i * Math.PI) / 3), 30 * Math.sin((i * Math.PI) / 3)])] as const;
const INTRA = MYO.flatMap(([x, y], m) => [-5, 5].map((dx, j) => ({ x: x + dx, y: y + (j ? 4 : -4), id: m * 2 + j })));
const INTER = Array.from({ length: 12 }, (_, i) => {
    const a = ((i + 0.5) * Math.PI) / 6;
    const r = i % 2 ? 46 : 18;
    return { x: r * Math.cos(a), y: r * Math.sin(a), id: 100 + i };
});
/** Fração que some no 1º bloco (fibra tipo 2): 72% das de dentro, 59% das de fora (escolha fixa, pseudoaleatória). */
const goneSet = (frac: number, n: number, seed: number): ReadonlySet<number> =>
    new Set([...Array(n).keys()].sort((a, b) => hash01(a + seed) - hash01(b + seed)).slice(0, Math.round(frac * n)));
const INTRA_GONE = goneSet(LOCAL[0].t2 / 100, INTRA.length, 300);
const INTER_GONE = goneSet(LOCAL[1].t2 / 100, INTER.length, 700);

const Dot = ({ x, y, out, i }: { x: number; y: number; out: boolean; i: number }) => (
    <motion.circle cx={x} cy={y} r={4.5} fill={C.glycogen} stroke="#04080F" strokeWidth={1.5}
        initial={false} animate={{ opacity: out ? 0.12 : 1 }} transition={{ duration: DUR.enter, delay: out ? stagger(i, 0.5, 0.03) : 0 }} />
);

const Zoom = ({ show, drained }: { show: boolean; drained: boolean }) => {
    const r = ZOOM.d / 2;
    return (
        <Block show={show} x={B_X} y={100} w={B_W}>
            <Title>fibra tipo 2 ampliada · Vigh-Larsen 2022</Title>
            <div className="flex items-start gap-3">
                <motion.svg viewBox={`${-r} ${-r} ${ZOOM.d} ${ZOOM.d}`} width={ZOOM.d} height={ZOOM.d} className="shrink-0"
                    initial={false} animate={{ scale: show ? 1 : 0.5 }} transition={{ duration: DUR.morph, ease: EASE_OUT }}
                    role="img" aria-label="Corte de uma fibra: glicogênio dentro e entre as miofibrilas">
                    <circle r={r - 2} fill="#1E293B" stroke="#F9FAFB" strokeWidth={3} />
                    {MYO.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={13} fill="#475569" />)}
                    {INTRA.map((d, i) => <Dot key={d.id} x={d.x} y={d.y} out={drained && INTRA_GONE.has(i)} i={i} />)}
                    {INTER.map((d, i) => <Dot key={d.id} x={d.x} y={d.y} out={drained && INTER_GONE.has(i)} i={i + 4} />)}
                </motion.svg>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {LOCAL.map((l, gi) => (
                        <div key={l.key} className="flex flex-col">
                            <span className="text-[15px] leading-tight text-gray-300">{l.label}</span>
                            {[{ t: 'tipo 1', v: l.t1 }, { t: 'tipo 2', v: l.t2 }].map((b, i) => (
                                <div key={b.t} className="flex items-center gap-2">
                                    <span className="w-[46px] text-[15px] text-gray-300">{b.t}</span>
                                    <div className="relative h-[14px] w-[50px] overflow-hidden rounded-sm" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                        <Grow value={show ? b.v / 100 : 0} color={i ? C.glycogenSoft : C.co2} delay={0.4 + gi * 0.2 + i * 0.1} />
                                    </div>
                                    <span className="font-mono text-[15px] tabular-nums" style={{ color: i ? C.glycogenSoft : '#E5E7EB' }}>−{b.v}%</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Block>
    );
};

/** Passo 5: dois tiros de 30 m, zoom nos últimos 5 m; o do fim do jogo chega ~0,8 m atrás. */
const Sprint = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion();
    const x0 = 86;
    const x1 = B_W - 14;
    const at = (m: number) => x0 + ((x1 - x0) * (m - 25)) / 5;
    const lanes = [{ y: 40, label: 'início', end: 30, color: C.text }, { y: 80, label: 'fim', end: 30 - LAG_M, color: C.risk }];
    return (
        <Block show={show} x={B_X} y={300} w={B_W}>
            <Title>tiro de 30 m · últimos 5 m</Title>
            <svg viewBox={`0 0 ${B_W} 96`} width={B_W} height={96} role="img" aria-label="O tiro do fim do jogo chega cerca de 0,8 m atrás">
                <line x1={at(30)} x2={at(30)} y1={22} y2={94} stroke={C.text} strokeWidth={3} strokeDasharray="5 5" />
                <SvgText x={at(30) - 10} y={16} text="chegada · 30 m" anchor="end" size={16} color={C.muted} />
                {lanes.map(l => (
                    <g key={l.label}>
                        <SvgText x={0} y={l.y + 6} text={l.label} size={16} color={l.color} />
                        <line x1={x0} x2={x1} y1={l.y} y2={l.y} stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
                        <motion.g initial={false} animate={{ x: show ? at(l.end) - x0 : 0 }}
                            transition={{ duration: show && !reduce ? 1.1 : 0, delay: show ? 0.2 : 0, ease: EASE_OUT }}>
                            <rect x={x0 - 6} y={l.y - 14} width={12} height={28} rx={4} fill={l.color} />
                        </motion.g>
                    </g>
                ))}
                <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ delay: show ? 1.1 : 0, duration: DUR.enter }}>
                    <SvgText x={at(30 - LAG_M) - 14} y={86} text={`≈${br(LAG_M)} m atrás`} anchor="end" size={16} color={C.risk} weight={700} />
                </motion.g>
            </svg>
        </Block>
    );
};

/** Lupa: a linha sai da fibra contornada e chega ao corte ampliado. */
const Leader = ({ show }: { show: boolean }) => {
    if (!ZOOM_CELL) return null;
    const fx = ZOOM_CELL.cx * K + 12;
    const fy = MOS_Y + ZOOM_CELL.cy * K;
    const tx = ZOOM.x + 6;
    const ty = ZOOM.y + ZOOM.d / 2;
    return (
        <svg className="pointer-events-none absolute inset-0" width={STAGE_W} height={STAGE_H} aria-hidden>
            <motion.path d={`M ${fx} ${fy} C ${fx + 20} ${fy}, ${tx - 20} ${ty}, ${tx} ${ty}`} fill="none" stroke="#F9FAFB" strokeWidth={3}
                initial={false} animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
                transition={{ duration: DUR.morph, ease: EASE_IN_OUT }} />
        </svg>
    );
};

export const SoccerStage = ({ step }: { step: number }) => (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
        <div className="absolute left-0 top-0 flex items-baseline gap-3">
            <CountUp text={STEPS[step].minute} duration={1.1} className="font-display text-[44px] font-bold leading-none text-white" />
            <span className="text-[16px] leading-tight text-gray-300">min de jogo<br />vasto lateral · 1 fibra = 1%</span>
        </div>
        <div className="absolute left-0" style={{ top: MOS_Y }}>
            <FiberMosaic emptied={step >= 1} emptyCount={EMPTY_PCT} width={MOS_W} highlight={step >= 3} />
        </div>
        <div className="absolute left-0 flex items-center gap-4 text-[16px] text-gray-200" style={{ top: MOS_Y + MOSAIC_H * K + 10 }}>
            <span className="flex items-center gap-2"><span className="inline-block h-4 w-4 rounded-sm" style={{ background: C.glycogen }} />com glicogênio</span>
            <span className="flex items-center gap-2"><span className="inline-block h-4 w-4 rounded-sm" style={{ background: '#1E293B', outline: `2px solid ${C.co2}` }} />vazia ou quase</span>
        </div>
        <div className="absolute left-0" style={{ top: MOS_Y + MOSAIC_H * K + 40 }}><IllustrativeChip>disposição ilustrativa</IllustrativeChip></div>
        <Mean show={step >= 2} />
        <Leader show={step >= 3} />
        <Zoom show={step >= 3} drained={step >= 3} />
        <Sprint show={step >= 4} />
    </div>
);
