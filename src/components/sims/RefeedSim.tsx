import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { FrameB, LedgerB, PanelB } from './ato9/FrameB';
import { RefeedStage } from './ato9/RefeedStage';
import { LEDGER, STEPS } from './ato9/refeed.content';

/**
 * Slide 165 · Depois da Pesagem, palco + painel. O palco é a cadeia em 3 faixas ligadas por setas (ato9/RefeedStage):
 * Kondo (o glicogênio não volta em 13 h) → Reale (o tempo entre pesagem e luta muda o que o reganho vale) →
 * CDC 1998 e NCAA (as mortes e a regra). O painel conta o passo e o livro-caixa acumula.
 */

const ACCENT = [C.glycogenSoft, C.ok, C.stone, C.ok] as const;

export default function RefeedSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <FrameB tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="refeed-tabs"
            chips={<><DesignChip>{s.design}</DesignChip><IllustrativeChip>forma da curva ilustrativa</IllustrativeChip></>}
            stage={<RefeedStage step={step} />}
            panel={
                <PanelB step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                    source={sourcesUpTo(STEPS.map(x => x.source), step)}
                    ledger={<LedgerB title="o que fica" items={LEDGER} step={step} />} />
            } />
    );
}
