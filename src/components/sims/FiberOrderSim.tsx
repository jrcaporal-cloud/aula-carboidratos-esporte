import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { InfoPanel, Ledger, ShellA } from './ato4/shellA';
import { DEPLETION, FIBER_LEDGER, FIBER_STEPS, FIBER_VB, FIBERS, type Fiber } from './ato4/fiber.content';

/**
 * Slide 64 · Gollnick 1974 como duas lâminas lado a lado (cortes seriados do mesmo fragmento): à esquerda a ATPase
 * diz o tipo de cada fibra, à direita o PAS diz quem ainda tem glicogênio. O passador (ou os botões de intensidade,
 * para a turma votar antes) sobe de 31% a > 100% do VO₂máx; as barras 1 · 2,7 · 7,4 se acumulam embaixo.
 */

const SEC_W = 276;
const SCALE = SEC_W / FIBER_VB.w;
/** PAS em três tons (cheia, parcial, vazia): meio-tom contínuo vira lama no codec da chamada. */
const stain = (left: number) => (left >= 0.66 ? 1 : left >= 0.33 ? 0.45 : 0);

const Section = ({ x, kind, step, reduce }: { x: number; kind: 'atp' | 'pas'; step: number; reduce: boolean }) => (
    <g transform={`translate(${x} 30) scale(${SCALE})`}>
        <ellipse cx={FIBER_VB.w / 2} cy={FIBER_VB.h / 2} rx={FIBER_VB.w / 2 - 4} ry={FIBER_VB.h / 2 - 4}
            fill={kind === 'atp' ? '#64748B' : '#D9D3E2'} />
        {FIBERS.map((f: Fiber, i) => (kind === 'atp'
            ? <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={f.type === 'I' ? '#E7E5E4' : '#1F2937'} />
            : (
                <g key={i}>
                    <circle cx={f.x} cy={f.y} r={f.r} fill="#F4F1F7" />
                    <motion.circle cx={f.x} cy={f.y} r={f.r} fill={C.glycogen} initial={false} animate={{ opacity: stain(f.left[step]) }}
                        transition={{ duration: reduce ? 0 : DUR.draw, delay: reduce ? 0 : (i % 7) * 0.04, ease: EASE_OUT }} />
                </g>
            )))}
    </g>
);

const Slides = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <svg viewBox="0 0 640 262" width={640} height={262} className="block" role="img"
        aria-label="Dois cortes seriados do mesmo fragmento: ATPase mostra o tipo da fibra, PAS mostra o glicogênio que sobra">
        <SvgText x={14} y={22} text="ATPase: o tipo da fibra" size={17} weight={700} color={C.stone} />
        <SvgText x={334} y={22} text="PAS: o glicogênio" size={17} weight={700} color={C.glycogenSoft} />
        <Section x={20} kind="atp" step={step} reduce={reduce} />
        <Section x={340} kind="pas" step={step} reduce={reduce} />
        <rect x={14} y={244} width={16} height={16} fill="#E7E5E4" />
        <SvgText x={36} y={258} text="lenta (I)" size={16} color={C.stone} />
        <rect x={120} y={244} width={16} height={16} fill="#1F2937" stroke={C.co2} strokeWidth={2} />
        <SvgText x={142} y={258} text="rápida (II)" size={16} color={C.stone} />
        <rect x={334} y={244} width={16} height={16} fill={C.glycogen} />
        <SvgText x={356} y={258} text="cheia" size={16} color={C.stone} />
        <rect x={420} y={244} width={16} height={16} fill="#F4F1F7" />
        <SvgText x={442} y={258} text="vazia" size={16} color={C.stone} />
        <rect x={500} y={244} width={16} height={16} fill="#F4F1F7" />
        <rect x={500} y={244} width={16} height={16} fill={C.glycogen} fillOpacity={0.45} />
        <SvgText x={522} y={258} text="parcial" size={16} color={C.stone} />
    </svg>
);

const Intensity = ({ step, onPick }: { step: number; onPick: (s: number) => void }) => (
    <div className="flex items-center gap-2" role="group" aria-label="Intensidade, % do VO₂máx">
        {FIBER_STEPS.slice(1).map((s, i) => {
            const on = step === i + 1;
            return (
                <button key={s.tab} type="button" onClick={() => onPick(i + 1)} aria-pressed={on}
                    className="cursor-pointer rounded-xl border-2 px-3.5 py-1 font-display text-[20px] font-semibold transition-colors duration-200"
                    style={{ borderColor: on ? C.glycogenSoft : 'rgba(255,255,255,0.22)', color: on ? '#fff' : C.muted, background: on ? 'rgba(139,92,246,0.3)' : 'transparent' }}>
                    {s.tab}
                </button>
            );
        })}
        <span className="ml-1 text-[17px] text-gray-300">do VO₂máx</span>
    </div>
);

/** Esvaziamento relativo a 31%: barras na escala real (1 · 2,7 · 7,4), uma por passo, e ficam. */
const Depletion = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[16px] text-gray-300">esvaziamento em relação a 31% do VO₂máx</span>
            {DEPLETION.map(d => {
                const on = step >= d.at;
                return (
                    <motion.div key={d.label} className="flex items-center gap-3" initial={false} animate={{ opacity: on ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : DUR.enter }}>
                        <span className="w-[44px] text-right text-[17px] font-semibold text-gray-100">{d.label}</span>
                        <div className="relative h-[20px] w-[400px]">
                            <div className="absolute inset-y-0 left-0 overflow-hidden rounded" style={{ width: `${(d.ratio / 7.4) * 100}%` }}>
                                {on && <Grow value={1} color={C.glycogen} />}
                            </div>
                        </div>
                        {on && <CountUp text={d.text} className="font-display text-[22px] font-bold" style={{ color: C.glycogenSoft }} delay={0.2} duration={0.6} />}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default function FiberOrderSim() {
    const { step, setStep } = useSlideSteps(FIBER_STEPS.length);
    const s = FIBER_STEPS[step];
    const reduce = useReducedMotion() ?? false;
    return (
        <ShellA tabs={FIBER_STEPS.map(f => f.tab)} step={step} onSelect={setStep} layoutId="fiber-tabs"
            chips={<>
                <DesignChip>J Physiol 1974 · PAS + ATPase · ciclismo</DesignChip>
                <IllustrativeChip>mosaico ilustrativo</IllustrativeChip>
            </>}>
            <Panel className="flex shrink-0 flex-col gap-2 pb-3">
                <Slides step={step} reduce={reduce} />
                <div className="flex flex-col gap-2 px-4">
                    <Intensity step={step} onPick={setStep} />
                    <Depletion step={step} />
                </div>
            </Panel>
            <InfoPanel step={step} color={s.color} headline={s.headline} text={s.text}
                source={sourcesUpTo(FIBER_STEPS.map(f => f.sources), step)}>
                <Ledger rows={FIBER_LEDGER} step={step} labelWidth={64} />
            </InfoPanel>
        </ShellA>
    );
}
