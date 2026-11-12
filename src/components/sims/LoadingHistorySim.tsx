import { motion, useReducedMotion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { CalcChip, DesignChip } from './kit/chips';
import { Ledger, LoadingFrame, LoadingPanel } from './ato5/LoadingFrame';
import {
    CALC, CHIPS, DAY_LABELS, GLYCO_MAX, LESSONS, REGIMES, STEPS, TEXT, TRAINING, type Regime,
} from './ato5/loadingHistory.content';

/**
 * Slide 80 · A Dieta Escandinava, palco + painel. O palco é o calendário do estudo de Sherman 1981: as colunas
 * são os 6 dias antes da prova (com o polimento na esteira), cada regime entra como uma linha de barras de % de CHO
 * e termina no glicogênio medido; no último passo chega a coluna do gasto por km e a faixa da prova. Nada sai.
 */
const COLS = 'grid-cols-[112px_repeat(6,46px)_112px_68px]';
const ACCENT = [C.glucose, C.glycogenSoft, C.glucoseSoft, C.stone] as const;

const RegimeRow = ({ r, step }: { r: Regime; step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const shown = step >= r.at;
    const current = step === r.at;
    const race = step >= 3;
    return (
        <motion.div className={`grid ${COLS} items-center gap-x-1.5`} initial={false}
            animate={{ opacity: shown ? 1 : 0, y: shown || reduce ? 0 : 10 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <div className="flex flex-col">
                <span className="text-[20px] font-semibold leading-tight" style={{ color: current ? ACCENT[step] : C.text }}>{r.label}</span>
                <span className="text-[15px] leading-tight text-gray-300">{r.detail}</span>
            </div>
            {r.days.map((pct, i) => (
                <div key={DAY_LABELS[i]} className="relative h-[64px] overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    {shown && <Grow value={pct / 100} axis="y" color={pct < 30 ? C.glucoseDeep : C.glucose} delay={current ? stagger(i, 0.1, 0.06) : 0} />}
                    <span className="absolute inset-x-0 top-0.5 text-center font-mono text-[16px] font-bold text-white">{pct}</span>
                </div>
            ))}
            <div className="flex flex-col gap-1 pl-2">
                {shown && <CountUp text={String(r.glycogen)} delay={current ? 0.55 : 0} duration={current ? 0.6 : 0}
                    className="font-display text-[32px] font-bold leading-none" style={{ color: C.glycogenSoft }} />}
                <div className="relative h-[12px] overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    {shown && <Grow value={r.glycogen / GLYCO_MAX} color={C.glycogen} delay={current ? 0.55 : 0} />}
                </div>
            </div>
            <motion.span className="text-center font-mono text-[24px] font-bold" style={{ color: C.glycogenSoft }}
                initial={false} animate={{ opacity: race ? 1 : 0 }} transition={{ duration: DUR.enter, delay: race ? 0.2 + r.at * 0.12 : 0 }}>
                {r.perKm}
            </motion.span>
        </motion.div>
    );
};

const Calendar = ({ step }: { step: number }) => {
    const race = step >= 3;
    return (
        <div className="flex h-full flex-col gap-2 px-5 py-3">
            <div className={`grid ${COLS} items-end gap-x-1.5`}>
                <span className="text-[15px] leading-tight text-gray-300">dia</span>
                {DAY_LABELS.map(d => <span key={d} className="text-center font-mono text-[17px] font-semibold text-white">{d}</span>)}
                <span className="pl-2 text-[15px] leading-tight text-gray-300">{TEXT.glycogen}<br />{TEXT.unit}</span>
                <motion.span className="text-center text-[15px] leading-tight text-gray-300" initial={false} animate={{ opacity: race ? 1 : 0 }}>
                    {TEXT.perKm}<br />mmol/kg
                </motion.span>
            </div>
            <div className={`grid ${COLS} items-center gap-x-1.5 border-b-2 border-white/15 pb-2`}>
                <span className="text-[15px] leading-tight text-gray-300">{TEXT.training}</span>
                {TRAINING.map((m, i) => (
                    <span key={DAY_LABELS[i]} className="text-center font-mono text-[16px] text-gray-200">{m > 0 ? m : '—'}</span>
                ))}
            </div>
            <div className="flex flex-col gap-3">
                {REGIMES.map(r => <RegimeRow key={r.id} r={r} step={step} />)}
            </div>
            <span className="text-[15px] text-gray-300">{TEXT.axis} · esteira a 73% do VO₂máx · dia −1: {TEXT.rest}</span>
            <motion.div className="mt-auto flex items-center gap-3 rounded-xl border-2 px-4 py-2" style={{ borderColor: C.stone }}
                initial={false} animate={{ opacity: race ? 1 : 0, y: race ? 0 : 8 }} transition={{ duration: DUR.enter, ease: EASE_OUT, delay: race ? 0.5 : 0 }}>
                <Flag size={24} color={C.stone} strokeWidth={2.5} aria-hidden />
                <span className="whitespace-nowrap text-[20px] font-semibold text-white">{TEXT.race}</span>
                <span className="ml-auto whitespace-nowrap text-[17px] font-semibold" style={{ color: C.glycogenSoft }}>{TEXT.raceEnd}</span>
            </motion.div>
        </div>
    );
};

export default function LoadingHistorySim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const lessons = LESSONS.map(l => ({ ...l, color: C.glycogenSoft }));
    return (
        <LoadingFrame tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="loading-history-tabs"
            chips={<>{CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}{CALC[step] && <CalcChip>{CALC[step]}</CalcChip>}</>}
            stage={<Calendar step={step} />}
            panel={
                <LoadingPanel step={step} headline={s.headline} color={ACCENT[step]} text={s.text} source={TEXT.source}
                    ledger={step >= 1 ? <Ledger title={TEXT.ledger} items={lessons} step={step} /> : undefined} />
            } />
    );
}
