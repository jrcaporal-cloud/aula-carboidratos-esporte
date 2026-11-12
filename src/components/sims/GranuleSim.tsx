import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { CalcChip } from './kit/chips';
import { Source, SvgText } from './kit/ui';
import { BODY_FONT, C, PANEL_BG } from './kit/palette';
import { MAX_TIERS, SOURCE, STEPS, TIER_SHARE } from './ato2/granule.content';
import { Model3DHint } from './kit/Model3DHint';

/**
 * Slide 22 · A Árvore de Glicose. À esquerda o grânulo cresce camada a camada (anéis concêntricos
 * em volta da glicogenina); à direita, as glicoses de cada camada em barras: a última sozinha ≈ metade.
 */
const CX = 190, R0 = 16, W = 14;
const ringR = (k: number) => R0 + W * (k + 0.5);

const Granule = ({ tiers, shell, real }: { tiers: number; shell: boolean; real: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <svg viewBox="0 0 380 380" className="h-[380px] w-[380px]" role="img" aria-label={`Grânulo com ${tiers} camadas`}>
            {Array.from({ length: MAX_TIERS }, (_, k) => {
                const on = k < tiers;
                const outer = shell && k === MAX_TIERS - 1;
                return (
                    <motion.circle key={k} cx={CX} cy={CX} r={ringR(k)} fill="none" strokeWidth={W - 3}
                        stroke={outer ? C.glucose : C.glycogen}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: on ? (outer ? 1 : k % 2 ? 0.95 : 0.6) : 0, scale: on ? 1 : 0.92 }}
                        transition={{ duration: reduce ? 0 : DUR.enter, ease: EASE_OUT, delay: on ? stagger(k, 0, 0.05) : 0 }} />
                );
            })}
            <rect x={CX - 12} y={CX - 12} width={24} height={24} rx={6} fill={C.protein} />
            {real && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: DUR.enter }}>
                    <circle cx={CX} cy={CX} r={ringR(MAX_TIERS - 1) + W / 2} fill="none" stroke="#E5E7EB" strokeWidth={3} strokeDasharray="10 8" />
                    <SvgText x={CX} y={46} text="44 nm (máximo)" size={18} anchor="middle" />
                    <SvgText x={CX} y={CX + ringR(6) + 30} text="~25 nm" size={22} color={C.glycogenSoft} anchor="middle" />
                </motion.g>
            )}
        </svg>
    );
};

const TierBars = ({ shell, tiers }: { shell: boolean; tiers: number }) => (
    <div className="flex flex-col gap-2">
        <div className="flex h-[170px] items-end gap-2">
            {TIER_SHARE.map((_, k) => (
                <div key={k} className="relative h-full flex-1">
                    <div className="absolute inset-0">
                        <Grow axis="y" value={k < tiers ? Math.max(2 ** (k - tiers + 1), 0.015) : 0} delay={stagger(k, 0.1, 0.04)}
                            color={shell && k === MAX_TIERS - 1 ? C.glucose : C.glycogen} className="rounded-t-md" />
                    </div>
                    {shell && k === MAX_TIERS - 1 && (
                        <motion.span className="absolute -top-1 right-0 font-display text-[28px] font-bold text-amber-400"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: DUR.enter }}>
                            ≈ ½
                        </motion.span>
                    )}
                </div>
            ))}
        </div>
        <div className="flex gap-2 font-mono text-[16px] text-gray-300">
            {TIER_SHARE.map((_, k) => <span key={k} className="flex-1 text-center">{k + 1}</span>)}
        </div>
        <span className="text-[18px] text-gray-200">glicoses por camada, relativas à última</span>
    </div>
);

export default function GranuleSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const big = step >= 2 && !s.real;

    return (
        <div className="not-prose flex flex-col gap-3" style={BODY_FONT}>
            <div className="grid grid-cols-[380px_1fr] gap-8 rounded-2xl px-6 py-3" style={PANEL_BG}>
                <Granule tiers={s.tiers} shell={s.shell} real={s.real} />
                <div className="flex flex-col justify-center gap-5">
                    <div className="flex items-end gap-10">
                        <div className="flex flex-col">
                            <CountUp text={String(s.tiers)} duration={0.6} className="font-display text-[80px] font-bold leading-none" style={{ color: C.glycogenSoft }} />
                            <span className="text-[20px] text-gray-200">{s.tiers === 1 ? 'camada' : 'camadas'}</span>
                        </div>
                        {big && (
                            <div className="flex flex-col">
                                <CountUp text="~55.000" className="font-display text-[80px] font-bold leading-none" style={{ color: C.glucose }} />
                                <span className="text-[20px] text-gray-200">glicoses · ~44 nm</span>
                            </div>
                        )}
                    </div>
                    <TierBars shell={s.shell} tiers={s.tiers} />
                </div>
            </div>
            <div className="flex items-start justify-between gap-6">
                <Beat beat={step} className="max-w-[860px]">
                    <p className="m-0 text-[27px] leading-snug text-gray-100">{s.line}</p>
                </Beat>
                <span className="mt-1 flex shrink-0 flex-col items-end gap-2">
                    {step >= 1 && <CalcChip>cálculo: cadeias dobram por camada</CalcChip>}
                    <Model3DHint label="grânulo em 3D" />
                </span>
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
