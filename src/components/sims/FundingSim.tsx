import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Grow, Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { BigStat } from './kit/Stamp';
import { DesignChip } from './kit/chips';
import { Frame } from './ato10/Frame';
import { CHECKS, DESIGNS, FUNNEL, LINES, SIDE, SMITH, SOURCE } from './ato10/funding.content';

/**
 * Slide 188 · Quem Paga o Estudo. Um funil em barras (escala linear, de 431 alegações a 3 estudos de alta qualidade)
 * que se estreita passo a passo; no fim o funil sai de cena e entra a resposta madura: quatro perguntas de leitura.
 */
const MAX = FUNNEL[0].n;
const BAR_W = 430;

const Funnel = ({ rows }: { rows: number }) => (
    <div className="flex flex-col justify-center gap-4">
        {FUNNEL.map((r, i) => {
            const on = i < rows;
            const last = i === FUNNEL.length - 1;
            return (
                <motion.div key={r.n} className="flex items-center gap-5" initial={false}
                    animate={{ opacity: on ? 1 : 0 }} transition={{ delay: on ? stagger(i, 0.05, 0.18) : 0, duration: DUR.enter, ease: EASE_OUT }}>
                    <div className="relative h-[52px] overflow-hidden rounded-lg" style={{ width: Math.max((r.n / MAX) * BAR_W, 8) }}>
                        {on && <Grow value={1} color={last ? C.risk : C.co2} delay={stagger(i, 0.05, 0.18)} />}
                    </div>
                    <span className="flex items-baseline gap-3 whitespace-nowrap">
                        {on && <CountUp text={String(r.n)} delay={stagger(i, 0.05, 0.18)} className="font-display text-[40px] font-bold leading-none text-white" />}
                        <span className="text-[20px] text-gray-200">{r.label}</span>
                    </span>
                </motion.div>
            );
        })}
    </div>
);

const Reading = () => (
    <div className="flex h-full flex-col justify-center gap-6 px-8">
        <div className="grid grid-cols-4 gap-4">
            {CHECKS.map((c, i) => {
                const Icon = c.icon;
                return (
                    <motion.div key={c.ask} className="flex flex-col gap-3 rounded-2xl border-2 border-white/15 px-5 py-5" style={PANEL_BG}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger(i, 0.25, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                        <Icon size={34} strokeWidth={2.4} color={C.glucose} aria-hidden />
                        <span className="text-[21px] font-semibold leading-snug text-white">{c.ask}</span>
                    </motion.div>
                );
            })}
        </div>
        <motion.div className="flex flex-col gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: DUR.enter }}>
            <span className="text-[22px] font-semibold" style={{ color: C.glucoseSoft }}>{SMITH.title}</span>
            <span className="max-w-[900px] text-[20px] leading-snug text-gray-200">{SMITH.text}</span>
        </motion.div>
    </div>
);

export default function FundingSim() {
    const { step } = useSlideSteps(LINES.length);
    return (
        <Frame step={step} line={LINES[step]} chips={<DesignChip>{DESIGNS[step]}</DesignChip>} source={SOURCE}>
            <div className="relative h-full">
                <motion.div className="flex h-full items-center justify-between gap-8" initial={false} animate={{ opacity: step === 2 ? 0 : 1 }} transition={{ duration: DUR.exit }}>
                    <Funnel rows={step === 0 ? 1 : FUNNEL.length} />
                    <div className="w-[280px] shrink-0">
                        <BigStat key={step} value={SIDE[Math.min(step, 1)].value} caption={SIDE[Math.min(step, 1)].caption}
                            color={step === 0 ? C.stone : C.risk} size={84} />
                    </div>
                </motion.div>
                <Wipe show={step === 2} from="bottom" className="absolute inset-0 rounded-2xl" style={{ background: '#060C17' }}>
                    {step === 2 && <Reading />}
                </Wipe>
            </div>
        </Frame>
    );
}
