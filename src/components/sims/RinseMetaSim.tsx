import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { DesignChip } from './kit/chips';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Stamp } from './kit/Stamp';
import { Source } from './kit/ui';
import { RinseMetaStage } from './ato6/RinseMetaStage';
import { META_LEDGER, META_STEPS } from './ato6/rinsemeta.content';
import { PcFrame, PcHead } from './ato6/pcFrame';

/**
 * Slide 111 · O Tamanho Real do Bochecho. Palco: a floresta da meta-análise cresce (potência, depois tempo),
 * a revisão anterior fica no rodapé da floresta, e dois ensaios entram e ficam (Lane: jejum × alimentado;
 * Trommelen: o nulo bem feito). Painel: texto do passo, livro-caixa que acumula e, no fim, o carimbo "depende".
 */

const STAGE_W = 664;

const Ledger = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <ul className="m-0 flex list-none flex-col gap-1.5 border-t-2 border-white/15 p-0 pt-2.5">
            {META_LEDGER.filter(l => l.at <= step).map(l => (
                <motion.li key={l.value} className="grid grid-cols-[146px_1fr] items-baseline gap-3"
                    initial={reduce ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, delay: l.at === step ? 0.4 : 0, ease: EASE_OUT }}>
                    <span className="font-display text-[21px] font-bold leading-none tabular-nums" style={{ color: l.color }}>
                        {l.at === step ? <KeyFact color={l.color} delay={0.55}>{l.value}</KeyFact> : l.value}
                    </span>
                    <span className="text-[16px] leading-snug text-gray-100">{l.label}</span>
                </motion.li>
            ))}
        </ul>
    );
};

export default function RinseMetaSim() {
    const { step, setStep } = useSlideSteps(META_STEPS.length);
    const s = META_STEPS[step];
    const last = step === META_STEPS.length - 1;
    return (
        <PcFrame tabs={META_STEPS.map(m => m.tab)} step={step} onSelect={setStep} layoutId="rinsemeta-tabs" stageWidth={STAGE_W}
            chips={s.chips.map(c => <DesignChip key={c}>{c}</DesignChip>)}
            stage={<RinseMetaStage step={step} />}
            panel={<>
                <PcHead step={step} color={s.color} headline={s.headline} text={s.text} />
                {last && (
                    <div className="flex items-center gap-4">
                        <Stamp verdict="depende" />
                        <span className="text-[17px] font-semibold leading-snug text-gray-50">real e pequeno; maior em jejum; nem sempre aparece</span>
                    </div>
                )}
                <div className="mt-auto flex flex-col gap-2.5">
                    <Ledger step={step} />
                    <Source>{sourcesUpTo(META_STEPS.map(m => m.sources), step)}</Source>
                </div>
            </>}
        />
    );
}
