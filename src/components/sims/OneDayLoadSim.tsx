import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { CalcChip, DesignChip, IllustrativeChip } from './kit/chips';
import { KeyFact, Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { DayClock } from './ato5/DayClock';
import { OneDayChart } from './ato5/OneDayChart';
import { SolemInterval } from './ato5/SolemInterval';
import { Ledger, LoadingFrame, LoadingPanel } from './ato5/LoadingFrame';
import { LEDGER, STEPS, TANK_BY_STEP, TANK_MAX, TEXT } from './ato5/oneDayLoad.content';

/**
 * Slide 81 · Carga em 24 Horas, o pico do Ato V. Palco: o relógio de 24 h com o tanque no miolo (os gomos acendem
 * enquanto o tanque sobe de 95 para 180) e, ao lado, a série temporal medida (Bussau, depois Fairchild) com o
 * IC95% do Solem 2025 embaixo. Painel: o estudo do passo, o dado-chave e o livro-caixa que acumula.
 */
const ACCENT = [C.glucose, C.glycogenSoft, C.stone, C.glycogenSoft] as const;

const Pill = ({ on, color, children }: { on: boolean; color: string; children: string }) => (
    <motion.span className="rounded-lg border-2 px-2 py-0.5 text-[16px] font-semibold" style={{ borderColor: color, color }}
        initial={false} animate={{ opacity: on ? 1 : 0.6 }} transition={{ duration: DUR.enter }}>
        {children}
    </motion.span>
);

const Stage = ({ step }: { step: number }) => (
    <div className="flex h-full gap-4 px-5 py-4">
        <div className="flex w-[320px] shrink-0 flex-col items-center gap-2.5">
            <DayClock run={step >= 2 ? 'fairchild' : 'bussau'} lit={step >= 1} sprint={step >= 2} sprintLabel={TEXT.sprint}
                level={TANK_BY_STEP[step] / TANK_MAX} />
            <div className="flex flex-wrap justify-center gap-2">
                {TEXT.recipe.map(r => <Pill key={r} on color={C.glucoseSoft}>{r}</Pill>)}
                <motion.span initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                    <Pill on color={C.stone}>+ 3 min</Pill>
                </motion.span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[16px] text-gray-300">{TEXT.fibers}</span>
                {TEXT.fiberTypes.map((f, i) => (
                    <motion.span key={f} className="rounded-md px-2.5 py-0.5 font-mono text-[17px] font-bold" initial={false}
                        animate={{ opacity: step >= 1 ? 1 : 0.6, backgroundColor: step >= 1 ? C.glycogen : 'rgba(255,255,255,0.08)' }}
                        transition={{ duration: DUR.enter, delay: step === 1 ? 0.9 + i * 0.1 : 0 }}
                        style={{ color: '#FFFFFF' }}>{f}</motion.span>
                ))}
            </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
                <span className="text-[16px] text-gray-300">glicogênio, {TEXT.unit}</span>
                <motion.span initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                    <IllustrativeChip>{TEXT.plateauChip}</IllustrativeChip>
                </motion.span>
            </div>
            <OneDayChart step={step} />
            <span className="-mt-1 text-right text-[16px] text-gray-300">{TEXT.xAxis}</span>
            <div className="mt-auto"><SolemInterval show={step >= 3} /></div>
        </div>
    </div>
);

/** O dado-chave de cada passo, no painel. */
const KeyBlock = ({ step }: { step: number }) => {
    const big = 'font-display text-[56px] font-bold leading-none';
    if (step === 0) return (
        <Reveal order={1} className="flex items-end gap-4">
            <KeyFact color={C.glucose}><span className={big} style={{ color: C.glucose }}>10 g/kg</span></KeyFact>
            <span className="pb-1 text-[18px] leading-snug text-gray-200">por dia<br />{TEXT.perDay}</span>
        </Reveal>
    );
    if (step === 1) return (
        <Reveal order={1} delay={0.9} className="flex items-end gap-4">
            <KeyFact color={C.glycogen} delay={1.05}><span className={big} style={{ color: C.glycogenSoft }}>{TEXT.double}</span></KeyFact>
            <span className="pb-1 text-[18px] leading-snug text-gray-200">{TEXT.doubleCaption}</span>
        </Reveal>
    );
    if (step === 2) return (
        <Reveal order={1} className="rounded-xl border-2 px-3 py-2 text-[18px] font-semibold text-white" style={{ borderColor: C.stone }}>
            {TEXT.lbm}
        </Reveal>
    );
    // Passo 4: o aviso de unidade já está no próprio gráfico do Solem; o painel fica com o texto e o livro-caixa.
    return null;
};

export default function OneDayLoadSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const ledger = LEDGER.map(l => ({ ...l, color: C.glycogenSoft }));
    return (
        <LoadingFrame tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="one-day-tabs" stageWidth={680}
            chips={<><DesignChip>{s.design}</DesignChip>{s.calc && <CalcChip>{s.calc}</CalcChip>}</>}
            stage={<Stage step={step} />}
            panel={
                <LoadingPanel step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                    source={sourcesUpTo(STEPS.map(x => x.source), step)}
                    ledger={step >= 1 ? <Ledger title={TEXT.ledger} items={ledger} step={step} /> : undefined}>
                    <motion.div key={`key-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.text, ease: EASE_OUT }}>
                        <KeyBlock step={step} />
                    </motion.div>
                </LoadingPanel>
            } />
    );
}
