import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { Beat } from './kit/Beat';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { Dumbbells, EnergyBlocks, GlycogenBars, LoadGrid } from './ato5/WomenCharts';
import { BEATS, DESIGNS, SOURCES, TAKEAWAY } from './ato5/womenLoading.content';

/**
 * Slide 83 · O Mito da Mulher que Não Carrega. À esquerda, a frase grande que se reescreve a cada passo
 * (a história do mito sendo corrigido); à direita, o gráfico que se reconfigura: +41% × 0% → a energia
 * de onde saem os "75%" → os halteres de James 2001 → a grade sim/não de Tarnopolsky 2001.
 */
const CHARTS = [GlycogenBars, EnergyBlocks, Dumbbells, LoadGrid] as const;
const YEARS = ['1995', '1995', '2001', '2001'] as const;

export default function WomenLoadingSim() {
    const { step } = useSlideSteps(BEATS.length);
    const Chart = CHARTS[step];
    const last = step === BEATS.length - 1;
    return (
        <div className="not-prose flex w-full flex-col gap-4" style={{ maxHeight: 516 }}>
            <div className="flex gap-6" style={{ height: 460 }}>
                <div className="flex w-[380px] shrink-0 flex-col justify-between py-2">
                    <div className="flex flex-col gap-5">
                        <Beat beat={YEARS[step]} className="font-display text-[88px] font-bold leading-none" style={{ color: C.stone }}>
                            {YEARS[step]}
                        </Beat>
                        <Beat beat={step} className="text-[30px] font-semibold leading-snug text-white">{BEATS[step]}</Beat>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <motion.p className="m-0 rounded-xl border-2 px-4 py-3 text-[24px] font-semibold leading-snug"
                            style={{ borderColor: C.glucose, color: C.glucoseSoft }} initial={false}
                            animate={{ opacity: last ? 1 : 0, y: last ? 0 : 8 }} transition={{ duration: DUR.enter, ease: EASE_OUT, delay: last ? 0.5 : 0 }}>
                            {TAKEAWAY}
                        </motion.p>
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                    <div className="flex min-h-[30px] justify-end pt-2">
                        <Beat beat={`d${step}`}>{DESIGNS[step] ? <DesignChip>{DESIGNS[step]}</DesignChip> : <IllustrativeChip />}</Beat>
                    </div>
                    <div className="relative flex-1 overflow-hidden rounded-2xl" style={PANEL_BG}>
                        <Beat beat={step} className="h-full"><Chart /></Beat>
                    </div>
                </div>
            </div>
            <Source>{SOURCES[step]}</Source>
        </div>
    );
}
