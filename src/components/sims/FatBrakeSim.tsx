import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Chip, Panel, Source, StepTabs } from './kit/ui';
import { FatGate } from './ato3/FatGate';
import { FAT_ROWS, FAT_STEPS, type FatRow } from './ato3/fatbrake.content';

/**
 * Slide 45 · Por que a Gordura Trava no Alto. Uma cena, uma cadeia de causa: mais carboidrato → PDH aberta → acetil-CoA
 * em excesso → a CAT prende a carnitina → a CPT-I fica sem carnitina livre e a gordura cai (32 → 19 kJ/min, van Loon 2001).
 * A cena muda de estado a cada passo; o painel acumula os números com a fonte de cada um.
 */

const ACCENT = [C.fat, C.glucoseSoft, C.glucoseSoft, C.fat] as const;
const TONE: Record<FatRow['tone'], string> = { fat: C.fat, glucose: C.glucoseSoft, neutral: '#F3F4F6' };

const Chips = ({ step }: { step: number }) => (
    <>
        <IllustrativeChip>fichas: esquema</IllustrativeChip>
        <DesignChip>{step === 1 ? 'PDH: Howlett · n = 7 não treinados' : 'van Loon · biópsias · n = 8'}</DesignChip>
        {step === 3 && <Chip>CPT-I não medida</Chip>}
    </>
);

export default function FatBrakeSim() {
    const { step, setStep } = useSlideSteps(FAT_STEPS.length);
    const s = FAT_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={FAT_STEPS.map(f => f.tab)} step={step} onSelect={setStep} layoutId="fat-tabs" />
                <div className="flex flex-wrap justify-end gap-2"><Chips step={step} /></div>
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="shrink-0 overflow-hidden p-0"><FatGate step={step} /></Panel>
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-3">
                    <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: ACCENT[step] }}>{s.headline}</h3>
                        <p className="m-0 text-[17px] leading-snug text-gray-100">{s.text}</p>
                    </motion.div>
                    <div className="mt-auto flex flex-col gap-2">
                        <div className="flex flex-col">
                            {FAT_ROWS.filter(r => r.at <= step).map((r, i) => (
                                <motion.div key={r.label} className="flex items-baseline justify-between gap-3 border-t-2 border-white/10 py-0.5"
                                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.4, 0.1) : 0, ease: EASE_OUT }}>
                                    <span className="min-w-0 text-[16px] font-semibold leading-tight text-gray-100">{r.label}</span>
                                    <span className="shrink-0 font-display text-[19px] font-bold leading-tight tabular-nums" style={{ color: TONE[r.tone] }}>{r.value}</span>
                                </motion.div>
                            ))}
                        </div>
                        <Source>{sourcesUpTo(FAT_STEPS.map(f => f.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
}
