import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { DesignChip, ViaReviewChip } from './kit/chips';
import { BarRow, SourceLine, StepHeader } from './ato3/shared';
import { FirstBout, RescueLanes } from './ato3/RescueLanes';
import { FORCE, RESCUE_STEPS } from './ato3/rescue.content';

/**
 * Slide 49 · O Resgate pela Veia. História com cronômetro: a primeira exaustão (~170 min), três raias
 * (placebo 10, oral 26, IV 43 min), Copenhague 1939 como raia histórica, e a força caindo com a hipoglicemia (Nybo).
 */

const Force = () => (
    <div className="flex w-full flex-col gap-4">
        <span className="text-[18px] text-gray-300">força média sustentada por 2 min, depois de 3 h de bicicleta</span>
        {FORCE.map((f, i) => (
            <BarRow key={f.key} label={f.label} value={f.value} max={260} text={f.text} labelWidth={200}
                color={f.key === 'p' ? C.co2 : f.key === 'g' ? C.glucose : C.stone} delay={stagger(i, 0.1, 0.15)} />
        ))}
        <span className="text-[19px] text-gray-100">glicemia com placebo: <b style={{ color: C.risk }}>3,0 mM</b>; ativação central caiu</span>
    </div>
);

const CHIPS = [
    <DesignChip key="d">cruzado · n = 7 · não cego</DesignChip>,
    <DesignChip key="d">cruzado · n = 7 · não cego</DesignChip>,
    <DesignChip key="d">cruzado · n = 7 · não cego</DesignChip>,
    <ViaReviewChip key="v">via revisão</ViaReviewChip>,
    <DesignChip key="d">cruzado · n = 8</DesignChip>,
];

export default function RescueSim() {
    const { step } = useSlideSteps(RESCUE_STEPS.length);
    const reduce = useReducedMotion();
    const s = RESCUE_STEPS[step];
    const panelKey = step === 0 ? 'first' : step === 4 ? 'force' : 'lanes';
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-4 overflow-hidden">
            <StepHeader beat={step} chips={CHIPS[step]}>{s.phrase}</StepHeader>
            <motion.div key={panelKey} className="flex min-h-0 flex-1 items-center"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                {step === 0 && <FirstBout />}
                {step >= 1 && step <= 3 && <RescueLanes run={step >= 2} showHistoric={step === 3} />}
                {step === 4 && <Force />}
            </motion.div>
            <SourceLine>{s.source}</SourceLine>
        </div>
    );
}
