import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Grow } from './kit/Beat';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { Model3DHint } from './kit/Model3DHint';
import { Accrue, MolFrame, StepText } from './ato2/moleculaA.ui';
import { GR_W, GranuleStage } from './ato2/granuleArt';
import { CHIPS, MAX_TIERS, STEPS, TIER_SHARE } from './ato2/granule.content';

/**
 * Slide 22 · A Árvore de Glicose. Palco: centro do grânulo ampliado (dendrograma de cadeias e ramos α-1,6),
 * o grânulo inteiro em 12 anéis e duas lupas (glicogenina; fosforilase parando 4 glicoses antes do ramo).
 * Painel: texto do passo, ficha que acumula (primer → cadeia → máximo → casca → músculo) e glicoses por camada.
 */
interface FichaRow { at: number; label: string; value: string; color: string }

const FICHA: readonly FichaRow[] = [
    { at: 0, label: 'primer da glicogenina', value: '10–20 glicoses', color: C.proteinSoft },
    { at: 1, label: 'cada cadeia', value: '~13 glicoses · 2 ramos', color: C.glycogenSoft },
    { at: 2, label: 'máximo teórico', value: '12 camadas · ~55.000 · ~44 nm', color: C.glycogenSoft },
    { at: 3, label: 'camada externa', value: '50% da glicose', color: C.glucoseSoft },
    { at: 4, label: 'no músculo (MET)', value: '~25 nm (~7 camadas) · 10–44', color: '#F9FAFB' },
];

const Ficha = ({ step }: { step: number }) => (
    <div className="flex flex-col">
        {FICHA.filter(r => r.at <= step).map(r => (
            <Accrue key={r.label} at={r.at} step={step} delay={0.5}
                className="flex items-baseline justify-between gap-3 border-b-2 border-white/10 py-0.5">
                <span className="text-[16px] text-gray-200">{r.label}</span>
                <span className="text-right text-[18px] font-bold tabular-nums" style={{ color: r.color }}>{r.value}</span>
            </Accrue>
        ))}
    </div>
);

const TierBars = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-1">
        <div className="relative flex h-[56px] items-end gap-1.5">
            <span className="absolute left-0 top-0 text-[15px] text-gray-300">glicoses por camada, da 1 à 12 (modelo)</span>
            {TIER_SHARE.map((v, k) => {
                const shell = step >= 3 && k === MAX_TIERS - 1;
                return (
                    <div key={k} className="relative h-full flex-1">
                        <Grow axis="y" value={Math.max(v, 0.03)} delay={stagger(k, 0.3, 0.04)} color={shell ? C.glucose : C.glycogen} className="rounded-t-[3px]" />
                        {shell && (
                            <motion.span className="absolute -left-12 top-0 font-display text-[20px] font-bold text-amber-300"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: DUR.enter, ease: EASE_OUT }}>
                                ≈ ½
                            </motion.span>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);

export default function GranuleSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <MolFrame tabs={STEPS.map(x => x.tab)} step={step} setStep={setStep} layoutId="granule-tabs" stageWidth={GR_W}
            stage={<GranuleStage step={step} tiers={s.tiers} />}
            chips={<>
                <IllustrativeChip>modelo estilizado</IllustrativeChip>
                {CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
            </>}
            footer={<Model3DHint label="grânulo em 3D" />}
            source={sourcesUpTo(STEPS.map(x => x.sources), step)}>
            <StepText step={step} color={s.color} headline={s.headline} text={s.text} />
            <Ficha step={step} />
            {step >= 2 && <Accrue at={2} step={step}><TierBars step={step} /></Accrue>}
        </MolFrame>
    );
}
