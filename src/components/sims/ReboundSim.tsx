import { useSlideSteps } from '../../store/useSlideSteps';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Narration, PanelFoot, PreRaceFrame, Takeaways } from './ato5/PreRaceFrame';
import { C } from './kit/palette';
import { ReboundFlow } from './ato5/ReboundFlow';
import { RB_STEPS, TEXT } from './ato5/rebound.content';

/**
 * Slide 85 · O Fantasma do Rebote, palco + painel. Palco: a cadeia em 3 faixas numeradas (ato5/ReboundFlow), um estudo
 * por faixa e cada um no seu eixo: 1 Foster 1979, o medo → 2 Moseley 2003, glicemia em minutos de exercício e potência →
 * 3 Kuipers 1999, quem sente; o carimbo MITO cai no veredito, sobre o conselho. Painel: o passo e o "o que fica" que acumula.
 */
export default function ReboundSim() {
    const { step, setStep } = useSlideSteps(RB_STEPS.length);
    const s = RB_STEPS[step];
    return (
        <PreRaceFrame tabs={RB_STEPS.map(r => r.tab)} step={step} setStep={setStep} layoutId="rebound-tabs" stageWidth={720}
            chips={<>
                {s.chips.map(c => <DesignChip key={c}>{c}</DesignChip>)}
                {step >= 1 && <IllustrativeChip>{TEXT.illustrative}</IllustrativeChip>}
            </>}
            stage={<div className="h-full p-2"><ReboundFlow step={step} /></div>}
            panel={<>
                <Narration step={step} headline={s.headline} color={s.color} text={s.text} limit={s.limit} />
                <PanelFoot sources={sourcesUpTo(RB_STEPS.map(r => r.sources), step)}>
                    <Takeaways items={RB_STEPS.map(r => r.takeaway)} step={step} color={C.glucoseSoft} title="O que fica" />
                </PanelFoot>
            </>} />
    );
}
