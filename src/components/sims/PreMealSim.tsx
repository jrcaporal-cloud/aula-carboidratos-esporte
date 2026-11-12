import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { Beat } from './kit/Beat';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { AirdView, CoyleView, SchabortView, ShermanView } from './ato5/PreMealViews';
import { ACTIVE, BEATS, DESIGNS, MARKS, PINS, SOURCES } from './ato5/preMeal.content';

/**
 * Slide 84 · A Refeição de 3–4 Horas. À esquerda, um relógio regressivo vertical (−4 h → largada) em que
 * cada estudo fica pendurado na hora em que comeram; à direita, a vista do estudo do passo:
 * tanques (Coyle) → escada de doses (Sherman) → tempo até a fadiga (Schabort) → longo × curto (Aird).
 */
const VIEWS = [CoyleView, ShermanView, SchabortView, AirdView] as const;

const Countdown = ({ step }: { step: number }) => {
    const activeIndex = MARKS.findIndex(m => m.id === ACTIVE[step]);
    return (
        <div className="relative flex h-full flex-col justify-between rounded-2xl px-6 py-6" style={PANEL_BG}>
            <span className="absolute bottom-10 left-[37px] top-10 w-[3px]" style={{ background: 'rgba(255,255,255,0.18)' }} />
            {MARKS.map((m, i) => {
                const on = i <= activeIndex && (step === 3 || m.id === ACTIVE[step]);
                const isGo = m.id === 'go';
                const pins = PINS.filter(p => p.mark === m.id && step >= p.from);
                return (
                    <div key={m.id} className="relative flex items-start gap-4">
                        <motion.span className="relative z-10 mt-1 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-[3px]"
                            initial={false} transition={{ duration: DUR.text }}
                            animate={{ backgroundColor: on ? C.text : '#04080F', borderColor: on ? C.text : 'rgba(255,255,255,0.35)' }}>
                            {isGo && <Flag size={16} color={on ? '#04080F' : C.text} strokeWidth={3} aria-hidden />}
                        </motion.span>
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[24px] font-bold" style={{ color: on ? '#fff' : C.muted }}>{m.label}</span>
                            {pins.map(p => (
                                <motion.span key={p.label} className="text-[17px] text-gray-200"
                                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                                    {p.label}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default function PreMealSim() {
    const { step } = useSlideSteps(BEATS.length);
    const View = VIEWS[step];
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ maxHeight: 516 }}>
            <div className="flex gap-5" style={{ height: 476 }}>
                <div className="w-[230px] shrink-0"><Countdown step={step} /></div>
                <div className="flex flex-1 flex-col gap-3">
                    <div className="flex min-h-[80px] items-start justify-between gap-4">
                        <Beat beat={step} className="max-w-[640px] text-[28px] font-semibold leading-snug text-white">{BEATS[step]}</Beat>
                        <Beat beat={`d${step}`} className="flex flex-col items-end gap-2">
                            <DesignChip>{DESIGNS[step]}</DesignChip>
                            {step === 0 && <IllustrativeChip />}
                        </Beat>
                    </div>
                    <div className="relative flex-1 overflow-hidden rounded-2xl" style={PANEL_BG}>
                        <Beat beat={step} className="h-full"><View /></Beat>
                    </div>
                </div>
            </div>
            <Source>{SOURCES[step]}</Source>
        </div>
    );
}
