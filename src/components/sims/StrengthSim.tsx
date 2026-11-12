import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip, FictionChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { A9Frame, Ledger, StepText } from './ato9/A9aShell';
import { StrengthStage } from './ato9/StrengthStage';
import { CALC, CHIPS, LEDGER, STEPS } from './ato9/strength.content';

/**
 * Slide 162 · Paulo e o Carbo Pós-Treino, no formato palco + painel. O palco junta o gasto (seis tanques que baixam
 * e não esvaziam) e o veredito (os 49 estudos de força e a régua do SMD de hipertrofia); o painel conta o estudo
 * do passo e o livro-caixa acumula os números. Paulo é caso fictício.
 */

const ACCENT = [C.stone, C.glycogenSoft, C.glycogenSoft, C.glucoseSoft, C.glucoseSoft] as const;

export default function StrengthSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <A9Frame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="strength-tabs" chips={<>
            <FictionChip />
            {CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
            {CALC[step] && <CalcChip>{CALC[step]}</CalcChip>}
        </>}>
            <Panel className="shrink-0 px-[10px] py-[8px]"><StrengthStage step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} size={17} />
                <div className="mt-auto flex flex-col gap-3">
                    <Ledger rows={LEDGER} step={step} />
                    <Source>{step === 0 ? 'Paulo: caso fictício (elenco da aula).' : sourcesUpTo(STEPS.map(t => t.sources), step)}</Source>
                </div>
            </Panel>
        </A9Frame>
    );
}
