import { motion, useReducedMotion } from 'framer-motion';
import { Bike, CupSoda } from 'lucide-react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow, Wipe } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { signed } from '../kit/format';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { DecideSlot } from './DecideShell';
import { AXIS, CONTRASTS, TOLD } from './placebo.content';

/**
 * Palco do slide 187 (O Placebo que Pedalou Mais). Três colunas = o que cada grupo ouviu; em cada uma, os dois copos
 * do fatorial (carboidrato e placebo). As colunas viram barras de potência; embaixo, a comparação que decide:
 * a crença (+3,8%) contra o carboidrato que estava no copo (−0,3%), no mesmo eixo, com a faixa provável de 95%.
 */

const BARS_H = 150;
const ZERO = 122;
const PX_PER_PCT = 18;

const Header = () => (
    <div className="grid grid-cols-3 gap-3">
        {TOLD.map(t => (
            <div key={t.id} className="flex items-center justify-center gap-2">
                <Bike size={26} strokeWidth={2.4} color={t.id === 'cho' ? C.glucose : C.co2} aria-hidden />
                <span className="text-[19px] font-semibold text-white">{t.label}</span>
            </div>
        ))}
    </div>
);

const Bars = () => (
    <div className="relative grid grid-cols-3 gap-3" style={{ height: BARS_H }}>
        <div className="absolute left-0 right-0 h-[3px] bg-white/55" style={{ top: ZERO }} />
        <span className="absolute left-1 text-[15px] text-gray-300" style={{ top: ZERO + 6 }}>0%</span>
        {TOLD.map((t, i) => {
            const h = Math.abs(t.change) * PX_PER_PCT;
            const up = t.change >= 0;
            const delay = stagger(i, 0.1, 0.15);
            return (
                <div key={t.id} className="relative">
                    <div className="absolute left-1/2 w-[110px] -translate-x-1/2 overflow-hidden rounded-md"
                        style={up ? { top: ZERO - h, height: h } : { top: ZERO + 3, height: h }}>
                        <Grow value={1} axis="y" color={t.id === 'cho' ? C.stone : C.co2} delay={delay}
                            style={up ? undefined : { transformOrigin: 'center top' }} />
                    </div>
                    <span className="absolute left-1/2 flex -translate-x-1/2 items-baseline gap-2 whitespace-nowrap"
                        style={{ top: ZERO - (up ? h : 0) - 40 }}>
                        <CountUp text={`${signed(t.change, 1)}%`} delay={delay} className="font-display text-[30px] font-bold leading-none text-white" />
                        <span className="text-[15px] text-gray-300">± {t.sd}</span>
                    </span>
                </div>
            );
        })}
    </div>
);

/** O fatorial: em cada coluna (o que ouviu), metade bebeu carboidrato e metade placebo. */
const Cups = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1">
            <div className="grid grid-cols-3 gap-3">
                {TOLD.map((t, c) => (
                    <div key={t.id} className="flex items-center justify-center gap-6 rounded-xl border-2 border-white/15 py-0.5">
                        {[C.glucose, C.co2].map((color, r) => (
                            <motion.span key={color} className="flex"
                                initial={reduce ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: stagger(c * 2 + r, 0.1, 0.06), duration: DUR.enter, ease: EASE_OUT }}>
                                <CupSoda size={28} strokeWidth={2.4} color={color} aria-hidden />
                            </motion.span>
                        ))}
                    </div>
                ))}
            </div>
            <span className="text-center text-[15px] text-gray-200">
                em cada coluna, metade bebeu <b style={{ color: C.glucoseSoft }}>carboidrato</b> e metade <b style={{ color: C.co2 }}>placebo</b>, sem saber qual
            </span>
        </div>
    );
};

const PLOT_X0 = 236;
const PLOT_W = 410;
const xOf = (v: number) => PLOT_X0 + ((v - AXIS.min) / (AXIS.max - AXIS.min)) * PLOT_W;

/** Comparação no mesmo eixo: estimativa (quadrado) e faixa provável de 95% (traço). */
const Forest = ({ step }: { step: number }) => (
    <div className="relative h-full">
        {/* eixo e zero */}
        <div className="absolute bottom-[22px] h-[2px] bg-white/40" style={{ left: PLOT_X0, width: PLOT_W }} />
        <div className="absolute top-[18px] w-[3px] bg-white/60" style={{ left: xOf(0) - 1, bottom: 22 }} />
        <span className="absolute bottom-0 left-0 text-[15px] text-gray-300">potência, faixa provável de 95%</span>
        {AXIS.ticks.map(t => (
            <span key={t} className="absolute bottom-0 -translate-x-1/2 text-[15px] tabular-nums text-gray-300" style={{ left: xOf(t) }}>
                {signed(t, 0)}%
            </span>
        ))}
        {CONTRASTS.map((c, i) => {
            const top = i * 52;
            const on = step >= c.at;
            const range = `${signed(c.lo, 1)} a ${signed(c.hi, 1)}`;
            return (
                <div key={c.id} className="absolute left-0 right-0" style={{ top, height: 50 }}>
                    <span className="absolute left-0 top-[6px] flex flex-col leading-tight" style={{ width: PLOT_X0 - 12 }}>
                        <span className="text-[19px] font-bold" style={{ color: c.color }}>{c.label}</span>
                        <span className="text-[15px] text-gray-300">{c.detail}</span>
                    </span>
                    {on && (
                        <Wipe from="left" className="absolute inset-0">
                            <div className="absolute top-[34px] h-[6px] rounded" style={{ left: xOf(c.lo), width: xOf(c.hi) - xOf(c.lo), background: c.color }} />
                            <div className="absolute top-[27px] h-[20px] w-[20px] -translate-x-1/2 rounded-[3px] border-[3px] border-[#04080F]"
                                style={{ left: xOf(c.est), background: c.color }} />
                            <span className="absolute top-0 flex -translate-x-1/2 items-baseline gap-2 whitespace-nowrap rounded-md bg-[#060D18] px-1.5 tabular-nums" style={{ left: xOf(c.est) }}>
                                <span className="text-[20px] font-bold" style={{ color: c.color }}>
                                    {c.id === 'drink' ? <KeyFact color={C.glucose} delay={0.5}>{signed(c.est, 1)}%</KeyFact> : `${signed(c.est, 1)}%`}
                                </span>
                                <span className="text-[15px] text-gray-300">({range})</span>
                            </span>
                        </Wipe>
                    )}
                </div>
            );
        })}
    </div>
);

export const PlaceboStage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-1.5 p-3">
        <Header />
        <div className="relative" style={{ height: BARS_H }}>
            {step === 0 ? <DecideSlot label="mudança na potência (%)" /> : <Bars />}
        </div>
        <Cups />
        <div className="relative min-h-0 flex-1">
            {step === 0 ? <DecideSlot label="crença × carboidrato" /> : <Forest step={step} />}
        </div>
    </div>
);
