import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { useTween } from './kit/useTween';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source, StepTabs } from './kit/ui';
import { CrossoverChart, VanLoonStrip } from './ato3/CrossoverChart';
import { CROSS_ROWS, CROSS_STEPS, I_MAX, I_MIN, mixAt } from './ato3/crossover.content';

/**
 * Slide 44 · O Cruzamento. Gráfico grande + painel. O passador leva o cursor a 25 → 65 → 85%, mostra a medida de
 * van Loon numa régua própria (kJ/min) e, por fim, o treinado a 65%. Slider e botão de treino mexem ao vivo.
 * As áreas são modelo (selo "ilustrativo"); o livro-caixa do painel guarda só o que foi medido ou dito pelas fontes.
 */

interface Manual { step: number; intensity?: number; trained?: boolean }

const round5 = (f: number) => Math.round((f * 100) / 5) * 5;
const ACCENT = [C.fat, C.glycogenSoft, C.glycogenSoft, C.fat, C.text] as const;
const CHIPS: readonly (readonly string[])[] = [
    ['isótopos · n = 5 treinados'], ['isótopos · n = 5', 'modelo conceitual'], ['isótopos · n = 5', 'modelo conceitual'],
    ['isótopos + biópsias · n = 8'], ['modelo conceitual'],
];

const Toggle = ({ trained, onChange }: { trained: boolean; onChange: (t: boolean) => void }) => (
    <div className="flex shrink-0 gap-2" role="radiogroup" aria-label="Estado de treino">
        {[false, true].map(t => (
            <button key={String(t)} type="button" role="radio" aria-checked={trained === t} onClick={() => onChange(t)}
                className="cursor-pointer rounded-xl border-2 px-3 py-1 text-[17px] font-semibold transition-colors duration-200"
                style={{ borderColor: trained === t ? C.text : '#475569', background: trained === t ? C.text : 'transparent', color: trained === t ? '#04080F' : '#E5E7EB' }}>
                {t ? 'treinado' : 'destreinado'}
            </button>
        ))}
    </div>
);

const Ledger = ({ step }: { step: number }) => (
    <div className="flex flex-col">
        {CROSS_ROWS.filter(r => r.at <= step).map((r, i) => (
            <motion.div key={r.label} className="flex items-baseline justify-between gap-3 border-t-2 border-white/10 py-0.5"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.4, 0) : 0, ease: EASE_OUT }}>
                <span className="min-w-0 text-[16px] font-semibold leading-tight text-gray-100">{r.label}</span>
                <span className="shrink-0 font-display text-[19px] font-bold leading-tight" style={{ color: r.color }}>{r.value}</span>
            </motion.div>
        ))}
    </div>
);

export default function CrossoverSim() {
    const { step, setStep } = useSlideSteps(CROSS_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const preset = CROSS_STEPS[step];
    const [manual, setManual] = useState<Manual>({ step: -1 });
    const own = manual.step === step ? manual : null;
    const target = own?.intensity ?? preset.intensity;
    const trained = own?.trained ?? preset.trained;
    const intensity = useTween(target, reduce, 600);
    const mix = mixAt(intensity, trained);
    const cho = round5(mix.plasmaGlucose + mix.glycogen);

    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={CROSS_STEPS.map(c => c.tab)} step={step} onSelect={setStep} layoutId="cross-tabs" />
                <div className="flex flex-wrap justify-end gap-2">
                    <IllustrativeChip>áreas: modelo ilustrativo</IllustrativeChip>
                    {CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
                </div>
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="flex shrink-0 flex-col gap-2 px-2 py-1">
                    <CrossoverChart intensity={intensity} trained={trained} />
                    <div className="flex items-center gap-4 px-2">
                        <label className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="text-[17px] text-gray-100">intensidade: <b className="text-white">{Math.round(intensity)}% do VO₂máx</b>
                                <span className="text-gray-300"> · modelo: ~{cho}% CHO</span></span>
                            <input type="range" min={I_MIN} max={I_MAX} step={1} value={Math.round(target)}
                                onChange={e => setManual({ step, trained, intensity: Number(e.target.value) })}
                                className="h-3 w-full cursor-pointer accent-amber-500" aria-label="Intensidade em % do VO₂máx" />
                        </label>
                        <Toggle trained={trained} onChange={t => setManual({ step, intensity: target, trained: t })} />
                    </div>
                    <VanLoonStrip show={step >= 3} />
                </Panel>
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-3">
                    <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: ACCENT[step] }}>{preset.headline}</h3>
                        <p className="m-0 text-[17px] leading-snug text-gray-100">{preset.text}</p>
                    </motion.div>
                    <div className="mt-auto flex flex-col gap-2">
                        <Ledger step={step} />
                        <Source>{sourcesUpTo(CROSS_STEPS.map(c => c.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
}
