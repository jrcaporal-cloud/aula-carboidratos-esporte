import { useSlideSteps } from '../../store/useSlideSteps';
import { CalcChip, DesignChip, ViaReviewChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { ChecksStage } from './ato10/ChecksStage';
import { DecideLedger, DecideShell } from './ato10/DecideShell';
import { CHECKS_DESIGNS, CHECKS_LEDGER, CHECKS_STEPS } from './ato10/raceChecks.content';

/**
 * Slide 193 · Quatro Perguntas Antes da Prova. Quadro de decisão (bochecho, treino intestinal, recuperação curta e
 * certificação do produto) que se monta uma linha por passo e fica inteiro no fim; o painel conta o estudo de cada linha.
 */
export default function RaceChecksSim() {
    const { step, setStep } = useSlideSteps(CHECKS_STEPS.length);
    const s = CHECKS_STEPS[step];
    const chips = (
        <>
            {step === 2 && <CalcChip>84 g/h: 1,2 × 70 kg</CalcChip>}
            {step === 3 && <ViaReviewChip>~15%: via revisão</ViaReviewChip>}
            <DesignChip>{CHECKS_DESIGNS[step]}</DesignChip>
        </>
    );
    return (
        <DecideShell tabs={CHECKS_STEPS.map(c => c.tab)} step={step} setStep={setStep} layoutId="checks-tabs"
            chips={chips} stageWidth={640} stage={<ChecksStage step={step} />}
            accent={s.color} headline={s.headline} text={s.text}
            ledger={<DecideLedger rows={CHECKS_LEDGER} step={step} />}
            sources={sourcesUpTo(CHECKS_STEPS.map(c => c.sources), step)} />
    );
}
