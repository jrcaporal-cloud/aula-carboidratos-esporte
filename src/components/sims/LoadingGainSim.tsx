import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { Beat } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { AXIS_MAX, BEATS, BURKE, DESIGNS, HAWLEY, PINS, SOURCES, SPLIT, TEXT, TICKS } from './ato5/loadingGain.content';

/**
 * Slide 82 · Quanto a Carga Rende. Uma régua de duração (0–180 min) partida em 90: os estudos caem
 * no ponto da prova que mediram. À esquerda, nulos; à direita, a estimativa de Hawley; e então o
 * estudo com placebo de Burke cai DENTRO da zona "que rende" e também dá nulo.
 */
const AXIS_Y = 312;
const CARD_BG = '#0B1220';
const pct = (min: number) => `${(min / AXIS_MAX) * 100}%`;

const Stem = ({ at, top, color }: { at: number; top: number; color: string }) => (
    <span className="absolute w-[3px] -translate-x-1/2" style={{ left: pct(at), top, height: AXIS_Y - top, background: color }} />
);

const Appear = ({ show, children }: { show: boolean; children: ReactNode }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div initial={false} animate={{ opacity: show ? 1 : 0, y: show || reduce ? 0 : -14 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};

const NullCard = ({ title, result }: { title: string; result: string }) => (
    <div className="flex w-[236px] flex-col gap-1 rounded-xl border-2 px-4 py-3" style={{ background: CARD_BG, borderColor: 'rgba(231,229,228,0.5)' }}>
        <span className="text-[17px] text-gray-300">{title}</span>
        <span className="text-[24px] font-semibold text-white">{result}</span>
        <span className="font-mono text-[18px] font-bold" style={{ color: C.stone }}>{TEXT.nil}</span>
    </div>
);

const BurkeCard = ({ glycogen }: { glycogen: boolean }) => (
    <div className="flex w-[340px] flex-col gap-1 whitespace-nowrap rounded-xl border-2 px-4 py-2.5" style={{ background: CARD_BG, borderColor: C.text }}>
        <span className="text-[17px] text-gray-300">{BURKE.title}</span>
        {BURKE.rows.map(r => (
            <div key={r.label} className="grid grid-cols-[96px_1fr_64px] items-baseline gap-2">
                <span className="text-[18px] text-gray-200">{r.label}</span>
                <span className="font-mono text-[22px] font-bold text-white">{r.min}</span>
                <motion.span initial={false} animate={{ opacity: glycogen ? 1 : 0 }} transition={{ duration: DUR.text }}
                    className="text-right font-mono text-[22px] font-bold" style={{ color: C.glycogenSoft }}>{r.glycogen}</motion.span>
            </div>
        ))}
        <span className="text-[17px] text-gray-300">{glycogen ? `${BURKE.p} · ${BURKE.glycogenUnit}` : BURKE.p}</span>
    </div>
);

const Track = ({ step }: { step: number }) => (
    <div className="relative h-[368px] w-full">
        <div className="absolute left-0 top-0 rounded-l-xl" style={{ width: pct(SPLIT), height: AXIS_Y, background: 'rgba(255,255,255,0.03)' }} />
        <motion.div className="absolute top-0 rounded-r-xl" style={{ left: pct(SPLIT), right: 0, height: AXIS_Y, background: C.glucose }}
            initial={false} animate={{ opacity: step >= 1 ? 0.1 : 0.03 }} transition={{ duration: DUR.morph }} />
        <span className="absolute left-4 top-3 text-[20px] font-semibold text-gray-200">{TEXT.short}</span>
        <span className="absolute top-3 text-[20px] font-semibold" style={{ left: `calc(${pct(SPLIT)} + 16px)`, color: C.glucoseSoft }}>{TEXT.long}</span>
        <span className="absolute w-[3px] -translate-x-1/2" style={{ left: pct(SPLIT), top: 0, height: AXIS_Y, background: 'rgba(255,255,255,0.35)' }} />

        {PINS.map((p, i) => (
            <div key={p.id}>
                <Stem at={p.at} top={176} color="rgba(231,229,228,0.5)" />
                <div className="absolute" style={i === 0 ? { left: 14, top: 58 } : { right: `calc(${pct(AXIS_MAX - SPLIT)} + 14px)`, top: 58 }}>
                    <Appear show={step >= p.from}><NullCard title={p.title} result={p.result} /></Appear>
                </div>
            </div>
        ))}

        <motion.div className="absolute" style={{ left: `calc(${pct(SPLIT)} + 16px)`, top: 54 }}
            initial={false} animate={{ opacity: step === 1 ? 1 : step > 1 ? 0.6 : 0 }} transition={{ duration: DUR.enter }}>
            <CountUp text={HAWLEY.value} run={step >= 1} className="font-display text-[72px] font-bold leading-none" style={{ color: C.glucose }} />
            <motion.div initial={false} animate={{ opacity: step === 1 ? 1 : 0 }} transition={{ duration: DUR.text }}>
                <p className="m-0 text-[22px] text-white">{HAWLEY.caption}</p>
                <p className="m-0 text-[18px] text-gray-300">{HAWLEY.caveat}</p>
            </motion.div>
        </motion.div>

        {step >= 2 && <Stem at={BURKE.at} top={260} color={C.text} />}
        <div className="absolute" style={{ right: 14, top: 140 }}><Appear show={step >= 2}><BurkeCard glycogen={step >= 3} /></Appear></div>

        <span className="absolute left-0 right-0 h-[3px]" style={{ top: AXIS_Y, background: C.co2 }} />
        {TICKS.map(t => (
            <span key={t} className="absolute -translate-x-1/2 font-mono text-[16px] text-gray-300" style={{ left: pct(t), top: AXIS_Y + 8 }}>{t}</span>
        ))}
        <span className="absolute right-0 text-[16px] text-gray-300" style={{ top: AXIS_Y + 32 }}>{TEXT.axis}</span>
    </div>
);

export default function LoadingGainSim() {
    const { step } = useSlideSteps(BEATS.length);
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ maxHeight: 516 }}>
            <div className="flex min-h-[80px] items-start justify-between gap-6">
                <Beat beat={step} className="max-w-[860px] text-[28px] font-semibold leading-snug text-white">{BEATS[step]}</Beat>
                <Beat beat={DESIGNS[step]}><DesignChip>{DESIGNS[step]}</DesignChip></Beat>
            </div>
            <div className="rounded-2xl px-8 pt-4" style={PANEL_BG}>
                <Track step={step} />
            </div>
            <Source>{SOURCES[step]}</Source>
        </div>
    );
}
