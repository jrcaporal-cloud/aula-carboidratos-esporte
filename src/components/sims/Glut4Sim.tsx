import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { AnimalChip, DesignChip } from './kit/chips';
import { Model3DHint } from './kit/Model3DHint';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source, StepTabs } from './kit/ui';
import { Glut4Door } from './ato3/Glut4Door';
import { GLUT4_CHIPS, GLUT4_ROWS, GLUT4_STEPS, GLUT4_UNITS, type Glut4Tone } from './ato3/glut4.content';

/**
 * Slide 40 · Duas Chaves para a Mesma Porta, no formato palco + painel. À esquerda, a fibra em corte: as vesículas de
 * GLUT4 sobem à sarcolema e ao túbulo T conforme as chaves giram (insulina pela PI3K, contração por Ca²⁺/AMPK/Rac1).
 * À direita, o texto do passo e o livro de bancada (Lund 1995 → Mikines 1988), que acumula. Nada some.
 */

const TONE: Record<Glut4Tone, string> = { glucose: C.glucose, insulin: C.insulinSoft, contraction: C.stone };
const ACCENT = [C.glucose, C.insulinSoft, C.stone, C.glucose, C.insulinSoft] as const;

const Ledger = ({ step }: { step: number }) => (
    <div className="flex flex-col">
        {GLUT4_ROWS.filter(r => r.at <= step).map((r, i) => (
            <motion.div key={r.label} className="flex items-baseline justify-between gap-3 border-t-2 border-white/10 py-0.5"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.45, 0) : 0, ease: EASE_OUT }}>
                <span className="min-w-0 text-[16px] font-semibold leading-tight text-gray-100">{r.label}</span>
                <span className="shrink-0 font-display text-[20px] font-bold leading-tight tabular-nums" style={{ color: TONE[r.tone] }}>{r.value}</span>
            </motion.div>
        ))}
        <span className="border-t-2 border-white/10 pt-1 text-[14px] text-gray-400">{GLUT4_UNITS[Math.min(step, GLUT4_UNITS.length - 1)]}</span>
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
                    {step >= 1 && step <= 3 && <AnimalChip>sóleo de rato isolado</AnimalChip>}
                    {GLUT4_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
                    {step === 0 && <Model3DHint label="a fibra" />}
                </div>
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="shrink-0 px-2 py-1"><Glut4Door step={step} insulin={s.insulin} contraction={s.contraction} docked={s.docked} /></Panel>
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-3">
                    <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: ACCENT[step] }}>{s.headline}</h3>
                        <p className="m-0 text-[17px] leading-snug text-gray-100">{s.text}</p>
                    </motion.div>
                    <div className="mt-auto flex flex-col gap-2">
                        <Ledger step={step} />
                        <Source>{sourcesUpTo(GLUT4_STEPS.map(g => g.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
}
