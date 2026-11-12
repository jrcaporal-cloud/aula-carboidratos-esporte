import { useSlideSteps } from '../../store/useSlideSteps';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Narration, PanelFoot, PreRaceFrame, Takeaways } from './ato5/PreRaceFrame';
import { C } from './kit/palette';
import { GlycemiaChart } from './ato5/GlycemiaChart';
import { MythCover, ReboundColumn } from './ato5/ReboundSide';
import { RB_STEPS, TEXT } from './ato5/rebound.content';

/**
 * Slide 85 · O Fantasma do Rebote, palco + painel. Passo 1: a frase-mito e o −19% de Foster em tela cheia.
 * A frase sai por clip-path e revela a glicemia de Moseley 2003 do jejum à 20ª min de pedal: as três doses caem
 * no eixo (−75, −45, −15), as curvas sobem e largam em 6,6 / 4,5 / 3,7; no exercício, encontram-se aos 10 min.
 * A coluna à direita acumula Foster (que leva o carimbo de mito no fim), a potência (268/269/276 W) e os 6 de 19 de Kuipers.
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
            stage={
                <div className="relative flex h-full gap-2.5 px-2 py-3">
                    <GlycemiaChart step={step} />
                    <div className="min-w-0 flex-1 pr-1"><ReboundColumn step={step} /></div>
                    <MythCover show={step === 0} />
                </div>
            }
            panel={<>
                <Narration step={step} headline={s.headline} color={s.color} text={s.text} limit={s.limit} />
                <PanelFoot sources={sourcesUpTo(RB_STEPS.map(r => r.sources), step)}>
                    <Takeaways items={RB_STEPS.map(r => r.takeaway)} step={step} color={C.glucoseSoft} title="O que fica" />
                </PanelFoot>
            </>} />
    );
}
