import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, ViaReviewChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { MotorFrame, StepText } from './ato3/motorB';
import { rowEnter } from './ato3/motorBRow';
import { BostonTimeline } from './ato3/BostonParts';
import { BOSTON_LEDGER, BOSTON_STEPS } from './ato3/boston.content';

/**
 * Slide 48 · Boston, 1923, como história com marcos e evidência. Palco: a linha do tempo em escala de anos, um objeto por
 * marco e a escada da evidência embaixo. Painel: o texto do passo e um cartão por marco (desenho + resultado), que acumula.
 */

const ACCENT = [C.risk, C.glucose, C.glucoseSoft] as const;

const CHIPS = [
    <ViaReviewChip key="v">Levine 1924: via revisão</ViaReviewChip>,
    <ViaReviewChip key="v">1939: via Bergström 1967 · Noakes 2022</ViaReviewChip>,
    <DesignChip key="d">1987: cruzado · placebo · n = 7</DesignChip>,
];

const Cards = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-1.5">
        {BOSTON_LEDGER.filter(r => r.at <= step).map((r, i) => (
            <motion.div key={r.year} {...rowEnter(r.at === step, i)} className="grid items-baseline gap-3 rounded-xl border-2 px-3 py-1"
                style={{ gridTemplateColumns: '58px 1fr', borderColor: r.at === step ? `${ACCENT[r.at]}AA` : 'rgba(255,255,255,0.14)' }}>
                <span className="font-display text-[22px] font-bold tabular-nums text-white">{r.year}</span>
                <div className="flex flex-col">
                    <span className="text-[16px] leading-tight text-gray-300">{r.design}</span>
                    <span className="text-[18px] font-bold leading-snug" style={{ color: r.at === 0 ? C.risk : '#F3F4F6' }}>{r.result}</span>
                </div>
            </motion.div>
        ))}
    </div>
);

export default function Boston1923Sim() {
    const { step, setStep } = useSlideSteps(BOSTON_STEPS.length);
    const s = BOSTON_STEPS[step];
    return (
        <MotorFrame tabs={BOSTON_STEPS.map(b => b.tab)} step={step} setStep={setStep} layoutId="boston-tabs" chips={CHIPS[step]}>
            <Panel className="flex w-[640px] shrink-0 items-center px-2 py-2">
                <BostonTimeline step={step} />
            </Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-2 px-5 py-3.5">
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <div className="mt-auto flex flex-col gap-1.5">
                    <Cards step={step} />
                    <Source>{sourcesUpTo(BOSTON_STEPS.map(b => b.sources), step)}</Source>
                </div>
            </Panel>
        </MotorFrame>
    );
}
