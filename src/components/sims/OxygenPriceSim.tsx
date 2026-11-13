import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { MotorFrame, StepText } from './ato3/motorB';
import { rowEnter } from './ato3/motorBRow';
import { OxygenFlow } from './ato3/OxygenFlow';
import { OXY_LEDGER, OXY_STEPS } from './ato3/oxygen.content';

/**
 * Slide 46 · O Preço do Oxigênio. O palco é a cadeia de causa em 4 quadros numerados (ato3/OxygenFlow): o FADH₂
 * rende menos ATP por O → a gordura gera mais FADH₂ → o litro de O₂ rende menos → na prova, o O₂ é o teto.
 * O painel traz o texto do passo e o livro-caixa carboidrato × gordura, que acumula.
 */

const ACCENT = [C.stone, C.fat, C.glucose, C.glucoseSoft] as const;

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-[3px] text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">P/O: NADH 2,5 · FADH₂ 1,5</th>
                <th className="text-right font-normal" style={{ color: C.glucoseSoft }}>carboidrato</th>
                <th className="text-right font-normal" style={{ color: C.fat }}>gordura</th>
            </tr>
        </thead>
        <tbody>
            {OXY_LEDGER.filter(r => r.at <= step).map((r, i) => (
                <motion.tr key={r.label} {...rowEnter(r.at === step, i)}
                    className={r.total ? 'text-[20px] font-bold' : 'text-[17px] font-semibold'} style={{ color: r.total ? C.glucoseSoft : '#F3F4F6' }}>
                    <td className="whitespace-nowrap">{r.label}</td>
                    <td className="whitespace-nowrap text-right tabular-nums">{r.cho}</td>
                    <td className="whitespace-nowrap text-right tabular-nums">{r.total && r.at === step ? <KeyFact color={C.fat} delay={0.8}>{r.fat}</KeyFact> : r.fat}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function OxygenPriceSim() {
    const { step, setStep } = useSlideSteps(OXY_STEPS.length);
    const s = OXY_STEPS[step];
    const chips = (
        <>
            {s.design.map(d => <DesignChip key={d}>{d}</DesignChip>)}
            {s.calc && <CalcChip>{s.calc}</CalcChip>}
        </>
    );
    return (
        <MotorFrame tabs={OXY_STEPS.map(o => o.tab)} step={step} setStep={setStep} layoutId="oxy-tabs" chips={chips}>
            <Panel className="w-[640px] shrink-0 p-2"><OxygenFlow step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <div className="mt-auto flex flex-col gap-2">
                    <Ledger step={step} />
                    <Source>{sourcesUpTo(OXY_STEPS.map(o => o.sources), step)}</Source>
                </div>
            </Panel>
        </MotorFrame>
    );
}
