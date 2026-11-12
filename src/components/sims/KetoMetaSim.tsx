import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { KetoStage } from './ato8/KetoStage';
import { SnLedger, SnPanel, SnShell } from './ato8/SnShell';
import { KETO_CHIPS, KETO_LEDGER, KETO_STEPS } from './ato8/keto.content';

/**
 * Slide 148 · Cetonas e keto: as meta-análises, no formato palco + painel. Palco: três florestas empilhadas
 * (desempenho e composição com a dieta; desempenho com a cetona em gole), cada uma com a sua régua.
 * Painel: o texto do passo e o livro-caixa que acumula. Keto e cetona em cor neutra.
 */

const ACCENT = [C.caveat, C.caveat, C.stone, C.stone] as const;

export default function KetoMetaSim() {
    const { step, setStep } = useSlideSteps(KETO_STEPS.length);
    const s = KETO_STEPS[step];
    return (
        <SnShell tabs={KETO_STEPS.map(x => x.tab)} step={step} setStep={setStep} layoutId="keto-tabs"
            chips={<DesignChip>{KETO_CHIPS[step]}</DesignChip>}>
            <Panel className="w-[640px] shrink-0 px-4 py-3"><KetoStage step={step} /></Panel>
            <SnPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(KETO_STEPS.map(x => x.sources), step)}>
                <SnLedger rows={KETO_LEDGER} step={step} />
            </SnPanel>
        </SnShell>
    );
}
