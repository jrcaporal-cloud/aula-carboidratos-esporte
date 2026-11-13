import { motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { AnimalChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { AbsorbFrame, StepText } from './ato2/AbsorbFrame';
import { FructoseLanes } from './ato2/FructoseLanes';
import { PATH_LEDGER, PATH_STEPS, type PathChip } from './ato2/fructosePath.content';

/**
 * Slide 27 · O Caminho da Frutose e da Galactose. Palco em duas faixas paralelas (ato2/FructoseLanes): frutose e
 * galactose, cada uma com 3 elos (intestino → fígado → músculo), um número por elo e a espécie no selo do elo.
 * Painel: texto do passo + livro-caixa da cadeia, que acumula um elo por passo + fontes acumuladas.
 */
const CHIP: Record<PathChip, ReactElement> = {
    animal: <AnimalChip>camundongo · traçadores</AnimalChip>,
    review: <DesignChip>revisão · traçadores · humanos</DesignChip>,
    lecoultre: <DesignChip>cruzado · n = 7 · traçadores</DesignChip>,
    leijssen: <DesignChip>cruzado randomizado · n = 8 · ¹³C</DesignChip>,
    summary: <DesignChip>síntese: camundongo, revisão, n = 7, n = 8</DesignChip>,
};

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-[3px] text-left">
        <tbody>
            {PATH_LEDGER.filter(r => r.at <= step).map(r => (
                <motion.tr key={r.what} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, delay: r.at === step ? 0.6 : 0, ease: EASE_OUT }}
                    className={r.at === step ? 'text-[18px] font-semibold leading-tight' : 'text-[16px] leading-tight'}>
                    <td className="pr-3 text-gray-100">{r.what}</td>
                    <td className="whitespace-nowrap text-right font-semibold tabular-nums" style={{ color: r.color }}>{r.value}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function FructosePathSim() {
    const { step, setStep } = useSlideSteps(PATH_STEPS.length);
    const s = PATH_STEPS[step];
    return (
        <AbsorbFrame tabs={PATH_STEPS.map(p => p.tab)} step={step} setStep={setStep} layoutId="fructose-tabs"
            chips={s.chips.map(c => <span key={c}>{CHIP[c]}</span>)}>
            <Panel className="shrink-0 px-2 py-1"><FructoseLanes step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-3">
                <StepText step={step} headline={s.headline} color={s.color} text={s.text} />
                <div className="mt-auto flex flex-col gap-2">
                    <Ledger step={step} />
                    <Source>{sourcesUpTo(PATH_STEPS.map(p => p.sources), step)}</Source>
                </div>
            </Panel>
        </AbsorbFrame>
    );
}
