import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Wipe } from './kit/Beat';
import { castOf } from './kit/cast';
import { DesignChip, FictionChip, IllustrativeChip } from './kit/chips';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { GUT_W, GutSide } from './ato6/GutScene';
import { PbRow, PbShell, PbSidePanel } from './ato6/pbShell';
import { BREATH, DAYS, GROUPS, GUT_STEPS, TRANSFER } from './ato6/gut.content';

/**
 * Slide 109 · O Intestino Treina, como antes × depois + painel. No palco: o Diego (caso fictício) no alto, o corte do
 * intestino sem treino e treinado lado a lado (esquema: fila no lúmen, transportadores, H₂ no hálito) e o
 * calendário das 2 semanas de Costa 2017. No painel: o texto do passo, a tabela dos 3 grupos e "vira prova?".
 */

const diego = castOf('diego');
const ACCENT = [C.risk, C.glucose, C.ok, C.caveat] as const;

const Banner = () => {
    const Icon = diego.icon;
    return (
        <div className="flex items-center gap-4 border-b-2 border-white/15 pb-1.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10"><Icon size={26} color="#E5E7EB" aria-hidden /></span>
            <div className="flex flex-col leading-tight">
                <span className="text-[20px] font-bold text-white">{diego.name}, {diego.age} anos</span>
                <span className="text-[16px] text-gray-300">{diego.sport} · {diego.effort}</span>
            </div>
            <span className="ml-auto text-[20px] italic text-gray-100">{diego.dilemma}</span>
        </div>
    );
};

const Calendar = ({ step }: { step: number }) => {
    const reduce = useReducedMotion();
    const filled = step >= 1;
    return (
        <div className="flex flex-col gap-1.5 border-t-2 border-white/15 pt-2">
            <div className="flex items-baseline justify-between">
                <span className="text-[16px] font-bold uppercase tracking-wide text-gray-300">2 semanas de treino intestinal</span>
                <span className="text-[16px] text-gray-200">gel · comida · placebo</span>
            </div>
            <div className="grid grid-cols-[repeat(14,1fr)] gap-1.5">
                {Array.from({ length: DAYS }, (_, i) => (
                    <div key={i} className="relative flex h-[34px] items-center justify-center overflow-hidden rounded-md bg-white/10">
                        <motion.span className="absolute inset-0" style={{ background: C.glucose, transformOrigin: 'center bottom' }}
                            initial={false} animate={{ scaleY: filled ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : DUR.enter, delay: filled && step === 1 ? stagger(i, 0.15, 0.05) : 0, ease: EASE_OUT }} />
                        <span className="relative font-mono text-[16px] font-bold" style={{ color: filled ? '#04080F' : '#9CA3AF' }}>{i + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Groups = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-0.5 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">Costa 2017, por grupo</th>
                <th className="text-right font-normal">sintomas GI</th>
                <th className="text-right font-normal">distância em 1 h</th>
            </tr>
        </thead>
        <tbody>
            {GROUPS.map((g, i) => (
                <PbRow key={g.group} at={2} step={step} i={i} className="text-[18px] font-semibold">
                    <td className="text-gray-100">{g.group}</td>
                    <td className="text-right tabular-nums" style={{ color: g.good ? C.ok : '#D1D5DB' }}>{g.symptoms}</td>
                    <td className="text-right font-display text-[20px] font-bold tabular-nums" style={{ color: g.good ? C.ok : '#D1D5DB' }}>{g.distance}</td>
                </PbRow>
            ))}
        </tbody>
    </table>
);

/** "Vira prova?" no rodapé do palco (passo 4): os dois estudos que esfriam a promessa. */
const Transfer = () => (
    <div className="grid grid-cols-2 gap-3">
        {TRANSFER.map((t, i) => (
            <motion.div key={t.study} className="flex flex-col rounded-lg border-2 border-white/20 px-3 py-1 leading-snug"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger(i, 0.3, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="text-[16px] font-bold text-white">{t.study}</span>
                {t.lines.map(l => <span key={l} className="text-[16px] text-gray-200">{l}</span>)}
            </motion.div>
        ))}
    </div>
);

export default function GutTrainingSim() {
    const { step, setStep } = useSlideSteps(GUT_STEPS.length);
    const s = GUT_STEPS[step];
    return (
        <PbShell tabs={GUT_STEPS.map(g => g.tab)} step={step} setStep={setStep} layoutId="gut-tabs"
            chips={<><FictionChip /><IllustrativeChip>intestino: esquema</IllustrativeChip>{s.chip && <DesignChip>{s.chip}</DesignChip>}</>}>
            <Panel className="flex w-[640px] shrink-0 flex-col gap-2 px-5 py-3">
                <Banner />
                <div className="flex justify-between">
                    <GutSide kind="untrained" note={step >= 2 ? 'placebo, 2 sem.' : 'sem treino'} h2={step >= 2 ? BREATH.before : undefined} animate={step === 0} />
                    {step >= 2
                        ? <Wipe from="left" style={{ width: GUT_W }}><GutSide kind="trained" note="treinado (gel)" h2={BREATH.after} animate={step === 2} /></Wipe>
                        : <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-white/25 text-[18px] text-gray-300" style={{ width: GUT_W }}>e depois de 2 semanas?</div>}
                </div>
                <Calendar step={step} />
                {step >= 3 && <Transfer />}
            </Panel>
            <PbSidePanel step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                source={sourcesUpTo(GUT_STEPS.map(g => g.sources), step)}>
                {step >= 2 && <Groups step={step} />}
            </PbSidePanel>
        </PbShell>
    );
}
