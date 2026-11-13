import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip, FictionChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { A9Frame, Ledger, StepText } from './ato9/A9aShell';
import { WeightStage } from './ato9/WeightStage';
import { CALC, CHIPS, LEDGER, STEPS } from './ato9/weightCut.content';

/**
 * Slide 164 · A Balança e a Água, no formato palco + painel. Uma cena só: a balança do Tiago (caso fictício) e a conta
 * em cascata até o alvo — glicogênio com a água dele (piso 1 : 3) → conteúdo do intestino (fibra, −0,74%) → o que falta,
 * que só sairia como água do corpo (ACSM). Ressalva rotulada: essa água não é cantil (King 2018). Sem protocolo.
 */

const ACCENT = [C.stone, C.glycogenSoft, C.co2, C.risk, C.caveat] as const;

export default function WeightCutSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <A9Frame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="weight-tabs" chips={<>
            <FictionChip />
            {CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
            {CALC[step] && <CalcChip>{CALC[step]}</CalcChip>}
        </>}>
            <Panel className="shrink-0 px-[10px] py-[8px]"><WeightStage step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} size={17} />
                <div className="mt-auto flex flex-col gap-3">
                    <Ledger rows={LEDGER} step={step} title="a conta do Tiago" />
                    <Source>{sourcesUpTo(STEPS.map(t => t.sources), step)}</Source>
                </div>
            </Panel>
        </A9Frame>
    );
}
