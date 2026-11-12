import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import {
    BARS, BARS_MAX, BARS_TITLE, DUMB_AXIS, DUMBBELLS, ENERGY, ENERGY_TEXT, GRID,
} from './womenLoading.content';

/** Os quatro gráficos do slide 83, um por passo: barras → energia → halteres → grade sim/não. */

const TRACK_BG = 'rgba(255,255,255,0.06)';

export const GlycogenBars = () => (
    <div className="flex h-full flex-col gap-4 px-10 py-6">
        <span className="text-[20px] text-gray-200">{BARS_TITLE}</span>
        <div className="flex flex-1 items-end justify-center gap-24 border-b-[3px] pb-0" style={{ borderColor: C.co2 }}>
            {BARS.map((b, i) => (
                <div key={b.label} className="flex w-[150px] flex-col items-center gap-3">
                    <CountUp text={b.text} delay={0.1 + i * 0.12} className="font-display text-[64px] font-bold leading-none"
                        style={{ color: b.value > 0 ? C.glycogenSoft : C.risk }} />
                    <div className="relative w-full overflow-hidden rounded-t-xl" style={{ height: (b.value / BARS_MAX) * 250 }}>
                        <Grow value={1} axis="y" color={C.glycogen} delay={0.1 + i * 0.12} />
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-center gap-24">
            {BARS.map(b => <span key={b.label} className="w-[150px] text-center text-[22px] font-semibold text-white">{b.label}</span>)}
        </div>
    </div>
);

export const EnergyBlocks = () => (
    <div className="flex h-full flex-col justify-center gap-8 px-10">
        <span className="text-[20px] text-gray-200">{ENERGY_TEXT.title}</span>
        {ENERGY.map((e, i) => (
            <div key={e.label} className="flex items-center gap-5">
                <span className="w-[56px] text-[24px] font-semibold text-white">{e.label}</span>
                <div className="relative h-[72px] flex-1">
                    <motion.div className="absolute inset-y-0 left-0 overflow-hidden rounded-xl border-2"
                        style={{ width: `${e.width * 100}%`, borderColor: 'rgba(255,255,255,0.35)', background: TRACK_BG }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: stagger(i), duration: DUR.enter }}>
                        <Grow value={0.75} color={C.glucose} delay={0.25 + i * 0.15} />
                    </motion.div>
                </div>
            </div>
        ))}
        <div className="flex items-center gap-3 pl-[76px]">
            <span className="h-5 w-5 rounded" style={{ background: C.glucose }} />
            <span className="text-[20px] text-gray-100">{ENERGY_TEXT.share}</span>
        </div>
    </div>
);

const at = (v: number) => `${((v - DUMB_AXIS.min) / (DUMB_AXIS.max - DUMB_AXIS.min)) * 100}%`;

export const Dumbbells = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex h-full flex-col justify-center gap-7 px-10">
            {DUMBBELLS.map((d, i) => {
                const color = d.women ? C.glycogenSoft : C.stone;
                return (
                    <div key={d.label} className="flex flex-col gap-1.5">
                        <span className="text-[20px] text-gray-100">{d.label}</span>
                        <div className="relative h-[40px]">
                            <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2" style={{ background: TRACK_BG }} />
                            <div className="absolute top-1/2 h-[6px] -translate-y-1/2" style={{ left: at(d.from), width: `calc(${at(d.to)} - ${at(d.from)})` }}>
                                <Grow value={1} color={color} delay={0.15 + i * 0.12} />
                            </div>
                            <span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px]"
                                style={{ left: at(d.from), borderColor: color, background: '#04080F' }} />
                            <motion.span className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{ left: at(d.to), background: color }}
                                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 + i * 0.12 + DUR.bar, duration: DUR.text }} />
                            <span className="absolute top-1/2 -translate-y-1/2 pl-5 font-mono text-[22px] font-bold"
                                style={{ left: at(d.to), color }}>{d.to}</span>
                            <span className="absolute top-1/2 -translate-x-full -translate-y-1/2 pr-5 font-mono text-[20px] text-gray-300"
                                style={{ left: at(d.from) }}>{d.from}</span>
                        </div>
                    </div>
                );
            })}
            <span className="text-[17px] text-gray-300">{DUMB_AXIS.unit}</span>
        </div>
    );
};

export const LoadGrid = () => (
    <div className="flex h-full flex-col justify-center gap-5 px-10">
        <span className="text-[20px] text-gray-200">{GRID.title}</span>
        <div className="grid grid-cols-[160px_1fr_1fr] items-center gap-x-4 gap-y-4">
            <span />
            {GRID.cols.map(c => <span key={c} className="text-center text-[20px] font-semibold text-white">{c}</span>)}
            {GRID.rows.map((r, ri) => (
                <div key={r.label} className="contents">
                    <span className="text-[24px] font-semibold text-white">{r.label}</span>
                    {r.cells.map((yes, ci) => {
                        const color = yes ? C.ok : C.risk;
                        const Icon = yes ? Check : X;
                        return (
                            <motion.div key={ci} className="flex h-[84px] items-center justify-center gap-3 rounded-xl border-2"
                                style={{ borderColor: color }}
                                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: stagger(ri * 2 + ci, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                                <Icon size={34} color={color} strokeWidth={3} aria-hidden />
                                <span className="text-[24px] font-semibold" style={{ color }}>{yes ? GRID.yes : GRID.no}</span>
                            </motion.div>
                        );
                    })}
                </div>
            ))}
        </div>
    </div>
);
