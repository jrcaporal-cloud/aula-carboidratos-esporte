import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { useTween } from './kit/useTween';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { SourceLine, StepHeader } from './ato3/shared';
import { CrossoverChart } from './ato3/CrossoverChart';
import { CROSS_STEPS, I_MAX, I_MIN, LAYERS, mixAt } from './ato3/crossover.content';

/**
 * Slide 44 · O Cruzamento. Interação ao vivo: o slider de intensidade e o botão de treino mexem no gráfico;
 * o passador também os move (25 → 55 → 85% e, por fim, treinado a 65%). Áreas ilustrativas, dado medido no passo 3.
 */

interface Manual { step: number; intensity?: number; trained?: boolean }

const round5 = (f: number) => Math.round((f * 100) / 5) * 5;

const Toggle = ({ trained, onChange }: { trained: boolean; onChange: (t: boolean) => void }) => (
    <div className="flex gap-2" role="radiogroup" aria-label="Estado de treino">
        {[false, true].map(t => (
            <button key={String(t)} type="button" role="radio" aria-checked={trained === t} onClick={() => onChange(t)}
                className="flex-1 cursor-pointer rounded-xl border-[3px] px-3 py-2 text-[19px] font-semibold transition-colors duration-200"
                style={{ borderColor: trained === t ? C.text : '#475569', background: trained === t ? C.text : 'transparent', color: trained === t ? '#04080F' : '#E5E7EB' }}>
                {t ? 'treinado' : 'destreinado'}
            </button>
        ))}
    </div>
);

export default function CrossoverSim() {
    const { step } = useSlideSteps(CROSS_STEPS.length);
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
        <div className="not-prose flex h-[500px] w-full flex-col gap-4 overflow-hidden">
            <StepHeader beat={step} chips={<><IllustrativeChip />{step === 2 && <DesignChip>isótopos · n = 8</DesignChip>}</>}>{preset.phrase}</StepHeader>
            <div className="flex min-h-0 flex-1 items-center gap-10">
                <div className="flex flex-col gap-3">
                    <CrossoverChart intensity={intensity} trained={trained} />
                    <div className="flex gap-4 pl-12">
                        {[...LAYERS].reverse().map(l => (
                            <span key={l.key} className="flex items-center gap-2 text-[17px] text-gray-100">
                                <span className="h-4 w-4 rounded-sm" style={{ background: l.color, opacity: l.opacity }} />
                                {l.label}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-5">
                    <label className="flex flex-col gap-2">
                        <span className="text-[20px] text-gray-100">intensidade: <b className="text-white">{Math.round(intensity)}% do VO₂máx</b></span>
                        <input type="range" min={I_MIN} max={I_MAX} step={1} value={Math.round(target)}
                            onChange={e => setManual({ step, trained, intensity: Number(e.target.value) })}
                            className="h-3 w-full cursor-pointer accent-amber-500" aria-label="Intensidade em % do VO₂máx" />
                    </label>
                    <Toggle trained={trained} onChange={t => setManual({ step, intensity: target, trained: t })} />
                    <div className="mt-2 flex gap-6">
                        <div className="flex flex-col">
                            <span className="font-display text-[60px] font-bold leading-none tabular-nums" style={{ color: C.glucose }}>~{cho}%</span>
                            <span className="text-[19px] text-gray-100">carboidrato</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-[60px] font-bold leading-none tabular-nums" style={{ color: C.fat }}>~{100 - cho}%</span>
                            <span className="text-[19px] text-gray-100">gordura</span>
                        </div>
                    </div>
                    {step === 2 && (
                        <p className="m-0 text-[19px] leading-snug text-gray-100">
                            Medido: gordura <b style={{ color: C.fat }}>32 → 19 kJ/min</b> de 55% a 75% da Wmáx.
                        </p>
                    )}
                </div>
            </div>
            <SourceLine>{step === 2
                    ? 'van Loon LJ et al. J Physiol 2001;536:295-304 · Brooks GA, Mercier J. J Appl Physiol 1994;76:2253-61.'
                    : 'Brooks GA, Mercier J. J Appl Physiol 1994;76:2253-61 · Romijn JA et al. Am J Physiol 1993;265:E380-91.'}</SourceLine>
        </div>
    );
}
