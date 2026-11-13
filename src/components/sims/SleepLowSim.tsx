import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { DayLine, SleepChain } from './ato8/SleepParts';
import { SnLedger } from './ato8/SnShell';
import { StepPanel, TrainLowShell } from './ato8/TrainLowShell';
import { SLEEP_LEDGER, SLEEP_STEPS } from './ato8/sleeplow.content';

/**
 * Slide 142 · Sleep low: o ganho que sumiu. Palco: a linha do dia (mesmo carboidrato, outro horário) e, embaixo,
 * a cadeia em 3 elos numerados, um estudo por elo (Marquet: o ganho → réplicas: o ganho some → Hulston: o custo).
 * Painel: texto do passo e o livro-caixa que conta a mesma cadeia e acumula.
 */

const ACCENT = [C.glucoseSoft, C.stone, C.stone, C.risk] as const;

const DESIGN = [
    'Lane 2015 · cruzado · n = 7',
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
            <Panel className="flex w-[660px] shrink-0 flex-col gap-3 px-3 py-2.5">
                <DayLine />
                <div className="min-h-0 flex-1"><SleepChain step={step} /></div>
            </Panel>
            <StepPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(SLEEP_STEPS.map(t => t.sources), step)} className="flex-1">
                <SnLedger rows={SLEEP_LEDGER} step={step} valueWidth={250} />
            </StepPanel>
        </TrainLowShell>
    );
}
