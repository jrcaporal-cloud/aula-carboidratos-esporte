import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { BARS_1995, DUMB_AXIS, DUMBBELLS, ENERGY, GRID, TEXT } from './womenLoading.content';

/**
 * Os quatro quadros do slide 83 (grade 2 × 2 que acumula): barras de 1995 → energia (ilustrativa) →
 * halteres de James 2001 → grade sim/não de Tarnopolsky 2001. Cada um cabe num quadro de ~300 × 150.
 */
const TRACK = 'rgba(255,255,255,0.08)';
const BAR_H = 80;

export const Bars1995 = () => (
    <div className="flex h-full items-end justify-around gap-4 px-2">
        {BARS_1995.groups.map((g, gi) => {
            const color = g.glycogen ? C.glycogen : C.stone;
            const soft = g.glycogen ? C.glycogenSoft : C.stone;
            const bars = [
                { who: TEXT.men, v: g.men, text: g.menText },
                { who: TEXT.women, v: g.women, text: g.womenText },
            ];
            return (
                <div key={g.label} className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-3 border-b-[3px] pb-0" style={{ borderColor: C.co2 }}>
                        {bars.map((b, bi) => (
                            <div key={b.who} className="flex w-[48px] flex-col items-center gap-1">
                                <CountUp text={b.text} delay={0.15 + gi * 0.2 + bi * 0.1} className="font-mono text-[18px] font-bold"
                                    style={{ color: b.v > 5 ? soft : C.risk }} />
                                <div className="relative w-full overflow-hidden rounded-t-md" style={{ height: Math.max(4, (b.v / BARS_1995.max) * BAR_H) }}>
                                    <Grow value={1} axis="y" color={b.v > 5 ? color : C.risk} delay={0.15 + gi * 0.2 + bi * 0.1} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        {bars.map(b => <span key={b.who} className="w-[48px] text-center text-[16px] font-semibold text-white">{b.who}</span>)}
                    </div>
                    <span className="text-[16px] text-gray-200">{g.label}</span>
                </div>
            );
        })}
    </div>
);

export const EnergyBlocks = () => (
    <div className="flex h-full flex-col justify-center gap-3 px-1">
        {ENERGY.map((e, i) => (
            <div key={e.label} className="flex items-center gap-3">
                <span className="w-[34px] text-[18px] font-semibold text-white">{e.label}</span>
                <div className="relative h-[40px] flex-1">
                    <motion.div className="absolute inset-y-0 left-0 overflow-hidden rounded-lg border-2"
                        style={{ width: `${e.width * 100}%`, borderColor: 'rgba(255,255,255,0.4)', background: TRACK }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: stagger(i), duration: DUR.enter }}>
                        <Grow value={0.75} color={C.glucose} delay={0.25 + i * 0.15} />
                    </motion.div>
                </div>
            </div>
        ))}
        <div className="flex items-center gap-2 pl-[46px]">
            <span className="h-4 w-4 rounded" style={{ background: C.glucose }} />
            <span className="text-[16px] text-gray-100">{TEXT.share}: {TEXT.lessGkg}</span>
        </div>
    </div>
);

const at = (v: number) => `${((v - DUMB_AXIS.min) / (DUMB_AXIS.max - DUMB_AXIS.min)) * 100}%`;

export const Dumbbells = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex h-full flex-col justify-center gap-2 px-1">
            {DUMBBELLS.map((d, i) => {
                const color = d.women ? C.glycogenSoft : C.stone;
                return (
                    <div key={d.label} className="grid grid-cols-[104px_1fr] items-center gap-2">
                        <span className="text-[16px] leading-tight text-gray-100">{d.label}</span>
                        <div className="relative h-[30px]">
                            <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2" style={{ background: TRACK }} />
                            <div className="absolute top-1/2 h-[6px] -translate-y-1/2" style={{ left: at(d.from), width: `calc(${at(d.to)} - ${at(d.from)})` }}>
                                <Grow value={1} color={color} delay={0.15 + i * 0.12} />
                            </div>
                            <span className="absolute top-1/2 -translate-x-full -translate-y-1/2 pr-3 font-mono text-[16px] text-gray-300" style={{ left: at(d.from) }}>{d.from}</span>
                            <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px]"
                                style={{ left: at(d.from), borderColor: color, background: '#04080F' }} />
                            <motion.span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{ left: at(d.to), background: color }}
                                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 + i * 0.12 + DUR.bar, duration: DUR.text }} />
                            <span className="absolute top-1/2 -translate-y-1/2 pl-3 font-mono text-[18px] font-bold" style={{ left: at(d.to), color }}>{d.to}</span>
                        </div>
                    </div>
                );
            })}
            <span className="text-[15px] text-gray-300">{DUMB_AXIS.unit}</span>
        </div>
    );
};

export const LoadGrid = () => (
    <div className="grid h-full grid-cols-[90px_1fr_1fr] content-center items-center gap-x-2 gap-y-2 px-1">
        <span />
        {GRID.cols.map(c => <span key={c} className="text-center text-[16px] font-semibold text-white">{c}</span>)}
        {GRID.rows.map((r, ri) => (
            <div key={r.label} className="contents">
                <span className="text-[17px] font-semibold text-white">{r.label}</span>
                {r.cells.map((yes, ci) => {
                    const color = yes ? C.ok : C.risk;
                    const Icon = yes ? Check : X;
                    return (
                        <motion.div key={GRID.cols[ci]} className="flex h-[46px] items-center justify-center gap-2 rounded-lg border-2"
                            style={{ borderColor: color }}
                            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: stagger(ri * 2 + ci, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                            <Icon size={24} color={color} strokeWidth={3} aria-hidden />
                            <span className="text-[17px] font-semibold" style={{ color }}>{yes ? GRID.yes : GRID.no}</span>
                        </motion.div>
                    );
                })}
            </div>
        ))}
    </div>
);
