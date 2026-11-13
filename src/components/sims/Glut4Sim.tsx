import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { AnimalChip, DesignChip, IllustrativeChip } from './kit/chips';
import { Model3DHint } from './kit/Model3DHint';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source, StepTabs } from './kit/ui';
import { ScaleBar } from './ato3/chainStrip';
import { Glut4Door } from './ato3/Glut4Door';
import {
    GLUT4_BARS, GLUT4_BAR_MAX, GLUT4_CHART_TITLE, GLUT4_CHART_UNIT, GLUT4_CHIPS, GLUT4_STEPS, type Glut4Tone,
} from './ato3/glut4.content';

/**
 * Slide 40 · Duas Chaves para a Mesma Porta. Uma cena (a fibra em corte: a porta GLUT4 e as duas chaves, insulina pela
 * PI3K e contração por Ca²⁺/AMPK/Rac1) que muda de estado a cada passo; no painel, o texto do passo e UM gráfico de UM
 * estudo (Lund 1995, a mesma série): só insulina → só contração → as duas. As barras acumulam; nada some.
 */

const TONE: Record<Glut4Tone, string> = { glucose: C.glucose, insulin: C.insulinSoft, contraction: C.stone };
const ACCENT = [C.glucose, C.insulinSoft, C.stone, C.glucose] as const;

/** O gráfico do Lund 1995: título e unidade sempre visíveis; cada barra entra no seu passo e fica. */
const LundChart = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex flex-col border-t-2 border-white/10 pt-1.5">
            <span className="text-[16px] font-bold leading-tight text-white">{GLUT4_CHART_TITLE}</span>
            <span className="text-[16px] leading-tight text-gray-300">{GLUT4_CHART_UNIT}</span>
        </div>
        {GLUT4_BARS.map(b => (
            b.at <= step
                ? <ScaleBar key={b.label} label={b.label} value={b.value} text={b.text} max={GLUT4_BAR_MAX} color={TONE[b.tone]}
                    delay={b.at === step ? 0.45 : 0} labelWidth={118} />
                : (
                    <div key={b.label} className="flex items-center gap-2">
                        <span className="w-[118px] shrink-0 text-[16px] font-semibold text-gray-500">{b.label}</span>
                        <div className="h-[24px] flex-1 rounded-r-md border-2 border-dashed border-slate-700" />
                        <span className="w-[74px]" />
                    </div>
                )
        ))}
    </div>
);

export default function Glut4Sim() {
    const { step, setStep } = useSlideSteps(GLUT4_STEPS.length);
    const s = GLUT4_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={GLUT4_STEPS.map(g => g.tab)} step={step} onSelect={setStep} layoutId="glut4-tabs" />
                <div className="flex flex-wrap justify-end gap-2">
                    {step >= 1 && <AnimalChip>rato · sóleo isolado</AnimalChip>}
                    {step >= 1 && <IllustrativeChip>vesículas: esquema</IllustrativeChip>}
                    {GLUT4_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
                    {step === 0 && <Model3DHint label="a fibra" />}
                </div>
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="flex shrink-0 items-center px-2 py-1"><Glut4Door step={step} insulin={s.insulin} contraction={s.contraction} docked={s.docked} /></Panel>
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-3">
                    <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: ACCENT[step] }}>{s.headline}</h3>
                        <p className="m-0 text-[17px] leading-snug text-gray-100">{s.text}</p>
                    </motion.div>
                    <div className="mt-auto flex flex-col gap-2">
                        <LundChart step={step} />
                        <Source>{sourcesUpTo(GLUT4_STEPS.map(g => g.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
}
