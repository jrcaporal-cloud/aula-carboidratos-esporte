import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { DesignChip } from './kit/chips';
import { CountSvgText } from './kit/CountUp';
import { br } from './kit/format';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { SvgText } from './kit/ui';
import { PaFrame, PaSide, STAGE_INNER_H, STAGE_INNER_W } from './ato6/paFrame';
import { LESSONS, PODL, RAVI, STEPS } from './ato6/highdose.content';

/**
 * Slide 105 · 120 g/h: o que se sabe. Palco em dois blocos com a mesma escala (g/min): à esquerda, Ravikanti 2025
 * (barra vazada = carboidrato total oxidado; cheia = exógena), que ganha embaixo as linhas de sintomas GI e de custo
 * de O₂; à direita, Podlogar 2022 em barras empilhadas (endógena embaixo, exógena em cima): o topo cresce, a base não.
 * O painel acumula o que foi medido, o que não mudou e o que ninguém demonstrou.
 */

const BASE = 286;
const TOP = 62;
const MAX = 3.8;
const sy = (v: number) => BASE - (v / MAX) * (BASE - TOP);
const h = (v: number) => (v / MAX) * (BASE - TOP);
const RX = [128, 214, 300] as const;
const PX = [470, 576] as const;
const BW = 64;

const grow = (reduce: boolean, delay: number) => ({
    initial: reduce ? false as const : { scaleY: 0 },
    animate: { scaleY: 1 },
    transition: { duration: DUR.bar, delay, ease: EASE_OUT },
    style: { originY: 1 },
});

const Ravikanti = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <g>
        <SvgText x={8} y={22} text="Ravikanti 2025 · maratonistas de elite" size={16} color="#F3F4F6" weight={800} />
        <SvgText x={8} y={44} text="g/min, 2ª hora" size={16} color={C.muted} weight={600} />
        <line x1={84} x2={346} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
        {RAVI.map((d, i) => (
            <g key={d.gh}>
                <motion.rect x={RX[i] - BW / 2} y={sy(d.total)} width={BW} height={h(d.total)} rx={6} fill="transparent" stroke={C.stone} strokeWidth={2.5}
                    {...grow(reduce, stagger(i, 0, 0.12))} />
                <motion.rect x={RX[i] - BW / 2 + 6} y={sy(d.exo)} width={BW - 12} height={h(d.exo)} rx={4} fill={C.glucose}
                    {...grow(reduce, stagger(i, 0.25, 0.12))} />
                <CountSvgText x={RX[i]} y={sy(d.total) - 8} text={br(d.total, 2)} size={16} anchor="middle" color="#E5E7EB" weight={700} delay={stagger(i, 0.2, 0.12)} />
                <CountSvgText x={RX[i]} y={sy(d.exo) + 22} text={br(d.exo, 2)} size={17} anchor="middle" color="#FFFFFF" weight={800} delay={stagger(i, 0.45, 0.12)} />
                <SvgText x={RX[i]} y={BASE + 22} text={`${d.gh} g/h`} size={17} anchor="middle" color="#FFFFFF" weight={800} />
                <SvgText x={RX[i]} y={BASE + 42} text={d.ratio} size={16} anchor="middle" color={C.muted} weight={600} />
                <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 6 }}
                    transition={{ duration: DUR.enter, delay: step === 1 ? stagger(i, 0.15, 0.12) : 0, ease: EASE_OUT }}>
                    <rect x={RX[i] - 41} y={BASE + 56} width={82} height={26} rx={6} fill={d.gi === 'pico' ? C.risk : `${C.risk}33`} />
                    <SvgText x={RX[i]} y={BASE + 75} text={d.gi} size={16} anchor="middle" color={d.gi === 'pico' ? '#FFFFFF' : '#FDA4AF'} weight={800} />
                </motion.g>
            </g>
        ))}
        <SvgText x={8} y={BASE + 22} text="dose" size={16} color={C.muted} weight={600} />
        <SvgText x={8} y={BASE + 42} text="proporção" size={16} color={C.muted} weight={600} />
        <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.5 : 0 }}>
            <SvgText x={8} y={BASE + 75} text="GI" size={16} color="#FDA4AF" weight={700} />
            <line x1={RX[0]} x2={RX[2]} y1={BASE + 102} y2={BASE + 102} stroke={C.ok} strokeWidth={3} markerEnd="url(#hd-head)" />
            <SvgText x={8} y={BASE + 108} text="O₂" size={16} color={C.ok} weight={700} />
            <SvgText x={(RX[0] + RX[2]) / 2} y={BASE + 130} text="−8,1 mL/kg/km · p = 0,039" size={16} anchor="middle" color={C.ok} weight={800} />
        </motion.g>
        <g>
            <rect x={84} y={BASE + 140} width={14} height={14} rx={3} fill="transparent" stroke={C.stone} strokeWidth={2.5} />
            <SvgText x={104} y={BASE + 153} text="total de CHO" size={16} color={C.caveat} weight={600} />
            <rect x={218} y={BASE + 140} width={14} height={14} rx={3} fill={C.glucose} />
            <SvgText x={238} y={BASE + 153} text="exógena" size={16} color={C.glucoseSoft} weight={600} />
        </g>
    </g>
);

const Podlogar = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const on = step >= 2;
    return (
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <line x1={384} x2={384} y1={12} y2={BASE + 150} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
            <SvgText x={404} y={22} text="Podlogar 2022 · ciclistas" size={16} color="#F3F4F6" weight={800} />
            <SvgText x={404} y={44} text="g/min, 120–180 min" size={16} color={C.muted} weight={600} />
            <line x1={420} x2={630} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            {on && PODL.map((d, i) => (
                <g key={d.gh}>
                    <motion.rect x={PX[i] - BW / 2} y={sy(d.endo)} width={BW} height={h(d.endo)} rx={4} fill={C.glycogen} {...grow(reduce, stagger(i, 0.1, 0.12))} />
                    <motion.rect x={PX[i] - BW / 2} y={sy(d.endo + d.exo)} width={BW} height={h(d.exo)} rx={4} fill={C.glucose}
                        initial={reduce ? false : { opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, delay: stagger(i, 0.5, 0.15), ease: EASE_OUT }} />
                    <SvgText x={PX[i]} y={sy(d.endo) + h(d.endo) / 2 + 6} text={br(d.endo, 2)} size={18} anchor="middle" color="#FFFFFF" weight={800} />
                    <SvgText x={PX[i]} y={sy(d.endo + d.exo) + h(d.exo) / 2 + 6} text={br(d.exo, 2)} size={18} anchor="middle" color="#FFFFFF" weight={800} />
                    <SvgText x={PX[i]} y={BASE + 22} text={`${d.gh} g/h`} size={17} anchor="middle" color="#FFFFFF" weight={800} />
                    <SvgText x={PX[i]} y={BASE + 42} text={d.ratio} size={16} anchor="middle" color={C.muted} weight={600} />
                </g>
            ))}
            <SvgText x={(PX[0] + PX[1]) / 2} y={BASE + 62} text="maltodextrina:frutose" size={16} anchor="middle" color={C.muted} weight={600} />
            <SvgText x={630} y={BASE + 86} text="exógena p = 0,026" size={16} anchor="end" color={C.glucoseSoft} weight={800} />
            <SvgText x={630} y={BASE + 108} text="endógena igual" size={16} anchor="end" color={C.glycogenSoft} weight={800} />
            <SvgText x={630} y={BASE + 127} text="p = 0,786" size={16} anchor="end" color={C.glycogenSoft} weight={700} />
            <rect x={404} y={BASE + 140} width={14} height={14} rx={3} fill={C.glycogen} />
            <SvgText x={424} y={BASE + 153} text="endógena (estoque)" size={16} color={C.glycogenSoft} weight={600} />
        </motion.g>
    );
};

const Stage = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${STAGE_INNER_W} ${STAGE_INNER_H}`} width="100%" height="100%" className="block" role="img"
            aria-label="Oxidação de carboidrato com 60, 90 e 120 g/h em maratonistas e endógena × exógena com 90 e 120 g/h em ciclistas">
            <defs>
                <marker id="hd-head" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill={C.ok} />
                </marker>
            </defs>
            <Ravikanti step={step} reduce={reduce} />
            <Podlogar step={step} reduce={reduce} />
        </svg>
    );
};

export default function HighDoseSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <PaFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="highdose-tabs"
            chips={<DesignChip>{s.design}</DesignChip>}
            stage={<Stage step={step} />}
            panel={<PaSide step={step} color={s.color} headline={s.headline} text={s.text} lessons={LESSONS}
                source={sourcesUpTo(STEPS.map(t => t.sources), step)} />} />
    );
}
