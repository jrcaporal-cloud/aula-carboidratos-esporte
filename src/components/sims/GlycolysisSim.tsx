import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source, StepTabs } from './kit/ui';
import { GlycolysisMap } from './ato3/GlycolysisMap';
import { CALC_CHIP, GLYCO_CHIPS, GLYCO_STEPS, LEDGER } from './ato3/glycolysis.content';

/**
 * Slide 42 · A Escada da Glicólise, no formato palco + painel. À esquerda, a via inteira se monta passo a passo
 * (10 enzimas, os 3 portões, ATP e NADH no degrau certo, o circuito do NAD⁺); à direita, o texto do passo e o
 * livro-caixa por glicose, que acumula. Nada some: o quadro final é a soma dos quatro passos.
 */

const ACCENT = [C.glucose, C.ok, C.glucoseSoft, C.lactate] as const;

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-1 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">por glicose</th>
                <th className="text-right font-normal">do sangue</th>
                <th className="text-right font-normal" style={{ color: C.glycogenSoft }}>do glicogênio</th>
            </tr>
        </thead>
        <tbody>
            {LEDGER.filter(r => r.at <= step).map((r, i) => (
                <motion.tr key={r.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.55, 0.12) : 0, ease: EASE_OUT }}
                    className={r.total ? 'font-display text-[24px] font-bold' : 'text-[18px] font-semibold'}
                    style={{ color: r.total ? C.glucose : '#F3F4F6' }}>
                    <td className={r.total ? 'pt-1' : ''}>{r.label}</td>
                    <td className="text-right tabular-nums">{r.blood}</td>
                    <td className="text-right tabular-nums">{r.glycogen}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function GlycolysisSim() {
    const { step, setStep } = useSlideSteps(GLYCO_STEPS.length);
    const s = GLYCO_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={GLYCO_STEPS.map(g => g.tab)} step={step} onSelect={setStep} layoutId="glyco-tabs" />
                <div className="flex flex-wrap justify-end gap-2">
                    {GLYCO_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
                    {CALC_CHIP[step] && <CalcChip>{CALC_CHIP[step]}</CalcChip>}
                </div>
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="shrink-0 px-2 py-1"><GlycolysisMap step={step} /></Panel>
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                    <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: ACCENT[step] }}>{s.headline}</h3>
                        <p className="m-0 text-[17px] leading-snug text-gray-100">{s.text}</p>
                    </motion.div>
                    <div className="mt-auto flex flex-col gap-3">
                        <Ledger step={step} />
                        <Source>{sourcesUpTo(GLYCO_STEPS.map(g => g.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
}
