import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { AnimalChip, DesignChip } from './kit/chips';
import { Model3DHint } from './kit/Model3DHint';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { AbsorbFrame, StepText } from './ato2/AbsorbFrame';
import { LaneCell } from './ato2/LaneCell';
import { LaneChart } from './ato2/LaneChart';
import { LANE_LEDGER, LANE_STEPS } from './ato2/twoLanes.content';

/**
 * Slide 26 · Duas Pistas no Intestino, em tríptico: o enterócito com as moléculas fluindo (laço, o fluxo é o
 * conteúdo), o gráfico do Jentjens 2004 (ingerido × oxidado, com a faixa do teto) e o painel do passo com
 * o livro-caixa das conclusões. O último passo acumula tudo.
 */
const Chips = ({ step }: { step: number }) => (
    <>
        {step === 0 && <DesignChip>revisão</DesignChip>}
        {(step === 1 || step === 2) && <DesignChip>cruzado randomizado · n = 8 · sem desempenho</DesignChip>}
        {step === 3 && <DesignChip>gráfico: n = 8</DesignChip>}
        {step === 3 && <AnimalChip>camundongo knockout</AnimalChip>}
        <Model3DHint label="enterócito" />
    </>
);

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-[3px] text-left">
        <tbody>
            {LANE_LEDGER.filter(r => r.at <= step).map(r => (
                <motion.tr key={r.what} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, delay: r.at === step ? 0.6 : 0, ease: EASE_OUT }}
                    className={r.at === step ? 'text-[19px] font-semibold leading-tight' : 'text-[16px] leading-tight'}>
                    <td className="pr-3 text-gray-100">{r.what}</td>
                    <td className="text-right font-semibold tabular-nums" style={{ color: r.color }}>{r.value}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function TwoLanesSim() {
    const { step, setStep } = useSlideSteps(LANE_STEPS.length);
    const s = LANE_STEPS[step];
    return (
        <AbsorbFrame tabs={LANE_STEPS.map(l => l.tab)} step={step} setStep={setStep} layoutId="lanes-tabs" chips={<Chips step={step} />}>
            <Panel className="shrink-0 py-1"><LaneCell queueSize={s.queue} fructose={s.fructose} apicalGlut2={s.apicalGlut2} /></Panel>
            <Panel className="shrink-0 py-1"><LaneChart step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-2 px-4 py-3">
                <StepText step={step} headline={s.headline} color={s.color} text={s.text} />
                <div className="mt-auto flex flex-col gap-2">
                    <Ledger step={step} />
                    <Source>{sourcesUpTo(LANE_STEPS.map(l => l.sources), step)}</Source>
                </div>
            </Panel>
        </AbsorbFrame>
    );
}
