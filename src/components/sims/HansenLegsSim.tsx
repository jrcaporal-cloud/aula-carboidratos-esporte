import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { HansenStage } from './ato8/HansenStage';
import { StepPanel, TrainLowShell } from './ato8/TrainLowShell';
import { HANSEN_ROWS, HANSEN_STEPS } from './ato8/hansen.content';

/**
 * Slide 140 · A perna que treinou com fome (Hansen 2005), no formato palco + painel.
 * Palco: o protocolo (calendário de 4 dias e as duas pernas) e, a partir do passo 2, a cascata do sinal com os números
 * de Bartlett 2013. Painel: o texto do passo, o resultado de Hansen (entra no passo 3 e fica).
 */

const ACCENT = [C.glycogenSoft, C.insulin, C.ok, C.stone] as const;

const Results = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-[3px] text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">Hansen 2005</th>
                <th className="text-right font-semibold text-white">LOW</th>
                <th className="text-right font-normal">HIGH</th>
            </tr>
        </thead>
        <tbody>
            {HANSEN_ROWS.map((r, i) => (
                <motion.tr key={r.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, delay: step === 2 ? stagger(i, 0.3, 0.1) : 0, ease: EASE_OUT }}
                    className="text-[17px] font-semibold">
                    <td className="text-gray-100">{r.label}</td>
                    <td className="text-right tabular-nums" style={{ color: r.lowWins ? C.ok : '#F3F4F6' }}>{r.low}</td>
                    <td className="text-right tabular-nums text-gray-300">{r.high}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function HansenLegsSim() {
    const { step, setStep } = useSlideSteps(HANSEN_STEPS.length);
    const s = HANSEN_STEPS[step];
    return (
        <TrainLowShell tabs={HANSEN_STEPS.map(h => h.tab)} step={step} setStep={setStep} layoutId="hansen-tabs"
            chips={<><DesignChip>Hansen: intraindivíduo · n = 7 · 10 sem</DesignChip><IllustrativeChip>coxas: ilustrativo</IllustrativeChip></>}>
            <Panel className="shrink-0 px-2"><HansenStage step={step} /></Panel>
            <StepPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(HANSEN_STEPS.map(h => h.sources), step)} className="flex-1">
                {step >= 2 && <Results step={step} />}
            </StepPanel>
        </TrainLowShell>
    );
}
