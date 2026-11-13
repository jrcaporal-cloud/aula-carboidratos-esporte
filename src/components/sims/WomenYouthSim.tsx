import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { FrameB, LedgerB, PanelB } from './ato9/FrameB';
import { WomenYouthStage } from './ato9/WomenYouthStage';
import { BOYS_EDGE, LEDGER, STEPS } from './ato9/womenYouth.content';

/**
 * Slide 167 · Mulheres e Jovens, palco + painel. O palco são duas cadeias de faixas numeradas, um estudo por faixa
 * (ato9/WomenYouthStage): MULHERES (oxidação, ciclo, a carga em 1995 e em 2001) e JOVENS (meninos, e no calor).
 * Cada faixa entra no seu passo e fica; o painel conta o passo e o livro-caixa acumula.
 */

const ACCENT = [C.glucoseSoft, C.stone, C.glycogenSoft, C.glycogenSoft, C.glucoseSoft, C.glucoseSoft] as const;

export default function WomenYouthSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <FrameB tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="women-youth-tabs"
            chips={<><DesignChip>{s.design}</DesignChip>{step >= 4 && <CalcChip>+{BOYS_EDGE}%: cálculo</CalcChip>}</>}
            stage={<WomenYouthStage step={step} />}
            panel={
                <PanelB step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                    source={sourcesUpTo(STEPS.map(x => x.source), step)}
                    ledger={<LedgerB title="o que fica" items={LEDGER} step={step} />} />
            } />
    );
}
