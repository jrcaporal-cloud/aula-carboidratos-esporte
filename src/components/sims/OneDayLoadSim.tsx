import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { Beat, Grow, Wipe } from './kit/Beat';
import { Tank } from './kit/Tank';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { DayClock } from './ato5/DayClock';
import { BEATS, DESIGNS, LOADS, SOLEM, SOURCES, TANK_MAX, TEXT } from './ato5/oneDayLoad.content';

/**
 * Slide 81 · Carga em 24 Horas. Um relógio de 24 h acende gomo a gomo enquanto o tanque sobe de 95 para 180
 * (Bussau). Depois o gomo vermelho dos 3 min de Fairchild e a nova rodada (109 → 198). Por fim o relógio
 * apaga e entra a meta-análise de Solem: ciclismo × corrida, em outra unidade (peso seco).
 */
const LoadReadout = ({ step }: { step: number }) => {
    const load = LOADS[Math.min(step, LOADS.length - 1)];
    const filled = load.to !== load.from;
    return (
        <div className="flex h-full items-center justify-center gap-10">
            <div className="flex flex-col gap-3">
                <span className="text-[20px] text-gray-300">{TEXT.tank}</span>
                <div className="flex items-center gap-4">
                    <span className="font-display text-[48px] font-bold leading-none text-gray-300 tabular-nums">{load.from}</span>
                    <motion.span initial={false} animate={{ opacity: filled ? 1 : 0 }} transition={{ duration: DUR.text }}
                        className="flex items-center gap-4">
                        <ArrowRight size={34} color={C.glycogenSoft} aria-hidden />
                        <CountUp key={`${step}-${load.to}`} text={String(load.to)} delay={0.15} duration={0.95}
                            className="font-display text-[88px] font-bold leading-none" style={{ color: C.glycogenSoft }} />
                    </motion.span>
                </div>
                <span className="text-[18px] text-gray-300">{TEXT.unit}</span>
                <motion.span className="self-start rounded-lg border-2 px-3 py-1 text-[18px] text-gray-100"
                    style={{ borderColor: 'rgba(255,255,255,0.25)' }} initial={false}
                    animate={{ opacity: step === 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 1 : 0 }}>
                    {TEXT.days23}
                </motion.span>
            </div>
            <Tank level={load.to / TANK_MAX} width={88} height={280} active />
        </div>
    );
};

const SolemBars = () => (
    <div className="flex h-full flex-col justify-center gap-6 px-8">
        {SOLEM.rows.map((r, i) => (
            <div key={r.label} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                    <span className="text-[24px] font-semibold text-white">{r.label}</span>
                    <CountUp text={r.text} delay={0.2 + i * 0.15} className="font-display text-[56px] font-bold leading-none"
                        style={{ color: i === 0 ? C.glycogenSoft : C.glycogen }} />
                </div>
                <div className="relative h-[36px] overflow-hidden rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Grow value={r.value / SOLEM.max} color={i === 0 ? C.glycogenSoft : C.glycogen} delay={0.2 + i * 0.15} />
                </div>
            </div>
        ))}
        <span className="text-[18px] text-gray-300">{SOLEM.unit}</span>
        <span className="text-[18px] text-gray-300">{SOLEM.note}</span>
    </div>
);

export default function OneDayLoadSim() {
    const { step } = useSlideSteps(BEATS.length);
    const meta = step === 3;
    const load = LOADS[Math.min(step, LOADS.length - 1)];
    return (
        <div className="not-prose flex w-full flex-col gap-4" style={{ maxHeight: 516 }}>
            <div className="flex min-h-[84px] items-start justify-between gap-6">
                <Beat beat={step} className="max-w-[820px] text-[28px] font-semibold leading-snug text-white">{BEATS[step]}</Beat>
                <Beat beat={DESIGNS[step]}><DesignChip>{DESIGNS[step]}</DesignChip></Beat>
            </div>
            <div className="flex gap-5" style={{ height: 380 }}>
                <motion.div className="flex w-[420px] shrink-0 items-center justify-center rounded-2xl" style={PANEL_BG}
                    animate={{ opacity: meta ? 0.6 : 1 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    <DayClock run={`r${Math.min(step, 2) === 2 ? 2 : 1}`} lit={step >= 1} sprint={step >= 2}
                        sprintLabel={TEXT.sprint} hoursLabel={TEXT.hours} />
                </motion.div>
                <div className="relative flex-1 overflow-hidden rounded-2xl" style={PANEL_BG}>
                    {meta ? (
                        <Wipe from="left" className="absolute inset-0"><SolemBars /></Wipe>
                    ) : (
                        <Beat beat={load.sprint ? 'f' : 'b'} className="h-full"><LoadReadout step={step} /></Beat>
                    )}
                </div>
            </div>
            <Source>{SOURCES[step]}</Source>
        </div>
    );
}
