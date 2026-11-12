import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { GLUCOSE_RANGE, type TankStep } from './twoTanks.content';

/**
 * Slide 67 · o mapa dos dois tanques: fígado (pequeno) e músculo (grande) ligados pelo sangue, com o mostrador da
 * glicemia e a entrada do carboidrato da prova. A glicose circula em laço lento do fígado (e do intestino, quando há
 * carboidrato) até o músculo: é o fluxo que o slide ensina. Os níveis são didáticos; os números escritos são dos estudos.
 */

export const SCENE_W = 640;
export const SCENE_H = 250;

const LIVER = 'M 18 92 C 20 52, 92 40, 170 50 C 200 54, 206 80, 196 112 C 186 150, 150 196, 96 214 C 54 226, 22 196, 18 150 Z';
const MUSCLE = 'M 470 58 C 520 48, 600 50, 622 74 C 640 96, 632 170, 610 210 C 590 236, 520 238, 488 214 C 456 186, 446 110, 470 58 Z';

const CapsuleTank = ({ x, y, w, h, level, measured, active }: { x: number; y: number; w: number; h: number; level: number; measured: boolean; active: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const low = measured && level < 0.2;
    return (
        <g>
            <defs><clipPath id={`tank-${x}`}><rect x={x} y={y} width={w} height={h} rx={w / 2} /></clipPath></defs>
            <rect x={x} y={y} width={w} height={h} rx={w / 2} fill="#0B1220" />
            <motion.rect x={x} y={y} width={w} height={h} fill={C.glycogen} clipPath={`url(#tank-${x})`}
                style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }} initial={false}
                animate={{ scaleY: measured ? level : 0 }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }} />
            <rect x={x} y={y} width={w} height={h} rx={w / 2} fill="none" strokeWidth={3}
                stroke={!measured ? C.caveat : low ? C.risk : active ? C.glycogenSoft : '#5B6475'} strokeDasharray={measured ? undefined : '7 6'} />
            {!measured && <SvgText x={x + w / 2} y={y + h / 2 + 8} text="?" size={24} anchor="middle" color={C.caveat} weight={800} />}
        </g>
    );
};

const CX = 330;
const CY = 128;
const R = 62;
const angleOf = (mM: number) => {
    const [lo, hi] = GLUCOSE_RANGE;
    return -90 + Math.max(0, Math.min(1, (mM - lo) / (hi - lo))) * 180;
};
const arc = (a0: number, a1: number) => {
    const p = (a: number) => [CX + R * Math.sin((a * Math.PI) / 180), CY - R * Math.cos((a * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`;
};

const Gauge = ({ mM }: { mM: number | null }) => {
    const reduce = useReducedMotion() ?? false;
    const on = mM !== null;
    return (
        <g>
            <path d={arc(-90, angleOf(3.5))} stroke={C.risk} strokeWidth={12} fill="none" />
            <path d={arc(angleOf(3.5), angleOf(4.2))} stroke="#3A4152" strokeWidth={12} fill="none" />
            <path d={arc(angleOf(4.2), angleOf(5.2))} stroke={C.glucoseDeep} strokeWidth={12} fill="none" />
            <path d={arc(angleOf(5.2), 90)} stroke="#3A4152" strokeWidth={12} fill="none" />
            {[2, 4, 6].map(v => {
                const a = (angleOf(v) * Math.PI) / 180;
                return <SvgText key={v} x={CX + (R + 20) * Math.sin(a)} y={CY - (R + 20) * Math.cos(a) + 6} text={String(v)} size={16} anchor="middle" color={C.muted} />;
            })}
            <motion.g style={{ transformOrigin: `${CX}px ${CY}px` }} initial={false} animate={{ rotate: angleOf(mM ?? 4.7), opacity: on ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }}>
                <rect x={CX - 4} y={CY - R + 4} width={8} height={R - 4} rx={4} fill={on && (mM ?? 5) < 3.5 ? C.risk : C.glucoseSoft} />
            </motion.g>
            <circle cx={CX} cy={CY} r={8} fill={C.stone} />
        </g>
    );
};

const HEX = 'M 0 -9 L 8 -4.5 L 8 4.5 L 0 9 L -8 4.5 L -8 -4.5 Z';

/** Glicose circulando: do fígado ao músculo pelo sangue; com carboidrato, também do intestino. */
const Flow = ({ step, feed }: { step: number; feed: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    if (reduce) return null;
    const fromLiver = step === 1 ? 1 : 3;
    const tokens = [
        ...Array.from({ length: fromLiver }, (_, i) => ({ xs: [196, 330, 452], ys: [164, 164, 164], d: i * 1.1 })),
        ...(feed ? [0, 1.5].map(d => ({ xs: [222, 222, 330, 452], ys: [36, 164, 164, 164], d: d + 0.5 })) : []),
    ];
    return (
        <g key={`flow-${step}-${feed}`}>
            {tokens.map((t, i) => (
                <motion.path key={i} d={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={2} initial={{ x: t.xs[0], y: t.ys[0], opacity: 0 }}
                    animate={{ x: t.xs, y: t.ys, opacity: t.xs.map((_, k) => (k === 0 || k === t.xs.length - 1 ? 0 : 1)) }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.4, delay: t.d, ease: 'linear' }} />
            ))}
        </g>
    );
};

export const TwoTanksScene = ({ s, step }: { s: TankStep; step: number }) => {
    const measured = s.liver !== null;
    const gonzalez = step >= 3;
    return (
        <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} width={SCENE_W} height={SCENE_H} className="block" role="img"
            aria-label="Fígado e músculo ligados pelo sangue, com o mostrador da glicose e a entrada do carboidrato">
            <path d={LIVER} fill="#3A2530" stroke="#8A5A6A" strokeWidth={3} />
            <path d={MUSCLE} fill="#3A2A2A" stroke="#8A6A5A" strokeWidth={3} />
            {[0, 1, 2, 3].map(k => <path key={k} d={`M ${482 + k * 34} ${60 + k * 2} C ${470 + k * 34} 110, ${474 + k * 34} 170, ${500 + k * 30} 222`} stroke="#5A4440" strokeWidth={2} fill="none" />)}
            <rect x={186} y={152} width={272} height={24} rx={12} fill="#2A3140" stroke={C.co2} strokeWidth={2} />
            <SvgText x={20} y={24} text="fígado ~80 g" size={18} color="#FFFFFF" weight={800} />
            <SvgText x={20} y={44} text="faixa 0–160 g" size={16} color={C.caveat} />
            <SvgText x={620} y={24} text="músculo ~500 g" size={18} anchor="end" color="#FFFFFF" weight={800} />
            <SvgText x={620} y={44} text="faixa 300–700 g" size={16} anchor="end" color={C.caveat} />
            <CapsuleTank x={86} y={78} w={46} h={120} level={s.liver ?? 0} measured={measured} active={gonzalez} />
            <CapsuleTank x={500} y={74} w={84} h={146} level={s.muscle} measured active={step === 1 || gonzalez} />
            <SvgText x={322} y={200} text={s.glucose === null ? 'sangue: ~4 g de glicose' : `glicemia: ${s.feed ? '4,2–5,2' : '2,5'} mM`} size={17} anchor="middle"
                color={s.glucose === null ? C.caveat : s.feed ? C.glucoseSoft : C.risk} weight={800} />
            <Gauge mM={s.glucose} />
            <motion.g initial={false} animate={{ opacity: s.feed ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                <SvgText x={234} y={24} text="carboidrato na prova" size={16} color={C.glucoseSoft} weight={800} />
                <path d="M 222 14 L 222 146" stroke={C.glucose} strokeWidth={5} markerEnd="url(#tt-arrow)" />
            </motion.g>
            <defs>
                <marker id="tt-arrow" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={3.4} markerHeight={3.4} orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill={C.glucose} />
                </marker>
            </defs>
            <Flow step={step} feed={s.feed} />
            <SvgText x={109} y={236} text={gonzalez ? '325 → 345' : measured ? '' : 'não medido'} size={16} anchor="middle" color={gonzalez ? C.ok : C.caveat} weight={800} />
            <SvgText x={542} y={244} text={gonzalez ? '101 → 60 mmol/L' : ''} size={16} anchor="middle" color={C.risk} weight={800} />
        </svg>
    );
};
