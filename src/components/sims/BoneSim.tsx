import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { BoneStage, RedsInputs } from './ato8/BoneStage';
import { SnLedger, SnPanel, SnShell } from './ato8/SnShell';
import { BONE_CHIPS, BONE_LEDGER, BONE_STEPS } from './ato8/bone.content';

/**
 * Slide 149 · O osso sente falta, no formato palco + painel. Palco: o P1NP de Fensham (dia 0 → dia 6) e, embaixo,
 * os cartões de Heikura e Hammond, que entram e ficam. Painel: o texto do passo, o livro-caixa e, no fim,
 * o REDs com duas entradas (baixa energia e baixo carboidrato), sem limiar numérico.
 */

const ACCENT = [C.caveat, C.fat, C.fat, C.glucose, C.stone] as const;

export default function BoneSim() {
    const { step, setStep } = useSlideSteps(BONE_STEPS.length);
    const s = BONE_STEPS[step];
    return (
        <SnShell tabs={BONE_STEPS.map(x => x.tab)} step={step} setStep={setStep} layoutId="bone-tabs"
            chips={<DesignChip>{BONE_CHIPS[step]}</DesignChip>}>
            <Panel className="w-[640px] shrink-0 px-4 py-3"><BoneStage step={step} /></Panel>
            <SnPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(BONE_STEPS.map(x => x.sources), step)}>
                <SnLedger rows={BONE_LEDGER} step={step} />
                {step >= 4 && <RedsInputs />}
            </SnPanel>
        </SnShell>
    );
}
