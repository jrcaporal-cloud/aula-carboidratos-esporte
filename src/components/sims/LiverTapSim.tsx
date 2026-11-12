import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { KeyFact, Reveal } from './kit/rhythm';
import { CountUp } from './kit/CountUp';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { MotorFrame, StepText } from './ato3/motorB';
import { rowEnter } from './ato3/motorBRow';
import { LiverTap } from './ato3/LiverTap';
import { LIVER_LEDGER, LIVER_STEPS } from './ato3/liver.content';

/**
 * Slide 47 · Quem Defende os 4 Gramas. Palco: fígado (torneira) → sangue (~4 g) → músculo (ralo), com jato e ralo
 * na mesma escala e o fluxo de glicose em laço lento. Painel: o texto do passo e o livro-caixa produção × utilização ×
 * glicemia por intensidade, que acumula até o quadro final.
 */

const ACCENT = [C.glucose, C.insulinSoft, C.glucoseSoft, C.insulinSoft] as const;

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-[3px] text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">fase</th>
                <th className="text-right font-normal" style={{ color: C.glycogenSoft }}>fígado produz</th>
                <th className="text-right font-normal">músculo usa</th>
                <th className="text-right font-normal" style={{ color: C.glucoseSoft }}>glicemia</th>
            </tr>
        </thead>
        <tbody>
            {LIVER_LEDGER.filter(r => r.at <= step).map((r, i) => {
                const total = 'total' in r && r.total;
                return (
                    <motion.tr key={r.phase} {...rowEnter(r.at === step, i)}
                        className={total ? 'text-[19px] font-bold' : 'text-[17px] font-semibold'} style={{ color: total ? C.glucoseSoft : '#F3F4F6' }}>
                        <td className="whitespace-nowrap">{r.phase}</td>
                        {r.tap ? (
                            <>
                                <td className="whitespace-nowrap text-right tabular-nums">{total && r.at === step ? <KeyFact delay={0.8}>{r.tap}</KeyFact> : r.tap}</td>
                                <td className="whitespace-nowrap text-right tabular-nums">{r.drain}</td>
                                <td className="whitespace-nowrap text-right">{r.glyc}</td>
                            </>
                        ) : (
                            <td colSpan={3} className="text-right" style={{ color: C.insulinSoft }}>{r.glyc}</td>
                        )}
                    </motion.tr>
                );
            })}
        </tbody>
    </table>
);

export default function LiverTapSim() {
    const { step, setStep } = useSlideSteps(LIVER_STEPS.length);
    const s = LIVER_STEPS[step];
    const chips = (
        <>
            <DesignChip>{s.design}</DesignChip>
            <IllustrativeChip>glicemia ilustrativa · ×n são dados</IllustrativeChip>
        </>
    );
    return (
        <MotorFrame tabs={LIVER_STEPS.map(l => l.tab)} step={step} setStep={setStep} layoutId="liver-tabs" chips={chips}>
            <Panel className="flex w-[640px] shrink-0 items-center px-2 py-2">
                <LiverTap step={step} />
            </Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-2.5 px-5 py-3.5">
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <Reveal key={`stat-${step}`} order={1} className="flex items-baseline gap-3">
                    <CountUp text={s.stat} delay={0.2} className="whitespace-nowrap font-display text-[42px] font-bold leading-none"
                        style={{ color: ACCENT[step], wordSpacing: '0.15em' }} />
                    <span className="text-[17px] leading-snug text-gray-200">{s.statCaption}</span>
                </Reveal>
                <div className="mt-auto flex flex-col gap-2">
                    <Ledger step={step} />
                    <Source>{sourcesUpTo(LIVER_STEPS.map(l => l.sources), step)}</Source>
                </div>
            </Panel>
        </MotorFrame>
    );
}
