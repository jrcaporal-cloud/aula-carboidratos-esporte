import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Stamp } from './kit/Stamp';
import { AnimalChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source, StepTabs } from './kit/ui';
import { LactateMap } from './ato3/LactateMap';
import { LACTATE_ROWS, LACTATE_STEPS, type LactateRow } from './ato3/lactate.content';

/**
 * Slide 43 · Lactato é Moeda, não Lixo. Composição espelhada em relação à Glicólise: o painel à esquerda e o mapa
 * de órgãos à direita, onde o lactato circula como moeda (lançadeira → ciclo de Cori → fluxo medido por Hui 2017).
 * O livro-caixa do painel acumula; a leitura antiga fica riscada com o carimbo, não some.
 */

const ACCENT = [C.muted, C.lactate, C.glucose, C.lactate] as const;
const TONE: Record<LactateRow['tone'], string> = { old: '#9CA3AF', lactate: C.lactate, glucose: C.glucoseSoft };

const CHIPS: readonly (readonly string[])[] = [['leitura clássica'], ['revisão'], ['estequiometria: livro-texto'], []];

const Row = ({ r, i, step }: { r: LactateRow; i: number; step: number }) => {
    const myth = r.tone === 'old' && step >= 1;
    return (
        <motion.div className="flex items-center justify-between gap-3 border-t-2 border-white/10 py-0.5"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.4, 0.12) : 0, ease: EASE_OUT }}>
            <span className="min-w-0 text-[17px] font-semibold leading-tight text-gray-100">{r.label}</span>
            <span className="flex shrink-0 items-center gap-2">
                <span className={`font-display text-[20px] font-bold leading-tight ${myth ? 'line-through decoration-[3px]' : ''}`} style={{ color: TONE[r.tone] }}>{r.value}</span>
                {myth && <Stamp verdict="mito" />}
            </span>
        </motion.div>
    );
};

export default function LactateCurrencySim() {
    const { step, setStep } = useSlideSteps(LACTATE_STEPS.length);
    const s = LACTATE_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={LACTATE_STEPS.map(l => l.tab)} step={step} onSelect={setStep} layoutId="lactate-tabs" />
                <div className="flex flex-wrap justify-end gap-2">
                    {CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
                    {step === 3 && <AnimalChip>camundongo · ¹³C · repouso</AnimalChip>}
                </div>
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-3">
                    <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: ACCENT[step] }}>{s.headline}</h3>
                        <p className="m-0 text-[17px] leading-snug text-gray-100">{s.text}</p>
                    </motion.div>
                    <div className="mt-auto flex flex-col gap-2">
                        <div className="flex flex-col">
                            {LACTATE_ROWS.filter(r => r.at <= step).map((r, i) => <Row key={r.label} r={r} i={i} step={step} />)}
                        </div>
                        <Source>{sourcesUpTo(LACTATE_STEPS.map(l => l.sources), step)}</Source>
                    </div>
                </Panel>
                <Panel className="shrink-0 px-2 py-1"><LactateMap step={step} /></Panel>
            </div>
        </div>
    );
}
