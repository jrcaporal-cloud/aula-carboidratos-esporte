import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source, StepTabs } from './kit/ui';
import { FLOW_H, LiverFlowStage } from './ato7/LiverFlowStage';
import { LiverStrip } from './ato7/LiverStrip';
import { DUR, EASE_OUT } from '../../lib/motion';
import { BODY_FONT } from './kit/palette';
import { LiverLedger } from './ato7/LiverLedger';
import { LIVER_CHIPS, LIVER_STEPS } from './ato7/liver.content';

/**
 * Slide 124 · O Fígado Prefere Sacarose (o pico do Ato VII). Palco à esquerda: duas pistas, sacarose × glicose,
 * da bebida ao fígado e ao músculo (Fuchs 2016, ¹³C-MRS); o fígado da sacarose enche e incha, o músculo empata.
 * Embaixo, o protocolo e o dobro do Décombaz 2011. Painel à direita: texto de pós e livro-caixa que acumula, agrupado
 * por medida (fígado g/h · fígado g · músculo · revisão), para não misturar unidades. O último passo é a soma dos cinco.
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
                <Panel className="flex min-w-0 flex-1 flex-col gap-2.5 px-5 py-3.5">
                    <motion.div key={step} className="flex flex-col gap-1.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 text-[23px] font-bold leading-tight" style={{ ...BODY_FONT, color: s.color }}>{s.headline}</h3>
                        <p className="m-0 leading-snug text-gray-100" style={{ fontSize: step >= 3 ? 16 : 17 }}>{s.text}</p>
                        <p className="m-0 text-[16px] italic leading-snug text-gray-300">{s.note}</p>
                    </motion.div>
                    <div className="mt-auto flex flex-col gap-2">
                        <LiverLedger step={step} />
                        <Source>{sourcesUpTo(LIVER_STEPS.map(x => x.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
}
