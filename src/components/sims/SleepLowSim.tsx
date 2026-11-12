import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { DayClock, StudyStack } from './ato8/SleepParts';
import { StepPanel, TrainLowShell } from './ato8/TrainLowShell';
import { SLEEP_STEPS } from './ato8/sleeplow.content';

/**
 * Slide 142 · Sleep low: o ganho que sumiu. Tríptico: o relógio de 24 h (mesmo carboidrato, outro horário) · a pilha
 * de estudos que acumula, com o n e as barras (Lane → Marquet → Gejl e Riis → Hulston) · o painel do passo.
 */

const ACCENT = [C.glucoseSoft, C.stone, C.stone, C.risk] as const;

const DESIGN = [
    'Marquet: ECR · não cego · 11 × 10',
    'Marquet: ECR · não cego · 11 × 10',
    'Gejl n = 26 · Riis n = 13 · 4 sem',
    'Hulston: ECR pareado · n = 14',
] as const;

export default function SleepLowSim() {
    const { step, setStep } = useSlideSteps(SLEEP_STEPS.length);
    const s = SLEEP_STEPS[step];
    return (
        <TrainLowShell tabs={SLEEP_STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="sleeplow-tabs"
            chips={<><DesignChip>{DESIGN[step]}</DesignChip><IllustrativeChip>horários: ilustrativos</IllustrativeChip></>}>
            <Panel className="w-[316px] shrink-0 px-2 py-2"><DayClock step={step} /></Panel>
            <Panel className="w-[400px] shrink-0 px-3 py-2"><StudyStack step={step} /></Panel>
            <StepPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(SLEEP_STEPS.map(t => t.sources), step)} className="flex-1">
                {step === 3 && (
                    <div className="flex items-end gap-3">
                        <KeyFact color={C.risk} delay={0.5}>
                            <span className="font-display text-[64px] font-bold leading-none" style={{ color: C.risk }}>−8%</span>
                        </KeyFact>
                        <span className="pb-1 text-[17px] leading-snug text-gray-100">de potência na sessão que mais importa</span>
                    </div>
                )}
            </StepPanel>
        </TrainLowShell>
    );
}
