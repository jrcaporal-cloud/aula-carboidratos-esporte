import { motion, useReducedMotion } from 'framer-motion';
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Ledger, LoadingFrame, LoadingPanel } from './ato5/LoadingFrame';
import {
    AXIS_MAX, BURKE, HAWLEY, LEDGER, MCLAY, SHERMAN, SPLIT, STEPS, TEXT, TICKS, type NullPin,
} from './ato5/loadingGain.content';

/**
 * Slide 82 · Quanto a Carga Rende, palco + painel. O palco é a régua da duração da parte medida (0–180 min), partida
 * em 90: à esquerda caem os nulos de prova curta (McLay, Sherman); à direita, a estimativa de Hawley (2–3% contra os
 * famosos 20%, que são de tempo até a exaustão) e o teste com placebo de Burke, que dá nulo mesmo acima de 90 min.
 */
const W = 640;
const BAND_Y = 326;
const AXIS_Y = 362;
const CARD_BG = '#0B1220';
const ACCENT = [C.stone, C.glucose, C.text, C.glycogenSoft] as const;
const x = (min: number) => (min / AXIS_MAX) * W;

const Show = ({ on, className = '', style, children }: { on: boolean; className?: string; style?: CSSProperties; children: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className={`absolute ${className}`} style={style} initial={false}
            animate={{ opacity: on ? 1 : 0, y: on || reduce ? 0 : -10 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};

const Stem = ({ at, top, on, color = 'rgba(231,229,228,0.55)' }: { at: number; top: number; on: boolean; color?: string }) => (
    <motion.span className="absolute w-[3px] -translate-x-1/2" style={{ left: x(at), top, height: BAND_Y - top, background: color }}
        initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter }} />
);

const NullCard = ({ pin }: { pin: NullPin }) => (
    <div className="flex flex-col rounded-xl border-2 px-4 py-2" style={{ background: CARD_BG, borderColor: 'rgba(231,229,228,0.5)' }}>
        <div className="flex items-baseline justify-between gap-2">
            <span className="text-[16px] text-gray-300">{pin.title}</span>
            <span className="font-mono text-[17px] font-bold" style={{ color: C.stone }}>{TEXT.nil}</span>
        </div>
        <span className="text-[22px] font-semibold leading-tight text-white">{pin.result}</span>
        <span className="text-[16px] text-gray-300">{pin.detail}</span>
    </div>
);

const HawleyBlock = ({ on }: { on: boolean }) => (
    <div className="flex flex-col gap-1 rounded-xl border-2 px-4 py-2" style={{ background: CARD_BG, borderColor: C.glucose }}>
        <span className="text-[16px] font-semibold text-white">{HAWLEY.title}</span>
        {HAWLEY.rows.map((r, i) => (
            <div key={r.label} className="flex flex-col gap-0.5">
                <div className="flex items-baseline justify-between">
                    <span className="text-[16px] leading-tight text-gray-200">{r.label}</span>
                    {on && <CountUp text={r.text} delay={0.2 + i * 0.15} className="whitespace-nowrap font-display text-[22px] font-bold leading-none" style={{ color: r.tt ? C.glucose : C.stone }} />}
                </div>
                <div className="relative h-[12px] overflow-hidden rounded-full bg-white/10">
                    {on && <Grow value={r.value / HAWLEY.max} color={r.tt ? C.glucose : C.stone} delay={0.2 + i * 0.15} />}
                </div>
            </div>
        ))}
    </div>
);

const BurkeCard = ({ why }: { why: boolean }) => (
    <div className="flex flex-col gap-0.5 rounded-xl border-2 px-4 py-2" style={{ background: CARD_BG, borderColor: C.text }}>
        <div className="flex items-baseline justify-between">
            <span className="text-[17px] font-semibold text-white">{BURKE.title}</span>
            <span className="font-mono text-[17px] font-bold" style={{ color: C.stone }}>{TEXT.nil}</span>
        </div>
        <div className="grid grid-cols-[1fr_64px_64px] items-baseline gap-x-2">
            <span className="font-mono text-[15px] text-gray-300">{BURKE.p}</span>
            <span className="text-right text-[15px] font-semibold" style={{ color: C.glucoseSoft }}>9 g/kg</span>
            <span className="text-right text-[15px] text-gray-300">6 g/kg</span>
            {BURKE.rows.map(r => {
                const on = !r.why || why;
                return (
                    <Fragment key={r.label}>
                        <motion.span className="text-[16px] text-gray-200" initial={false} animate={{ opacity: on ? 1 : 0 }}>{r.label}</motion.span>
                        <motion.span className="text-right font-mono text-[19px] font-bold" style={{ color: r.why ? C.glycogenSoft : '#FFFFFF' }}
                            initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ delay: r.why && on ? 0.2 : 0 }}>{r.a}</motion.span>
                        <motion.span className="text-right font-mono text-[19px] font-bold" style={{ color: r.why ? C.glycogen : '#D1D5DB' }}
                            initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ delay: r.why && on ? 0.3 : 0 }}>{r.b}</motion.span>
                    </Fragment>
                );
            })}
        </div>
        <motion.span className="text-[16px] font-semibold" style={{ color: C.glucoseSoft }} initial={false} animate={{ opacity: why ? 1 : 0 }}
            transition={{ delay: why ? 0.45 : 0 }}>{BURKE.both}</motion.span>
    </div>
);

const Ruler = ({ step }: { step: number }) => (
    <div className="relative mx-5 mt-1" style={{ width: W, height: 396 }}>
        <span className="absolute w-[3px] -translate-x-1/2" style={{ left: x(SPLIT), top: 0, height: AXIS_Y, background: 'rgba(255,255,255,0.3)' }} />
        <Stem at={SHERMAN.at} top={100} on />
        <Stem at={MCLAY.at} top={220} on />
        <Stem at={BURKE.at} top={316} on={step >= 2} color={C.text} />
        <Show on className="left-0 top-0 w-[304px]"><NullCard pin={SHERMAN} /></Show>
        <Show on className="left-0 top-[118px] w-[262px]"><NullCard pin={MCLAY} /></Show>
        <Show on={step >= 1} className="left-[110px] top-[250px] w-[160px]">
            <p className="m-0 text-[16px] leading-snug text-gray-300">{TEXT.short}</p>
        </Show>
        <Show on={step >= 1} className="top-0 w-[300px]" style={{ left: x(SPLIT) + 14 }}><HawleyBlock on={step >= 1} /></Show>
        <Show on={step >= 2} className="top-[124px] w-[300px]" style={{ left: x(SPLIT) + 14 }}><BurkeCard why={step >= 3} /></Show>

        <motion.div className="absolute flex items-center justify-center rounded-md border-2" initial={false}
            style={{ left: x(60), width: x(30), top: BAND_Y, height: 32, borderColor: C.stone }}
            animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <span className="text-[16px] font-semibold" style={{ color: C.stone }}>{TEXT.noGain}</span>
        </motion.div>
        <motion.div className="absolute flex items-center justify-center rounded-md" initial={false}
            style={{ left: x(SPLIT) + 3, width: x(90) - 3, top: BAND_Y, height: 32, background: C.glucose }}
            animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.1 : 0 }}>
            <span className="text-[17px] font-bold text-[#04080F]">{TEXT.gain}</span>
        </motion.div>

        <span className="absolute left-0 right-0 h-[3px]" style={{ top: AXIS_Y, background: C.co2 }} />
        {TICKS.map(t => (
            <span key={t} className="absolute -translate-x-1/2 font-mono text-[16px] text-gray-300" style={{ left: x(t), top: AXIS_Y + 6 }}>{t}</span>
        ))}
        <span className="absolute right-0 text-[16px] leading-none text-gray-300" style={{ top: AXIS_Y + 26 }}>{TEXT.axis}</span>
    </div>
);

export default function LoadingGainSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const ledger = LEDGER.map(l => ({ ...l, color: l.strong ? C.glucose : C.stone }));
    return (
        <LoadingFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="loading-gain-tabs" stageWidth={680}
            chips={<DesignChip>{s.design}</DesignChip>}
            stage={<Ruler step={step} />}
            panel={
                <LoadingPanel step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                    source={sourcesUpTo(STEPS.map(t => t.source), step)}
                    ledger={<Ledger title={TEXT.ledger} items={ledger} step={step} />} />
            } />
    );
}
