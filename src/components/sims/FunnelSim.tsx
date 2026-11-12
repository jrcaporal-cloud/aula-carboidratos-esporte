import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { FunnelPlot, Timeline } from './ato8/FunnelStage';
import { StepPanel, TrainLowShell } from './ato8/TrainLowShell';
import { FUNNEL_LEDGER, FUNNEL_STEPS } from './ato8/funnel.content';

/**
 * Slide 141 · Do músculo ao cronômetro. Palco empilhado: o funil (sinal → desempenho → meta-análise, com os estudos
 * como bolinhas) em cima e a linha do tempo 2005 → 2021 com o n de cada estudo embaixo. Painel: o estudo do passo.
 * Nada some: no fim, o funil inteiro, os cinco cartões e a seta "o efeito encolhe".
 */

const ACCENT = [C.insulin, C.stone, '#FFFFFF', C.stone] as const;

const Ledger = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-1">
        {FUNNEL_LEDGER.filter(r => r.at <= step).map((r, i) => (
            <motion.div key={r.label} className="flex items-baseline justify-between text-[18px] font-semibold"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.4, 0.1) : 0, ease: EASE_OUT }}>
                <span className="text-gray-100">{r.label}</span>
                <span className="font-display text-[22px] tabular-nums" style={{ color: r.at === 0 ? C.insulinSoft : '#FFFFFF' }}>{r.value}</span>
            </motion.div>
        ))}
    </div>
);

export default function FunnelSim() {
    const { step, setStep } = useSlideSteps(FUNNEL_STEPS.length);
    const s = FUNNEL_STEPS[step];
    return (
        <TrainLowShell tabs={FUNNEL_STEPS.map(f => f.tab)} step={step} setStep={setStep} layoutId="funnel-tabs"
            chips={<>
                <DesignChip>{step < 2 ? 'Impey: revisão · contagem' : 'Gejl & Nybo: RS + MA · 9 estudos'}</DesignChip>
                <CalcChip>bolinhas: % × n</CalcChip>
            </>}>
            <Panel className="flex w-[696px] shrink-0 flex-col gap-1.5 px-2 py-1"><FunnelPlot step={step} /><Timeline step={step} /></Panel>
            <StepPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(FUNNEL_STEPS.map(f => f.sources), step)} className="flex-1">
                <Ledger step={step} />
            </StepPanel>
        </TrainLowShell>
    );
}
