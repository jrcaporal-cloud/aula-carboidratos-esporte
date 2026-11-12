import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Panel, Source, StepTabs } from './kit/ui';
import { BigStat } from './kit/Stamp';
import { KeyFact, Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { CalcChip, DesignChip, FictionChip, IllustrativeChip } from './kit/chips';
import { CHART_W, WallChart } from './ato1/WallChart';
import { RunnerGrids, StoresStrip } from './ato1/WallParts';
import { SMYTH, WALL_KEY, WALL_STEPS } from './ato1/wall.content';

/**
 * Slide 10 · O Km 32, a abertura da aula. Palco: a Marina (fictícia) anda sobre a própria curva de ritmo, que se
 * desenha até o 30 e despenca no 32, e embaixo os quatro lugares onde há glicose (músculo e fígado esvaziam junto).
 * No passo da pergunta, os quatro viram candidatos. Fecho: 100 corredores de cada sexo, 28 e 17 acendem (Smyth 2021).
 */
const STEPS = WALL_STEPS.length;
const QUESTION = 3;
const SMYTH_STEP = 4;

const KeyBlock = ({ step }: { step: number }) => {
    const k = WALL_KEY[step];
    if (step === SMYTH_STEP) {
        return (
            <div className="flex flex-col gap-3">
                <Reveal order={1}><RunnerGrids /></Reveal>
                <Reveal order={2}><span className="text-[16px] font-semibold leading-snug" style={{ color: C.caveat }}>{SMYTH.limit}</span></Reveal>
            </div>
        );
    }
    if (step === QUESTION) {
        return (
            <Reveal order={1} className="px-2">
                <KeyFact color={C.glycogenSoft}>
                    <span className="block whitespace-pre-line font-display text-[64px] font-bold leading-none tracking-tight" style={{ color: C.glycogenSoft }}>{k.value}</span>
                </KeyFact>
            </Reveal>
        );
    }
    return (
        <Reveal order={1}>
            <BigStat value={k.value} caption={k.caption} color={step === 2 ? C.risk : C.glucose} size={72} delay={0.2} />
        </Reveal>
    );
};

export default function WallSim() {
    const { step, setStep } = useSlideSteps(STEPS);
    const s = WALL_STEPS[step];
    const calc = WALL_KEY[step].calc;
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={WALL_STEPS.map(w => w.tab)} step={step} onSelect={setStep} layoutId="wall-tabs" />
                <div className="flex shrink-0 justify-end gap-2">
                    <FictionChip />
                    <IllustrativeChip>curva ilustrativa</IllustrativeChip>
                    {calc && <CalcChip>{calc}</CalcChip>}
                    {step === SMYTH_STEP && <DesignChip>{SMYTH.design}</DesignChip>}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 gap-4">
                <div className="flex shrink-0 flex-col gap-3" style={{ width: CHART_W + 4 }}>
                    <Panel className="shrink-0"><WallChart step={step} /></Panel>
                    <Panel className="min-h-0 flex-1"><StoresStrip step={step} /></Panel>
                </div>

                <Panel className="flex min-w-0 flex-1 flex-col gap-2 px-5 py-3">
                    <motion.div key={step} className="flex flex-col gap-1.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: C[s.color] }}>{s.headline}</h3>
                        <p className="m-0 text-[17px] leading-snug text-gray-100">{s.text}</p>
                    </motion.div>
                    <div key={`k-${step}`} className="flex flex-1 flex-col justify-center">
                        <KeyBlock step={step} />
                    </div>
                    <Source>{sourcesUpTo(WALL_STEPS.map(w => w.sources), step)}</Source>
                </Panel>
            </div>
        </div>
    );
}
