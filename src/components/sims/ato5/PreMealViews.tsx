import { motion } from 'framer-motion';
import { Check, Equal } from 'lucide-react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Grow } from '../kit/Beat';
import { Tank } from '../kit/Tank';
import { CountUp } from '../kit/CountUp';
import { AIRD, COYLE, SCHABORT, SHERMAN } from './preMeal.content';

/** As quatro vistas do slide 84 (uma por estudo), trocadas pelo passo. */

const TRACK_BG = 'rgba(255,255,255,0.06)';
/** Nível do jejum no desenho; a refeição fica 42% acima (a razão é do estudo, o nível absoluto não). */
const FASTED_LEVEL = 0.56;

export const CoyleView = () => (
    <div className="flex h-full items-center justify-center gap-14 px-10">
        <div className="flex items-end gap-10">
            <Tank level={FASTED_LEVEL} label="jejum de 16 h" width={84} height={240} />
            <Tank level={FASTED_LEVEL * 1.42} label="refeição 4 h antes" width={84} height={240} active />
        </div>
        <div className="flex max-w-[300px] flex-col gap-3">
            <CountUp text={COYLE.value} delay={0.2} className="font-display text-[88px] font-bold leading-none" style={{ color: C.glycogenSoft }} />
            <span className="text-[20px] leading-snug text-gray-100">{COYLE.caption}</span>
        </div>
    </div>
);

export const ShermanView = () => (
    <div className="flex h-full flex-col justify-end gap-3 px-12 pb-6 pt-4">
        <div className="flex h-[290px] items-end justify-around border-b-[3px]" style={{ borderColor: C.co2 }}>
            {SHERMAN.doses.map((g, i) => {
                const win = g === SHERMAN.max;
                return (
                    <div key={g} className="flex w-[120px] flex-col items-center justify-end gap-2">
                        {win && (
                            <motion.div className="flex flex-col items-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.75, duration: DUR.enter, ease: EASE_OUT }}>
                                <span className="font-display text-[56px] font-bold leading-none" style={{ color: C.glucose }}>{SHERMAN.win}</span>
                                <span className="whitespace-nowrap text-[18px] text-gray-100">{SHERMAN.winCaption}</span>
                            </motion.div>
                        )}
                        <div className="relative w-full overflow-hidden rounded-t-lg" style={{ height: Math.max((g / SHERMAN.max) * 160, 4) }}>
                            <Grow value={1} axis="y" color={win ? C.glucose : 'rgba(245,158,11,0.35)'} delay={stagger(i, 0.1)} />
                        </div>
                    </div>
                );
            })}
        </div>
        <div className="flex justify-around">
            {SHERMAN.doses.map(g => (
                <span key={g} className="w-[120px] text-center font-mono text-[24px] font-bold text-white">{g} g</span>
            ))}
        </div>
        <span className="text-center text-[18px] text-gray-300">{SHERMAN.axis}</span>
    </div>
);

export const SchabortView = () => (
    <div className="flex h-full flex-col justify-center gap-6 px-12">
        {SCHABORT.rows.map((r, i) => (
            <div key={r.label} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                    <span className="text-[24px] font-semibold text-white">{r.label}</span>
                    <CountUp text={`${r.min} min`} delay={0.15 + i * 0.12} className="font-display text-[48px] font-bold leading-none"
                        style={{ color: i === 0 ? C.glucose : C.stone }} />
                </div>
                <div className="relative h-[34px] overflow-hidden rounded-lg" style={{ background: TRACK_BG }}>
                    <Grow value={r.min / SCHABORT.max} color={i === 0 ? C.glucose : C.co2} delay={0.15 + i * 0.12} />
                </div>
            </div>
        ))}
        <span className="text-[18px] text-gray-300">{SCHABORT.unit}</span>
        <span className="rounded-xl border-2 px-4 py-2 text-[20px] text-gray-100" style={{ borderColor: 'rgba(255,255,255,0.22)' }}>{SCHABORT.note}</span>
    </div>
);

export const AirdView = () => (
    <div className="flex h-full flex-col justify-center gap-5 px-12">
        {AIRD.rows.map((r, i) => {
            const color = r.yes ? C.ok : C.stone;
            const Icon = r.yes ? Check : Equal;
            return (
                <motion.div key={r.label} className="flex items-center gap-6 rounded-2xl border-2 px-6 py-5" style={{ borderColor: color }}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stagger(i, 0.1, 0.15), duration: DUR.enter, ease: EASE_OUT }}>
                    <Icon size={48} color={color} strokeWidth={3} aria-hidden />
                    <div className="flex flex-1 flex-col">
                        <span className="text-[24px] text-gray-200">{r.label}</span>
                        <span className="font-display text-[44px] font-bold leading-tight" style={{ color }}>{r.verdict}</span>
                    </div>
                    <span className="font-mono text-[22px] text-gray-100">{r.p}</span>
                </motion.div>
            );
        })}
    </div>
);
