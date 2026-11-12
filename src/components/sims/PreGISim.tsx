import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Narration, PanelFoot, PreRaceFrame } from './ato5/PreRaceFrame';
import { GIStage } from './ato5/GIStage';
import { FICHA, GI_STEPS } from './ato5/preGI.content';

/**
 * Slide 86 · IG Antes do Treino, palco + painel. Palco: lentilha × batata (Thomas 1991) → os 19 estudos de Burdon
 * (o quadrado de 1991 viaja para a grade) → o eixo do tamanho de efeito, sem e com CHO durante.
 * Painel: o passo e a ficha da meta-análise, que acumula linha a linha.
 */
const Ficha = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-1 text-left">
        <tbody>
            {FICHA.filter(r => r.at <= step).map((r, i) => (
                <motion.tr key={r.k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.4, 0.08) : 0, ease: EASE_OUT }}>
                    <td className="w-[150px] align-top text-[16px] font-semibold" style={{ color: C.glucoseSoft }}>{r.k}</td>
                    <td className="text-[16px] leading-snug text-gray-100">{r.v}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function PreGISim() {
    const { step, setStep } = useSlideSteps(GI_STEPS.length);
    const s = GI_STEPS[step];
    return (
        <PreRaceFrame tabs={GI_STEPS.map(g => g.tab)} step={step} setStep={setStep} layoutId="pregi-tabs" stageWidth={644}
            chips={<>{s.chips.map(c => <DesignChip key={c}>{c}</DesignChip>)}</>}
            stage={<GIStage step={step} />}
            panel={<>
                <Narration step={step} headline={s.headline} color={s.color} text={s.text} limit={s.limit} />
                <PanelFoot sources={sourcesUpTo(GI_STEPS.map(g => g.sources), step)}>
                    <Ficha step={step} />
                </PanelFoot>
            </>} />
    );
}
