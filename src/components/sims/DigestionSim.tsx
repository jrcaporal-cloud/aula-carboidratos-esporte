import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { AbsorbFrame, StepText } from './ato2/AbsorbFrame';
import { DigestionScene } from './ato2/DigestionScene';
import { DIGEST_CHIPS, DIGEST_PARTS, DIGEST_STEPS } from './ato2/digestion.content';

/**
 * Slide 25 · Da Boca ao Sangue, no formato palco + painel. À esquerda, o corte do intestino se monta da luz
 * ao fígado (amilase, borda em escova, SGLT1 + Na⁺ com a bomba, GLUT5 + KHK, GLUT2) e nada apaga;
 * à direita, o texto do passo e o livro-caixa das peças, que acumula.
 */
const Parts = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-[3px] text-left">
        <tbody>
            {DIGEST_PARTS.filter(p => p.at <= step).map((p, i) => (
                <motion.tr key={p.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, delay: p.at === step ? stagger(i, 0.5, 0.1) : 0, ease: EASE_OUT }}
                    className="text-[16px] leading-tight">
                    <td className="whitespace-nowrap pr-3 font-semibold" style={{ color: p.color }}>{p.name}</td>
                    <td className="text-gray-100">{p.does}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function DigestionSim() {
    const { step, setStep } = useSlideSteps(DIGEST_STEPS.length);
    const s = DIGEST_STEPS[step];
    return (
        <AbsorbFrame tabs={DIGEST_STEPS.map(d => d.tab)} step={step} setStep={setStep} layoutId="digest-tabs"
            chips={DIGEST_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}>
            <Panel className="shrink-0 px-1 py-1"><DigestionScene step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-3">
                <StepText step={step} headline={s.headline} color={s.color} text={s.text} />
                <div className="mt-auto flex flex-col gap-2">
                    <Parts step={step} />
                    <Source>{sourcesUpTo(DIGEST_STEPS.map(d => d.sources), step)}</Source>
                </div>
            </Panel>
        </AbsorbFrame>
    );
}
