import { useSlideSteps } from '../../store/useSlideSteps';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, StepTabs } from './kit/ui';
import { FLOW_H, LiverFlowStage } from './ato7/LiverFlowStage';
import { LiverStrip } from './ato7/LiverStrip';
import { RefillPanel } from './ato7/RefillPanel';
import { LIVER_CHIPS, LIVER_LEDGER, LIVER_STEPS } from './ato7/liver.content';

/**
 * Slide 124 · O Fígado Prefere Sacarose (o pico do Ato VII). Palco à esquerda: duas pistas, sacarose × glicose,
 * da bebida ao fígado e ao músculo (Fuchs 2016, ¹³C-MRS); o fígado da sacarose enche e incha, o músculo empata.
 * Embaixo, o protocolo e o dobro do Décombaz 2011. Painel à direita: texto de pós e livro-caixa que acumula
 * (Fuchs, Casey, Décombaz, Gonzalez). Nada some: o último passo é a soma dos cinco.
 */
export default function LiverRefillSim() {
    const { step, setStep } = useSlideSteps(LIVER_STEPS.length);
    const s = LIVER_STEPS[step];
    return (
        <div className="not-prose flex h-[512px] w-full flex-col gap-2.5">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={LIVER_STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="liver-refill-tabs" />
                <div className="flex flex-wrap justify-end gap-2">
                    {LIVER_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
                </div>
            </div>
            <div className="flex min-h-0 flex-1 gap-3.5">
                <div className="flex w-[640px] shrink-0 flex-col gap-2.5">
                    <Panel className="relative shrink-0">
                        <div style={{ height: FLOW_H + 4 }} className="px-0.5 pt-1"><LiverFlowStage step={step} /></div>
                        {step >= 1 && <div className="absolute bottom-2 left-2"><IllustrativeChip>fluxo: esquema</IllustrativeChip></div>}
                    </Panel>
                    <Panel className="min-h-0 flex-1"><LiverStrip step={step} /></Panel>
                </div>
                <RefillPanel className="flex-1" step={step} headline={s.headline} color={s.color} text={s.text} note={s.note}
                    size={step === 4 ? 16 : 17} rows={LIVER_LEDGER} source={sourcesUpTo(LIVER_STEPS.map(x => x.sources), step)} />
            </div>
        </div>
    );
}
