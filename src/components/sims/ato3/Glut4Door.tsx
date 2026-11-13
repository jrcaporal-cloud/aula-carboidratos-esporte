import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import type { KeyState } from './glut4.content';

/**
 * A fibra em corte (viewBox 640 × 384, desenhada 1:1): capilar, sarcolema com um túbulo T, as vesículas de GLUT4
 * no citosol e as duas cascatas: insulina à esquerda (receptor → IRS-1 → PI3K → Akt → AS160) e contração à direita
 * (Ca²⁺, AMPK, Rac1; as duas últimas em debate). Elas convergem nas Rab/SNARE, que levam a vesícula à membrana.
 * Loop permitido: a glicose atravessando as portas abertas (≤ 6 formas, ciclo de 2,8 s).
 */

export const FIBER_W = 640;
export const FIBER_H = 384;
const MEM_Y = 58;
const TUBE = { l: 280, r: 328, bottom: 248 } as const;
const MID = (TUBE.l + TUBE.r) / 2;
const SLATE = '#475569';
const BLOOD = '#0E1729';
const PILL_H = 30;
const INS_X = 74;
const CON_X = 566;
const NODE = { x: MID, y: 354 } as const;

type Pt = readonly [number, number];
/** Onde cada vesícula se funde: as 4 primeiras (contração) metade na sarcolema, metade no túbulo T. */
const SITES: readonly Pt[] = [[196, 66], [TUBE.l + 5, 132], [416, 66], [TUBE.r - 5, 196], [240, 66], [TUBE.r - 5, 132], [372, 66], [TUBE.l + 5, 196]];
const REST: readonly Pt[] = [[214, 282], [262, 282], [346, 282], [394, 282], [190, 314], [238, 314], [370, 314], [418, 314]];

interface CascadePill { label: string; y: number; w: number }
const INS_PILLS: readonly CascadePill[] = [
    { label: 'IRS-1', y: 124, w: 100 }, { label: 'PI3K', y: 166, w: 100 }, { label: 'Akt', y: 208, w: 100 }, { label: 'AS160', y: 250, w: 100 },
];
const CON_PILLS: readonly CascadePill[] = [
    { label: 'Ca²⁺ (retículo)', y: 124, w: 144 }, { label: 'AMPK (AMP↑)', y: 166, w: 144 }, { label: 'Rac1', y: 208, w: 144 },
];

const HEX = 'M 0 -10 L 8.7 -5 L 8.7 5 L 0 10 L -8.7 5 L -8.7 -5 Z';

const Pill = ({ x, p, color, lit, at, step }: { x: number; p: CascadePill; color: string; lit: boolean; at: number; step: number }) => (
    <motion.g initial={false} animate={{ opacity: step >= at ? 1 : 0 }} transition={{ duration: DUR.enter }}>
        <rect x={x - p.w / 2} y={p.y - PILL_H / 2} width={p.w} height={PILL_H} rx={PILL_H / 2}
            fill={lit ? `${color}38` : '#0B1220'} stroke={lit ? color : SLATE} strokeWidth={lit ? 3 : 2} style={{ transition: 'all 300ms' }} />
        <SvgText x={x} y={p.y + 6} text={p.label} size={16} anchor="middle" color={lit ? '#F9FAFB' : '#9CA3AF'} weight={700} />
    </motion.g>
);

const Link = ({ d, color, lit, shown, dashed = false, reduce }: { d: string; color: string; lit: boolean; shown: boolean; dashed?: boolean; reduce: boolean }) => (
    <motion.path d={d} fill="none" stroke={lit ? color : SLATE} strokeWidth={lit ? 4 : 3} strokeLinecap="round"
        strokeDasharray={dashed ? '7 7' : undefined}
        initial={false} animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : DUR.bar, ease: EASE_OUT, delay: 0.1 }} />
);

/** Cascata da insulina: receptor na membrana e quatro degraus; acesa quando a chave da insulina está ligada. */
const InsulinCascade = ({ state, step, reduce }: { state: KeyState; step: number; reduce: boolean }) => {
    const lit = state === 'on';
    return (
        <g>
            <path d={`M ${INS_X - 10} 22 L ${INS_X - 6} ${MEM_Y} L ${INS_X - 6} ${MEM_Y + 30} M ${INS_X + 10} 22 L ${INS_X + 6} ${MEM_Y} L ${INS_X + 6} ${MEM_Y + 30}`}
                fill="none" stroke={C.insulin} strokeWidth={6} strokeLinecap="round" />
            <motion.circle cx={INS_X} cy={16} r={9} fill={C.insulin} initial={false} animate={{ opacity: lit ? 1 : 0.25 }} transition={{ duration: DUR.enter }} />
            <SvgText x={INS_X + 26} y={100} text="receptor" size={16} color={C.insulinSoft} />
            {INS_PILLS.slice(1).map((p, i) => {
                const prev = INS_PILLS[i];
                return <Link key={p.label} d={`M ${INS_X} ${prev.y + PILL_H / 2 + 2} L ${INS_X} ${p.y - PILL_H / 2 - 2}`} color={C.insulin}
                    lit={lit} shown={step >= 1} reduce={reduce} />;
            })}
            <Link d={`M ${INS_X} ${MEM_Y + 30} L ${INS_X} ${INS_PILLS[0].y - PILL_H / 2 - 2}`} color={C.insulin} lit={lit} shown={step >= 1} reduce={reduce} />
            <Link d={`M ${INS_X} ${INS_PILLS[3].y + PILL_H / 2 + 2} C ${INS_X} 340, 160 ${NODE.y}, ${NODE.x - 92} ${NODE.y}`} color={C.insulin}
                lit={lit} shown={step >= 1} dashed={!lit} reduce={reduce} />
            {INS_PILLS.map(p => <Pill key={p.label} x={INS_X} p={p} color={C.insulin} lit={lit} at={1} step={step} />)}
            <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.3 : 0 }}>
                <SvgText x={INS_X + 60} y={INS_PILLS[0].y + 4} text="chave 1" size={16} color={lit ? C.insulinSoft : '#9CA3AF'} weight={800} />
                <SvgText x={INS_X + 60} y={INS_PILLS[0].y + 23} text="insulina" size={16} color={lit ? C.insulinSoft : '#9CA3AF'} weight={800} />
            </motion.g>
        </g>
    );
};

const ContractionCascade = ({ state, step, reduce }: { state: KeyState; step: number; reduce: boolean }) => {
    const lit = state === 'on';
    const shown = step >= 2;
    return (
        <g>
            <Link d={`M ${CON_X} ${CON_PILLS[2].y + PILL_H / 2 + 14} C ${CON_X} 330, 470 ${NODE.y}, ${NODE.x + 92} ${NODE.y}`} color={C.stone} lit={lit} shown={shown} reduce={reduce} />
            <motion.g initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 2 ? 0.3 : 0 }}>
                <rect x={CON_X - 84} y={CON_PILLS[1].y - 25} width={168} height={CON_PILLS[2].y - CON_PILLS[1].y + 50} rx={12}
                    fill="none" stroke={C.stone} strokeWidth={2} strokeDasharray="6 6" />
                <SvgText x={CON_X - 92} y={CON_PILLS[1].y + 26} text="em debate" size={16} anchor="end" color={C.stone} weight={700} />
                <SvgText x={CON_X - 80} y={CON_PILLS[0].y - 6} text="chave 2" size={16} anchor="end" color={lit ? '#F9FAFB' : '#9CA3AF'} weight={800} />
                <SvgText x={CON_X - 80} y={CON_PILLS[0].y + 13} text="contração" size={16} anchor="end" color={lit ? '#F9FAFB' : '#9CA3AF'} weight={800} />
            </motion.g>
            {CON_PILLS.map(p => <Pill key={p.label} x={CON_X} p={p} color={C.stone} lit={lit} at={2} step={step} />)}
        </g>
    );
};

/** Glicose atravessando as portas abertas (loop do palco). Só passa onde já há GLUT4 fundido. */
const GlucoseFlow = ({ docked }: { docked: number }) => {
    const n = Math.min(6, docked === 0 ? 0 : docked <= 4 ? 3 : 6);
    return (
        <g>
            {Array.from({ length: n }, (_, i) => {
                const [sx, sy] = SITES[i];
                const inTube = sy > 70;
                const xs = inTube ? [MID, MID, sx + (sx < MID ? -34 : 34)] : [sx, sx, sx + (i % 2 ? 12 : -12)];
                const ys = inTube ? [26, sy, sy + 6] : [26, MEM_Y + 8, 118];
                return (
                    <motion.path key={i} d={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={2}
                        initial={{ x: xs[0], y: ys[0], opacity: 0 }}
                        animate={{ x: xs, y: ys, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.8, delay: 0.8 + i * 0.45, repeat: Infinity, repeatDelay: 0.6, ease: EASE_IN_OUT, times: [0, 0.5, 1],
                            opacity: { duration: 2.8, delay: 0.8 + i * 0.45, repeat: Infinity, repeatDelay: 0.6, times: [0, 0.12, 0.85, 1] } }} />
                );
            })}
        </g>
    );
};

const Vesicles = ({ docked, reduce }: { docked: number; reduce: boolean }) => (
    <g>
        {REST.map(([rx, ry], i) => {
            const on = i < docked;
            const [tx, ty] = SITES[i];
            return (
                <motion.g key={i} initial={false} animate={{ x: on ? tx - rx : 0, y: on ? ty - ry : 0 }}
                    transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.35 + (i % 4) * 0.08, ease: EASE_IN_OUT }}>
                    <circle cx={rx} cy={ry} r={13} fill={on ? C.glucose : '#0B1220'} stroke={C.glucose} strokeWidth={3} style={{ transition: 'fill 400ms 700ms' }} />
                    <rect x={rx - 3} y={ry - 7} width={6} height={14} rx={2} fill={on ? '#04080F' : C.glucose} style={{ transition: 'fill 400ms 700ms' }} />
                </motion.g>
            );
        })}
    </g>
);

export const Glut4Door = ({ step, insulin, contraction, docked }: { step: number; insulin: KeyState; contraction: KeyState; docked: number }) => {
    const reduce = useReducedMotion() ?? false;
    const anyOn = insulin === 'on' || contraction === 'on';
    return (
        <svg viewBox={`0 0 ${FIBER_W} ${FIBER_H}`} width={FIBER_W} height={FIBER_H} className="block" role="img"
            aria-label="Fibra muscular em corte: GLUT4 em vesículas, cascata da insulina e da contração convergindo na translocação">
            <rect x={0} y={0} width={FIBER_W} height={MEM_Y} fill={BLOOD} />
            <SvgText x={150} y={22} text="capilar · glicose do sangue" size={16} color={C.muted} weight={700} />
            {[170, 240, 380, 450, 530].map(x => <path key={x} d={HEX} transform={`translate(${x} 42)`} fill={C.glucose} opacity={0.55} />)}
            <rect x={0} y={MEM_Y} width={TUBE.l} height={16} fill={SLATE} />
            <rect x={TUBE.r} y={MEM_Y} width={FIBER_W - TUBE.r} height={16} fill={SLATE} />
            <rect x={TUBE.l + 10} y={MEM_Y} width={TUBE.r - TUBE.l - 20} height={TUBE.bottom - MEM_Y} fill={BLOOD} />
            <rect x={TUBE.l} y={MEM_Y} width={10} height={TUBE.bottom - MEM_Y + 10} fill={SLATE} />
            <rect x={TUBE.r - 10} y={MEM_Y} width={10} height={TUBE.bottom - MEM_Y + 10} fill={SLATE} />
            <rect x={TUBE.l} y={TUBE.bottom} width={TUBE.r - TUBE.l} height={10} fill={SLATE} />
            <SvgText x={TUBE.r + 8} y={240} text="túbulo T" size={16} color="#D1D5DB" weight={700} />
            <SvgText x={536} y={98} text="sarcolema" size={16} color="#D1D5DB" weight={700} />
            <motion.g initial={false} animate={{ opacity: docked < REST.length ? 1 : 0 }} transition={{ duration: DUR.enter, delay: 0.6 }}>
                <SvgText x={170} y={276} text="vesículas" size={16} anchor="end" color={C.glucoseSoft} weight={700} />
                <SvgText x={170} y={296} text="de GLUT4" size={16} anchor="end" color={C.glucoseSoft} weight={700} />
            </motion.g>
            <motion.g initial={false} animate={{ opacity: docked > 0 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: 0.9 }}>
                <SvgText x={344} y={98} text="GLUT4 na superfície" size={16} color={C.glucoseSoft} weight={700} />
            </motion.g>

            <InsulinCascade state={insulin} step={step} reduce={reduce} />
            <ContractionCascade state={contraction} step={step} reduce={reduce} />

            <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                <rect x={NODE.x - 92} y={NODE.y - 16} width={184} height={32} rx={16} fill={anyOn ? `${C.glucose}30` : '#0B1220'}
                    stroke={anyOn ? C.glucose : SLATE} strokeWidth={anyOn ? 3 : 2} style={{ transition: 'all 300ms' }} />
                <SvgText x={NODE.x} y={NODE.y + 6} text="Rab · SNARE" size={16} anchor="middle" color={anyOn ? '#F9FAFB' : '#9CA3AF'} weight={700} />
                <path d={`M ${NODE.x} ${NODE.y - 18} L ${NODE.x} 332`} stroke={anyOn ? C.glucose : SLATE} strokeWidth={3} markerEnd="url(#g4-head)" />
            </motion.g>
            <defs>
                <marker id="g4-head" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill={anyOn ? C.glucose : SLATE} />
                </marker>
            </defs>

            <Vesicles docked={docked} reduce={reduce} />
            {!reduce && <GlucoseFlow key={docked} docked={docked} />}
        </svg>
    );
};
