import { useSlideSteps } from '../../store/useSlideSteps';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { PaFrame, PaSide } from './ato6/paFrame';
import { HighDoseChain } from './ato6/HighDoseChain';
import { LESSONS, STEPS } from './ato6/highdose.content';

/**
 * Slide 105 · 120 g/h: o que se sabe. Palco: a cadeia em 4 faixas numeradas (ato6/HighDoseChain), um estudo por faixa,
 * cada um na sua escala: entra e oxida mais (Ravikanti) → o estoque fica igual (Podlogar) → o tempo de prova não foi
 * medido (Viribay) → desempenho: não demonstrado (Morton 2026). Painel: texto do passo, livro-caixa e fonte que acumulam.
 */

export default function HighDoseSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <PaFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="highdose-tabs"
            chips={<DesignChip>{s.design}</DesignChip>}
            stage={<HighDoseChain step={step} />}
            panel={<PaSide step={step} color={s.color} headline={s.headline} text={s.text} lessons={LESSONS}
                source={sourcesUpTo(STEPS.map(t => t.sources), step)} />} />
    );
}
