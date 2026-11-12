import { motion, useReducedMotion } from 'framer-motion';
import { Check, Equal, Flag, Utensils } from 'lucide-react';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Grow, Wipe } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { Tank } from '../kit/Tank';
import { AIRD, COYLE, HOURS, PINS, SCHABORT, SHERMAN, STEP_HOUR } from './preMeal.content';

/**
 * Palco do slide 84: relógio regressivo (−4 h → largada) com cada estudo pendurado na hora em que comeram,
 * e um quadro 2 × 2 em que cada passo prega o cartão do estudo. Nada sai: o último passo mostra os quatro.
 */

const TRACK = 'rgba(255,255,255,0.08)';
const xOf = (hour: number) => `${((hour - HOURS[0]) / (HOURS[HOURS.length - 1] - HOURS[0])) * 100}%`;

const Timeline = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const activeHour = STEP_HOUR[step];
    return (
        <div className="relative h-[64px] w-full shrink-0">
            {PINS.map(p => {
                const shown = p.labels.filter(l => l.at <= step);
                const label = shown[shown.length - 1];
                if (!label) return null;
                const current = label.at === step;
                return (
                    <motion.div key={`${p.hour}-${label.text}`} className="absolute top-0 flex items-center gap-1.5 whitespace-nowrap text-[16px] font-semibold"
                        style={{ left: xOf(p.hour), color: current ? '#fff' : C.text }}
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, delay: current ? 0.15 : 0, ease: EASE_OUT }}>
                        <Utensils size={16} color={current ? C.glucose : C.muted} strokeWidth={2.5} aria-hidden />
                        {label.text}
                    </motion.div>
                );
            })}
            <span className="absolute left-0 right-0 top-[32px] h-[3px] rounded" style={{ background: C.co2 }} />
            {HOURS.map(h => {
                const hot = h === activeHour || (h === 0 && step === 3);
                return (
                    <div key={h} className="absolute top-[26px] flex flex-col items-center"
                        style={{ left: xOf(h), transform: h === HOURS[0] ? 'none' : h === 0 ? 'translateX(-100%)' : 'translateX(-50%)', alignItems: h === HOURS[0] ? 'flex-start' : h === 0 ? 'flex-end' : 'center' }}>
                        <span className="h-[15px] w-[15px] rounded-full border-[3px]"
                            style={{ background: hot ? C.glucose : '#04080F', borderColor: hot ? C.glucose : C.co2 }} />
                        <span className="mt-0.5 flex items-center gap-1 font-mono text-[16px] font-bold" style={{ color: hot ? '#fff' : C.muted }}>
                            {h === 0 ? <><Flag size={15} strokeWidth={3} aria-hidden />largada</> : `${h} h`}
                        </span>
                    </div>
                );
            })}
            {/* a refeição "cai" na hora do estudo do passo */}
            {!reduce && activeHour !== undefined && (
                <motion.span key={`drop-${step}`} className="absolute top-[26px] h-[15px] w-[15px] rounded-full"
                    style={{ left: xOf(activeHour), marginLeft: activeHour === HOURS[0] ? 0 : -7, background: C.glucose }}
                    initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: [0, 1, 1] }}
                    transition={{ duration: 0.5, ease: EASE_OUT }} />
            )}
        </div>
    );
};

const Tile = ({ title, color, at, step, children }: { title: string; color: string; at: number; step: number; children: ReactNode }) => (
    <div className="h-full min-h-0">
        {/* monta só quando o passo chega: as barras crescem e os números contam na hora do clique */}
        {step >= at && (
            <Wipe from="left" className="h-full">
                <div className="flex h-full flex-col gap-1 rounded-xl border-2 px-3 py-1.5"
                    style={{ borderColor: step === at ? color : 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-[16px] font-bold" style={{ color }}>{title}</span>
                    {children}
                </div>
            </Wipe>
        )}
    </div>
);

const CoyleTile = ({ step }: { step: number }) => (
    <Tile title={COYLE.title} color={C.glycogenSoft} at={0} step={step}>
        <div className="flex flex-1 items-end gap-4">
            <div className="flex items-end gap-3">
                {COYLE.tanks.map(t => (
                    <Tank key={t.label} level={t.level} label={t.label} width={30} height={60} active={t.level > 0.6} />
                ))}
            </div>
            <div className="flex flex-col gap-0.5 pb-1">
                <CountUp text={COYLE.value} delay={0.3} className="font-display text-[36px] font-bold leading-none" style={{ color: C.glycogenSoft }} />
                <span className="text-[16px] text-gray-100">{COYLE.caption}</span>
                <span className="text-[16px] text-gray-200">{COYLE.use}</span>
                <span className="text-[16px] text-gray-300">{COYLE.end}</span>
            </div>
        </div>
    </Tile>
);

const BAR_H = 48;

const ShermanTile = ({ step }: { step: number }) => (
    <Tile title={SHERMAN.title} color={C.glucose} at={1} step={step}>
        <div className="flex flex-1 items-end gap-4">
            <div className="flex flex-col gap-1">
                <div className="flex items-end gap-1.5 border-b-[3px]" style={{ borderColor: C.co2, height: BAR_H }}>
                    {SHERMAN.doses.map((g, i) => (
                        <div key={g} className="relative w-[40px] overflow-hidden rounded-t" style={{ height: Math.max((g / 312) * BAR_H, 3) }}>
                            <Grow value={1} axis="y" color={g === 312 ? C.glucose : 'rgba(245,158,11,0.4)'} delay={stagger(i, 0.25, 0.1)} />
                        </div>
                    ))}
                </div>
                <div className="flex gap-1.5">
                    {SHERMAN.doses.map(g => <span key={g} className="w-[40px] text-center font-mono text-[16px] font-bold text-white">{g}</span>)}
                </div>
            </div>
            <div className="flex flex-col pb-6">
                <CountUp text={SHERMAN.value} delay={0.6} className="font-display text-[36px] font-bold leading-none" style={{ color: C.glucose }} />
                <span className="text-[16px] leading-tight text-gray-100">desempenho<br />× placebo</span>
            </div>
        </div>
        <span className="text-[16px] leading-tight text-gray-300">g, líquido · {SHERMAN.note}</span>
    </Tile>
);

const SchabortTile = ({ step }: { step: number }) => (
    <Tile title={SCHABORT.title} color={C.glucoseSoft} at={2} step={step}>
        <div className="flex flex-1 flex-col justify-center gap-2">
            {SCHABORT.rows.map((r, i) => (
                <div key={r.label} className="flex items-center gap-2">
                    <span className="w-[92px] shrink-0 text-[16px] text-gray-100">{r.label}</span>
                    <div className="relative h-[20px] flex-1 overflow-hidden rounded" style={{ background: TRACK }}>
                        <Grow value={r.min / SCHABORT.max} color={i === 0 ? C.glucose : C.co2} delay={0.25 + i * 0.12} />
                    </div>
                    <CountUp text={`${r.min}`} delay={0.25 + i * 0.12} className="w-[40px] text-right font-display text-[26px] font-bold leading-none"
                        style={{ color: i === 0 ? C.glucose : C.stone }} />
                    <span className="w-[34px] font-mono text-[16px] text-gray-300">±{r.sd}</span>
                </div>
            ))}
        </div>
        <span className="text-[16px] text-gray-200">{SCHABORT.unit} · <span style={{ color: C.glycogenSoft }}>{SCHABORT.note}</span></span>
    </Tile>
);

const AirdTile = ({ step }: { step: number }) => (
    <Tile title={AIRD.title} color={C.ok} at={3} step={step}>
        <div className="flex flex-1 flex-col justify-center gap-2">
            {AIRD.rows.map((r, i) => {
                const color = r.yes ? C.ok : C.stone;
                const Icon = r.yes ? Check : Equal;
                return (
                    <motion.div key={r.label} className="flex items-center gap-3" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: stagger(i, 0.35, 0.15), duration: DUR.enter, ease: EASE_OUT }}>
                        <Icon size={28} color={color} strokeWidth={3} aria-hidden />
                        <div className="flex flex-1 flex-col leading-tight">
                            <span className="text-[16px] text-gray-200">{r.label}</span>
                            <span className="font-display text-[24px] font-bold" style={{ color }}>{r.verdict}</span>
                        </div>
                        <span className="font-mono text-[16px] text-gray-100">{r.p}</span>
                    </motion.div>
                );
            })}
        </div>
    </Tile>
);

export const PreMealBoard = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2 px-4 py-2.5">
        <div className="px-1"><Timeline step={step} /></div>
        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2.5">
            <CoyleTile step={step} />
            <ShermanTile step={step} />
            <SchabortTile step={step} />
            <AirdTile step={step} />
        </div>
    </div>
);
