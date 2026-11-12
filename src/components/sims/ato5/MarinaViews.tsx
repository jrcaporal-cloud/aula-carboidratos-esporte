import { motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { br } from '../kit/format';
import {
    BREAKFAST, breakfastTotal, choOf, DAY_FOODS, DAY_TOTAL, dayTotal, GAUGE, KG, PASTA, TEXT,
} from './marinaPlan.content';

/** As vistas do slide 87: régua g/kg (passos 1–2), pilha de comida (3) e o café da largada (4). */

const pctOf = (gkg: number) => (gkg / GAUGE.max) * 100;

/** Régua de g/kg com a faixa da carga; o marcador desliza (x em cqw) do prato de macarrão para a meta. */
export const GaugeView = ({ target }: { target: boolean }) => {
    const reduce = useReducedMotion();
    const pastaGkg = choOf(PASTA) / KG;
    const value = target ? DAY_TOTAL / KG : pastaGkg;
    return (
        <div className="flex h-full flex-col justify-center gap-8 px-10">
            <div className="flex items-end gap-6">
                {target ? (
                    <>
                        <CountUp key="t" text={`${DAY_TOTAL} g`} className="font-display text-[88px] font-bold leading-none" style={{ color: C.glucose }} />
                        <div className="flex flex-col pb-2">
                            <span className="text-[24px] font-semibold text-white">{TEXT.perDay}</span>
                            <span className="font-mono text-[20px] text-gray-200">{TEXT.calc}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <CountUp key="p" text={`${Math.round(choOf(PASTA))} g`} className="font-display text-[88px] font-bold leading-none" style={{ color: C.glucoseSoft }} />
                        <div className="flex flex-col pb-2">
                            <span className="text-[24px] font-semibold text-white">{PASTA.name}, {PASTA.grams} g</span>
                            <span className="font-mono text-[20px] text-gray-200">{TEXT.pastaCaption} · {br(pastaGkg)} g/kg</span>
                        </div>
                    </>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <div className="relative h-[56px] w-full [container-type:inline-size]">
                    <div className="absolute inset-y-[14px] left-0 right-0 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    <div className="absolute inset-y-[14px] rounded-full" style={{ left: `${pctOf(GAUGE.band[0])}%`, right: 0, background: 'rgba(245,158,11,0.35)' }} />
                    <motion.div className="absolute left-0 top-0 h-full w-0" initial={false}
                        animate={{ x: `${pctOf(value)}cqw` }} transition={{ duration: reduce ? 0 : 0.9, ease: EASE_IN_OUT }}>
                        <span className="absolute left-0 top-0 h-full w-[8px] -translate-x-1/2 rounded-full" style={{ background: C.glucose }} />
                    </motion.div>
                </div>
                <div className="relative h-[24px] w-full">
                    {GAUGE.ticks.map(t => {
                        const edge = t === 0 ? '' : t === GAUGE.max ? '-translate-x-full' : '-translate-x-1/2';
                        return (
                            <span key={t} className={`absolute font-mono text-[18px] text-gray-300 ${edge}`} style={{ left: `${pctOf(t)}%` }}>{t}</span>
                        );
                    })}
                </div>
                <div className="flex justify-between text-[18px]">
                    <span className="text-gray-300">{TEXT.gauge}</span>
                    <span style={{ color: C.glucoseSoft }}>{GAUGE.bandLabel} {GAUGE.band[0]}–{GAUGE.band[1]}</span>
                </div>
            </div>
        </div>
    );
};

const STACK_H = 330;
const STACK_MAX = 600;
const shade = (i: number) => (i % 2 === 0 ? C.glucose : C.glucoseSoft);

export const FoodStack = () => {
    const total = dayTotal();
    return (
        <div className="flex h-full items-center gap-8 px-8">
            <div className="flex h-[330px] w-[86px] flex-col-reverse gap-[2px]">
                {DAY_FOODS.map((f, i) => (
                    <div key={f.name} className="relative w-full overflow-hidden" style={{ height: (choOf(f) / STACK_MAX) * STACK_H }}>
                        <Grow value={1} axis="y" color={shade(i)} delay={stagger(i, 0.05, 0.07)} />
                    </div>
                ))}
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
                {DAY_FOODS.map((f, i) => (
                    <motion.div key={f.name} className="flex items-baseline gap-3"
                        initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: stagger(i, 0.05, 0.07), duration: DUR.enter, ease: EASE_OUT }}>
                        <span className="h-4 w-4 shrink-0 self-center rounded" style={{ background: shade(i) }} />
                        <span className="flex-1 text-[20px] text-gray-100">{f.name} <span className="font-mono text-gray-300">{f.grams} g</span></span>
                        <span className="w-[56px] text-right font-mono text-[20px] font-bold text-white">{Math.round(choOf(f))}</span>
                    </motion.div>
                ))}
            </div>
            <div className="flex w-[190px] flex-col gap-1">
                <CountUp text={`${Math.round(total)} g`} delay={0.5} className="font-display text-[64px] font-bold leading-none" style={{ color: C.glucose }} />
                <span className="text-[20px] text-gray-100">{TEXT.stackUnit} · {br(total / KG)} g/kg</span>
            </div>
        </div>
    );
};

export const BreakfastView = () => {
    const total = breakfastTotal();
    return (
        <div className="flex h-full flex-col justify-center gap-6 px-10">
            <span className="text-[22px] font-semibold text-white">{TEXT.breakfastTitle}</span>
            <div className="flex items-center gap-3">
                {BREAKFAST.map((f, i) => (
                    <div key={f.name} className="contents">
                        {i > 0 && <Plus size={26} color={C.muted} aria-hidden />}
                        <motion.div className="flex flex-1 flex-col gap-1 rounded-xl border-2 px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.22)' }}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: stagger(i, 0.05, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
                            <span className="text-[22px] font-semibold text-white">{f.name}</span>
                            <span className="font-mono text-[18px] text-gray-300">{f.grams} g</span>
                            <span className="font-mono text-[24px] font-bold" style={{ color: C.glucoseSoft }}>{Math.round(choOf(f))} g</span>
                        </motion.div>
                    </div>
                ))}
            </div>
            <div className="flex items-baseline gap-4">
                <CountUp text={`${Math.round(total)} g`} delay={0.45} className="font-display text-[64px] font-bold leading-none" style={{ color: C.glucose }} />
                <span className="text-[22px] text-gray-100">≈ {br(total / KG)} g/kg</span>
                <span className="ml-auto text-[20px]" style={{ color: C.caveat }}>{TEXT.during}</span>
            </div>
        </div>
    );
};
