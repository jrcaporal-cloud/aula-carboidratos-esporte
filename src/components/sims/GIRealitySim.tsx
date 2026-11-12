import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { DesignChip } from './kit/chips';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Source } from './kit/ui';
import { GIRealityChart } from './ato6/GIRealityChart';
import { GI_LEDGER, GI_STEPS } from './ato6/gireality.content';
import { PcFrame, PcHead } from './ato6/pcFrame';

/**
 * Slide 113 · A Vida Real do Intestino. Palco: o que 221 atletas comeram em prova contra os 90 g/h da diretriz,
 * a faixa individual, a maratona em foco, a coluna de sintomas graves, a correlação nos Ironman e o ultra-trail.
 * Painel: o texto do passo e um livro-caixa que ganha um dado-chave por passo e não perde nenhum.
 */

const STAGE_W = 690;

const Ledger = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <ul className="m-0 flex list-none flex-col gap-1.5 border-t-2 border-white/15 p-0 pt-2.5">
            {GI_LEDGER.filter(l => l.at <= step).map(l => (
                <motion.li key={l.value} className="grid grid-cols-[124px_1fr] items-baseline gap-3"
                    initial={reduce ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, delay: l.at === step ? 0.4 : 0, ease: EASE_OUT }}>
                    <span className="font-display text-[22px] font-bold leading-none tabular-nums" style={{ color: l.color }}>
                        {l.at === step ? <KeyFact color={l.color} delay={0.55}>{l.value}</KeyFact> : l.value}
                    </span>
                    <span className="text-[16px] leading-snug text-gray-100">{l.label}</span>
                </motion.li>
            ))}
        </ul>
    );
};

export default function GIRealitySim() {
    const { step, setStep } = useSlideSteps(GI_STEPS.length);
    const s = GI_STEPS[step];
    return (
        <PcFrame tabs={GI_STEPS.map(g => g.tab)} step={step} onSelect={setStep} layoutId="gireality-tabs" stageWidth={STAGE_W}
            chips={s.chips.map(c => <DesignChip key={c}>{c}</DesignChip>)}
            stage={<GIRealityChart step={step} />}
            panel={<>
                <PcHead step={step} color={s.color} headline={s.headline} text={s.text} />
                <div className="mt-auto flex flex-col gap-2.5">
                    <Ledger step={step} />
                    <Source>{sourcesUpTo(GI_STEPS.map(g => g.sources), step)}</Source>
                </div>
            </>}
        />
    );
}
