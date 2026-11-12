import { motion, useReducedMotion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { Beat, Grow } from './kit/Beat';
import { Tank } from './kit/Tank';
import { DesignChip } from './kit/chips';
import {
    BEATS, DAY_LABELS, REGIMES, STRIP_BY_STEP, TANK_MAX, TANK_ORDER, TANKS_BY_STEP, TEXT, type RegimeId,
} from './ato5/loadingHistory.content';

/**
 * Slide 80 · A Dieta Escandinava. Um calendário de 6 dias em que cada dia é uma barra de % de CHO:
 * o regime clássico (depleção + carga) se transforma no moderado de Sherman e depois na dieta só mista;
 * cada versão deixa o seu tanque ao lado (207 · 203 · 159). No fim, a largada: 20,9 km, tempo igual.
 */
const PHASE_COLOR: Record<string, string> = { 'depleção': C.risk, 'dieta mista': C.stone, carga: C.glucose };

const DayColumn = ({ label, pct }: { label: string; pct: number }) => (
    <div className="flex flex-1 flex-col items-center gap-2">
        <Beat beat={pct} className="font-mono text-[24px] font-bold tabular-nums" style={{ color: C.glucoseSoft }}>{pct}%</Beat>
        <div className="relative h-[170px] w-full overflow-hidden rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <Grow value={pct / 100} axis="y" color={C.glucose} />
        </div>
        <span className="font-mono text-[18px] text-gray-200">{label}</span>
    </div>
);

const Phase = ({ name }: { name: string }) => (
    <div className="flex flex-1 flex-col gap-1.5">
        <motion.span className="h-[3px] rounded-full" animate={{ backgroundColor: PHASE_COLOR[name] }} transition={{ duration: DUR.morph }} />
        <Beat beat={name} className="text-center text-[20px] font-semibold" style={{ color: PHASE_COLOR[name] }}>{name}</Beat>
    </div>
);

const RaceColumn = ({ on }: { on: boolean }) => (
    <div className="flex w-[92px] flex-col items-center justify-center gap-3 rounded-xl border-2"
        style={{ borderColor: on ? C.text : 'rgba(255,255,255,0.14)', height: 170, marginTop: 36 }}>
        <Flag size={34} color={C.text} strokeWidth={2.5} aria-hidden />
        <motion.span className="font-mono text-[18px] font-semibold text-white" animate={{ opacity: on ? 1 : 0.5 }}>{TEXT.race}</motion.span>
    </div>
);

const Strip = ({ regime, race }: { regime: RegimeId; race: boolean }) => {
    const r = REGIMES[regime];
    return (
        <div className="flex h-full flex-col justify-between rounded-2xl px-6 py-5" style={PANEL_BG}>
            <span className="text-[18px] text-gray-300">{TEXT.axis}</span>
            <div className="flex items-start gap-3">
                <div className="flex flex-1 gap-3">
                    {r.days.map((pct, i) => <DayColumn key={DAY_LABELS[i]} label={DAY_LABELS[i]} pct={pct} />)}
                </div>
                <RaceColumn on={race} />
            </div>
            <div className="flex gap-3 pr-[104px]">
                <Phase name={r.phases[0]} />
                <Phase name={r.phases[1]} />
            </div>
        </div>
    );
};

const Tanks = ({ shown, active, race }: { shown: number; active: RegimeId; race: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="relative flex h-full flex-1 flex-col justify-between rounded-2xl px-5 py-5" style={PANEL_BG}>
            <span className="text-[18px] text-gray-300">{TEXT.unit}</span>
            <div className="flex items-end justify-around">
                {TANK_ORDER.map((id, i) => {
                    const r = REGIMES[id];
                    const on = i < shown;
                    return (
                        <motion.div key={id} initial={false} animate={{ opacity: on ? 1 : 0, y: on || reduce ? 0 : 12 }}
                            transition={{ duration: DUR.enter, ease: EASE_OUT }} className="flex flex-col items-center gap-1">
                            <span className="font-display text-[32px] font-bold leading-none tabular-nums"
                                style={{ color: id === active && !race ? C.glycogenSoft : C.text }}>{r.glycogen}</span>
                            <Tank level={on ? r.glycogen / TANK_MAX : 0} label={r.label}
                                width={70} height={190} active={id === active && !race} />
                        </motion.div>
                    );
                })}
            </div>
            <motion.div className="flex items-center justify-center gap-3 rounded-xl border-2 py-1.5"
                style={{ borderColor: C.stone }} initial={false}
                animate={{ opacity: race ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <Flag size={20} color={C.text} aria-hidden />
                <span className="text-[20px] font-semibold text-white">{TEXT.race}: {TEXT.sameTime}</span>
            </motion.div>
        </div>
    );
};

export default function LoadingHistorySim() {
    const { step } = useSlideSteps(BEATS.length);
    const regime = STRIP_BY_STEP[step];
    const race = step === BEATS.length - 1;
    return (
        <div className="not-prose flex w-full flex-col gap-4" style={{ maxHeight: 516 }}>
            <div className="flex min-h-[84px] items-start justify-between gap-6">
                <Beat beat={step} className="max-w-[860px] text-[28px] font-semibold leading-snug text-white">{BEATS[step]}</Beat>
                <DesignChip>{TEXT.design}</DesignChip>
            </div>
            <div className="flex gap-5" style={{ height: 370 }}>
                <div className="w-[700px] shrink-0"><Strip regime={regime} race={race} /></div>
                <Tanks shown={TANKS_BY_STEP[step]} active={regime} race={race} />
            </div>
            <Source>{TEXT.source}</Source>
        </div>
    );
}
