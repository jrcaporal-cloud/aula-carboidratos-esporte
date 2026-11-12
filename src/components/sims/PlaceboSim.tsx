import { LayoutGroup, motion } from 'framer-motion';
import { CupSoda } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Beat, Grow } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { signed } from './kit/format';
import { Frame } from './ato10/Frame';
import { DESIGN, DRINKS, LINES, SOURCE, TOLD, TWIST } from './ato10/placebo.content';

/**
 * Slide 187 · O Placebo que Pedalou Mais. Passo 1: a grade 2 × 3 do estudo (o que bebeu × o que ouviu).
 * Passo 2: as mesmas colunas viram barras de potência a partir do zero. Passo 3: o "+4,3%" voa da barra
 * para o centro (layoutId) e encontra o "−0,3%" do carboidrato de verdade.
 */
const LABEL_W = 220;
const BAR_SCALE = 26; // px por ponto percentual

const Matrix = () => (
    <div className="flex flex-col gap-3">
        {DRINKS.map((d, r) => (
            <div key={d} className="flex items-center gap-4">
                <span className="shrink-0 text-[20px] text-gray-200" style={{ width: LABEL_W }}>{d}</span>
                {TOLD.map((t, c) => (
                    <motion.div key={t.id} className="flex h-[96px] flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-white/15" style={PANEL_BG}
                        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: stagger(r * 3 + c, 0.1, 0.06), duration: DUR.enter, ease: EASE_OUT }}>
                        <CupSoda size={34} strokeWidth={2.4} color={r === 0 ? C.glucose : C.co2} aria-hidden />
                    </motion.div>
                ))}
            </div>
        ))}
    </div>
);

const Bars = () => (
    <div className="relative flex h-full items-center gap-4">
        <span className="shrink-0 text-[20px] text-gray-200" style={{ width: LABEL_W }}>mudança na potência</span>
        <div className="absolute right-0 top-1/2 h-[3px] bg-white/50" style={{ left: LABEL_W + 16 }} />
        {TOLD.map((t, i) => {
            const h = Math.abs(t.change) * BAR_SCALE;
            const upward = t.change >= 0;
            return (
                <div key={t.id} className="relative flex h-full flex-1 justify-center">
                    <div className="absolute w-[150px] overflow-hidden rounded-lg"
                        style={{ height: h, ...(upward ? { bottom: '50%' } : { top: '50%' }) }}>
                        <Grow value={1} axis="y" color={t.id === 'cho' ? C.stone : C.co2} delay={stagger(i, 0.1, 0.15)}
                            style={upward ? undefined : { transformOrigin: 'center top' }} />
                    </div>
                    <motion.span layoutId={t.id === 'cho' ? 'clark-belief' : undefined}
                        className="absolute whitespace-nowrap font-display text-[34px] font-bold tabular-nums text-white"
                        style={upward ? { bottom: `calc(50% + ${h + 6}px)` } : { top: `calc(50% + ${h + 6}px)` }}>
                        {signed(t.change, 1)}%
                    </motion.span>
                </div>
            );
        })}
    </div>
);

const Twist = () => (
    <div className="flex h-full flex-col items-center justify-center gap-6">
        <div className="flex items-start justify-center gap-24">
            <div className="flex flex-col items-center gap-2">
                <motion.span layoutId="clark-belief" className="font-display text-[110px] font-bold leading-none tabular-nums" style={{ color: C.stone }}>
                    {TWIST.belief.value}
                </motion.span>
                <span className="text-[21px] text-gray-200">{TWIST.belief.caption}</span>
            </div>
            <motion.div className="flex flex-col items-center gap-2" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: DUR.enter, ease: EASE_OUT }}>
                <span className="font-display text-[110px] font-bold leading-none tabular-nums" style={{ color: C.glucose }}>{TWIST.real.value}</span>
                <span className="text-[21px] text-gray-200">{TWIST.real.caption}</span>
            </motion.div>
        </div>
        <motion.p className="m-0 text-[22px] text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: DUR.enter }}>
            {TWIST.note}
        </motion.p>
    </div>
);

export default function PlaceboSim() {
    const { step } = useSlideSteps(LINES.length);
    return (
        <Frame step={step} line={LINES[step]} chips={<DesignChip>{DESIGN}</DesignChip>} source={SOURCE}>
            <LayoutGroup>
                <div className="flex h-full flex-col gap-3">
                    {step < 2 && (
                        <div className="flex gap-4">
                            <span className="shrink-0" style={{ width: LABEL_W }} />
                            {TOLD.map(t => <span key={t.id} className="flex-1 text-center text-[21px] font-semibold text-white">{t.label}</span>)}
                        </div>
                    )}
                    <div className="min-h-0 flex-1">
                        {step === 0 && <Beat beat="m" className="h-full"><Matrix /></Beat>}
                        {step === 1 && <Bars />}
                        {step === 2 && <Twist />}
                    </div>
                </div>
            </LayoutGroup>
        </Frame>
    );
}
