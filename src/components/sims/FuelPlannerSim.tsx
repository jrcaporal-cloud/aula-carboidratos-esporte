import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { CalcChip, FictionChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { PlannerBoard } from './ato8/PlannerBoard';
import { StepPanel, TrainLowShell } from './ato8/TrainLowShell';
import { LEDGER, NEXT_KIND, PLANNER_STEPS, PRESETS, type SessionKind } from './ato8/planner.content';

/**
 * Slide 143 · Combustível para o trabalho. Palco: a semana da Marina (caso fictício) com o glicogênio ao começar cada
 * sessão na régua de Areta 2018 (~560 / 462 / ~210 mmol/kg ps). O passador conta a história (prato igual → chave alto
 * → leves com pouco → a semana pronta); o clique numa sessão troca o tipo (leve → chave → com pouco) e tudo acompanha.
 */

const ACCENT = [C.text, C.glucose, C.caveat, C.ok] as const;

interface Picks { step: number; map: Readonly<Record<number, SessionKind>> }

const Ledger = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[15px] text-gray-300">régua de Areta 2018 · mmol/kg ps</span>
        {LEDGER.filter(r => r.at <= step).map((r, i) => (
            <motion.div key={r.label} className="flex items-baseline justify-between text-[18px] font-semibold"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.4, 0.1) : 0, ease: EASE_OUT }}>
                <span className="text-gray-100">{r.label}</span>
                <span className="font-display text-[22px] tabular-nums" style={{ color: r.at === 1 ? C.glucoseSoft : r.at === 2 ? C.caveat : '#FFFFFF' }}>{r.value}</span>
            </motion.div>
        ))}
    </div>
);

export default function FuelPlannerSim() {
    const { step, setStep } = useSlideSteps(PLANNER_STEPS.length);
    const [picks, setPicks] = useState<Picks>({ step: -1, map: {} });
    // Os cliques valem só no passo em que foram feitos: o passador sempre volta à história.
    const kindOf = (i: number): SessionKind => (picks.step === step ? picks.map[i] : undefined) ?? PRESETS[step][i];
    const pick = (i: number) => {
        const base = picks.step === step ? picks.map : {};
        setPicks({ step, map: { ...base, [i]: NEXT_KIND[kindOf(i)] } });
    };
    const s = PLANNER_STEPS[step];
    return (
        <TrainLowShell tabs={PLANNER_STEPS.map(p => p.tab)} step={step} setStep={setStep} layoutId="planner-tabs"
            chips={<><FictionChip /><IllustrativeChip>semana ilustrativa</IllustrativeChip><CalcChip>~560 e ~210: cálculo</CalcChip></>}>
            <Panel className="w-[700px] shrink-0 px-4 py-3"><PlannerBoard step={step} kindOf={kindOf} onPick={pick} /></Panel>
            <StepPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(PLANNER_STEPS.map(p => p.sources), step)} className="flex-1">
                <Ledger step={step} />
            </StepPanel>
        </TrainLowShell>
    );
}
