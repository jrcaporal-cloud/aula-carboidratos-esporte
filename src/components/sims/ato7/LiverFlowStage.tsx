import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountSvgText } from '../kit/CountUp';
import { LANES, LIVER_MAX, MUSCLE_MAX, type OrganFill } from './liver.content';

/**
 * Palco do slide 124: duas pistas (sacarose em cima, glicose embaixo), cada uma com bebida → veia porta → fígado →
 * sangue → músculo. O fígado e o músculo enchem até o número medido por ¹³C-MRS (Fuchs 2016); o fígado da sacarose
 * incha (o volume só aumentou nesse braço). Do passo 2 em diante, um fluxo em laço mostra o esquema: a frutose
 * (pentágono rosa) fica no fígado; parte da glicose (hexágono âmbar) segue para o músculo.
 * Geometria em px do palco (viewBox 1:1 com a caixa).
 */

export const FLOW_W = 636;
export const FLOW_H = 294;

const LANE_Y = [86, 198] as const;
const PILL = { x: 8, w: 122, h: 60 };
const LIVER = { x: 198, w: 128 };
const MUSCLE = { x: 402, w: 180 };
const LIVER_H = (LIVER.w * 140) / 200;
const MUSCLE_H = (MUSCLE.w * 140) / 200;
const LIVER_CX = LIVER.x + LIVER.w / 2;
const MUSCLE_CX = MUSCLE.x + MUSCLE.w / 2;
const VALUE_DY = 63;

const SHAPES = {
    liver: 'M12 58 C 18 18, 92 6, 152 12 C 188 16, 200 36, 190 56 C 180 80, 140 110, 96 126 C 70 134, 50 122, 40 108 C 26 88, 8 82, 12 58 Z',
    muscle: 'M4 70 L 22 70 C 50 26, 150 26, 178 70 L 196 70 L 178 70 C 150 114, 50 114, 22 70 Z',
} as const;
const BOUNDS = { liver: [6, 134], muscle: [36, 104] } as const;

interface OrganProps {
    kind: keyof typeof SHAPES;
    x: number;
    y: number;
    w: number;
    level: number;
    swell?: boolean;
    delay?: number;
}

/** Contorno chapado que enche de baixo para cima (scaleY recortado pelo contorno). */
const Organ = ({ kind, x, y, w, level, swell = false, delay = 0 }: OrganProps) => {
    const reduce = useReducedMotion() ?? false;
    const clip = useId();
    const [top, bottom] = BOUNDS[kind];
    return (
        <g transform={`translate(${x} ${y}) scale(${w / 200})`}>
            <motion.g style={{ originX: 0.5, originY: 0.5 }} initial={false} animate={{ scale: swell ? 1.08 : 1 }}
                transition={{ duration: reduce ? 0 : DUR.draw, delay: reduce ? 0 : delay + 0.3, ease: EASE_OUT }}>
                <defs><clipPath id={clip}><path d={SHAPES[kind]} /></clipPath></defs>
                <path d={SHAPES[kind]} fill="rgba(255,255,255,0.07)" />
                <g clipPath={`url(#${clip})`}>
                    <motion.rect x={0} y={top} width={200} height={bottom - top} fill={C.glycogen}
                        style={{ originX: 0.5, originY: 1 }} initial={false} animate={{ scaleY: Math.max(0, Math.min(1, level)) }}
                        transition={{ duration: reduce ? 0 : 1.0, delay: reduce ? 0 : delay, ease: EASE_OUT }} />
                </g>
                <path d={SHAPES[kind]} fill="none" stroke={swell ? C.fructoseSoft : 'rgba(243,244,246,0.85)'} strokeWidth={swell ? 5 : 3.5}
                    strokeLinejoin="round" style={{ transition: 'stroke 300ms ease-out' }} />
            </motion.g>
        </g>
    );
};

/** "53,6 → 86,8 g": o valor final conta quando o órgão enche. */
const Value = ({ cx, y, fill, filled, unit, delay }: { cx: number; y: number; fill: OrganFill; filled: boolean; unit: string; delay: number }) =>
    filled ? (
        <g>
            <SvgText x={cx - 4} y={y} text={`${fill.fromText} →`} anchor="end" size={18} color="#D1D5DB" />
            <CountSvgText x={cx + 4} y={y} text={fill.toText} anchor="start" size={18} color="#F9FAFB" weight={700} delay={delay} duration={0.9} />
        </g>
    ) : <SvgText x={cx} y={y} text={`${fill.fromText}${unit}`} anchor="middle" size={18} color="#D1D5DB" />;

const Arrow = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
    <g>
        <line x1={x1} y1={y} x2={x2 - 10} y2={y} stroke={C.co2} strokeWidth={4} strokeLinecap="round" />
        <path d={`M ${x2 - 12} ${y - 8} L ${x2} ${y} L ${x2 - 12} ${y + 8} Z`} fill={C.co2} />
    </g>
);

const HEX = 'M 0 -10 L 8.7 -5 L 8.7 5 L 0 10 L -8.7 5 L -8.7 -5 Z';
const PENT = 'M 0 -10 L 9.5 -3.1 L 5.9 8.1 L -5.9 8.1 L -9.5 -3.1 Z';

/** Uma molécula do laço: sai da bebida e para no fígado (frutose) ou segue até o músculo (glicose). */
const Token = ({ y, to, sugar, delay }: { y: number; to: 'liver' | 'muscle'; sugar: 'glc' | 'fru'; delay: number }) => {
    const xs = to === 'liver' ? [PILL.x + PILL.w, LIVER_CX - 10, LIVER_CX] : [PILL.x + PILL.w, LIVER_CX, MUSCLE_CX - 20, MUSCLE_CX];
    const op = to === 'liver' ? [0, 1, 0] : [0, 1, 1, 0];
    return (
        <motion.path d={sugar === 'glc' ? HEX : PENT} fill={sugar === 'glc' ? C.glucose : C.fructose} stroke="#04080F" strokeWidth={2}
            initial={{ x: xs[0], y, opacity: 0 }} animate={{ x: xs, opacity: op }}
            transition={{ duration: to === 'liver' ? 2.2 : 3.0, ease: EASE_IN_OUT, repeat: Infinity, repeatDelay: to === 'liver' ? 1.6 : 0.8, delay }} />
    );
};

/** Fluxo esquemático (≤ 6 formas em movimento): sacarose = glicose + frutose; a frutose fica no fígado. */
const Flow = () => (
    <g aria-hidden>
        <Token y={LANE_Y[0] - 6} to="muscle" sugar="glc" delay={0} />
        <Token y={LANE_Y[0] + 6} to="liver" sugar="fru" delay={0.5} />
        <Token y={LANE_Y[0]} to="liver" sugar="fru" delay={1.9} />
        <Token y={LANE_Y[1] - 6} to="muscle" sugar="glc" delay={0.3} />
        <Token y={LANE_Y[1] + 6} to="liver" sugar="glc" delay={1.2} />
        <Token y={LANE_Y[1]} to="muscle" sugar="glc" delay={2.1} />
    </g>
);

export const LiverFlowStage = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const liverFull = step >= 1;
    const muscleFull = step >= 2;
    return (
        <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`} width={FLOW_W} height={FLOW_H} role="img"
            aria-label="Fígado e músculo enchendo com sacarose ou glicose (Fuchs 2016)">
            <SvgText x={PILL.x + PILL.w / 2} y={24} text="bebida" anchor="middle" size={16} color={C.muted} />
            <SvgText x={(PILL.x + PILL.w + LIVER.x) / 2} y={24} text="veia porta" anchor="middle" size={16} color={C.muted} />
            <SvgText x={LIVER_CX} y={24} text="fígado · g" anchor="middle" size={19} color="#F9FAFB" weight={700} />
            <SvgText x={(LIVER.x + LIVER.w + MUSCLE.x) / 2} y={24} text="sangue" anchor="middle" size={16} color={C.muted} />
            <SvgText x={MUSCLE_CX} y={24} text="músculo · mmol/L" anchor="middle" size={19} color="#F9FAFB" weight={700} />

            {LANES.map((lane, i) => {
                const y = LANE_Y[i];
                return (
                    <g key={lane.id}>
                        <rect x={PILL.x} y={y - PILL.h / 2} width={PILL.w} height={PILL.h} rx={14} fill={`${lane.color}26`} stroke={lane.color} strokeWidth={3} />
                        <SvgText x={PILL.x + PILL.w / 2} y={y - 3} text={lane.label} anchor="middle" size={19} color="#F9FAFB" weight={700} />
                        <SvgText x={PILL.x + PILL.w / 2} y={y + 19} text={lane.sub} anchor="middle" size={16} color="#E5E7EB" weight={500} />
                        <Arrow x1={PILL.x + PILL.w + 6} x2={LIVER.x} y={y} />
                        <Arrow x1={LIVER.x + LIVER.w + 4} x2={MUSCLE.x + 2} y={y} />
                        <Organ kind="liver" x={LIVER.x} y={y - LIVER_H / 2} w={LIVER.w} level={(liverFull ? lane.liver.to : lane.liver.from) / LIVER_MAX}
                            swell={liverFull && lane.id === 'sacarose'} delay={i * 0.12} />
                        <Organ kind="muscle" x={MUSCLE.x} y={y - MUSCLE_H / 2} w={MUSCLE.w} level={(muscleFull ? lane.muscle.to : lane.muscle.from) / MUSCLE_MAX}
                            delay={i * 0.12} />
                        <Value cx={LIVER_CX} y={y + VALUE_DY} fill={lane.liver} filled={liverFull} unit=" g" delay={0.3 + i * 0.12} />
                        <Value cx={MUSCLE_CX} y={y + VALUE_DY - 14} fill={lane.muscle} filled={muscleFull} unit="" delay={0.3 + i * 0.12} />
                    </g>
                );
            })}

            {liverFull && (
                <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, delay: 1.0, ease: EASE_OUT }}>
                    <SvgText x={LIVER.x + LIVER.w + 10} y={LANE_Y[0] - 36} text="volume ↑" anchor="start" size={17} color={C.fructoseSoft} weight={700} />
                </motion.g>
            )}

            <motion.g initial={false} animate={{ opacity: liverFull ? 1 : 0 }} transition={{ duration: DUR.enter, delay: liverFull ? 1.1 : 0 }}>
                <SvgText x={LIVER_CX} y={284} text="+3,4 g/h com sacarose" anchor="middle" size={18} color={C.fructoseSoft} weight={700} />
            </motion.g>
            <motion.g initial={false} animate={{ opacity: muscleFull ? 1 : 0 }} transition={{ duration: DUR.enter, delay: muscleFull ? 1.1 : 0 }}>
                <SvgText x={MUSCLE_CX} y={284} text="igual · P = 0,673" anchor="middle" size={18} color={C.glycogenSoft} weight={700} />
            </motion.g>

            {liverFull && !reduce && <Flow />}
        </svg>
    );
};
