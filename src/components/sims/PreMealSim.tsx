import { useSlideSteps } from '../../store/useSlideSteps';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Narration, PanelFoot, PreRaceFrame, Takeaways } from './ato5/PreRaceFrame';
import { C } from './kit/palette';
import { PreMealBoard } from './ato5/PreMealBoard';
import { ILLUSTRATIVE_AT, ILLUSTRATIVE_TEXT, PRE_STEPS } from './ato5/preMeal.content';

/**
 * Slide 84 · A Refeição de 3–4 Horas, no formato palco + painel. Palco: relógio regressivo (−4 h → largada)
 * com cada estudo pendurado na hora em que comeram, e o quadro que ganha um cartão por passo
 * (Coyle → Sherman → Schabort → Aird). Painel: o estudo do passo (desenho, resultado, limitação) e a fonte acumulada.
 */
export default function PreMealSim() {
    const { step, setStep } = useSlideSteps(PRE_STEPS.length);
    const s = PRE_STEPS[step];
    return (
        <PreRaceFrame tabs={PRE_STEPS.map(p => p.tab)} step={step} setStep={setStep} layoutId="premeal-tabs" stageWidth={680}
            chips={<>
                {s.chips.map(c => <DesignChip key={c}>{c}</DesignChip>)}
                {step >= ILLUSTRATIVE_AT && <IllustrativeChip>{ILLUSTRATIVE_TEXT}</IllustrativeChip>}
            </>}
            stage={<PreMealBoard step={step} />}
            panel={<>
                <Narration step={step} headline={s.headline} color={s.color} text={s.text} limit={s.limit} />
                <PanelFoot sources={sourcesUpTo(PRE_STEPS.map(p => p.sources), step)}>
                    <Takeaways items={PRE_STEPS.map(p => p.takeaway)} step={step} color={C.glucoseSoft} />
                </PanelFoot>
            </>} />
    );
}
