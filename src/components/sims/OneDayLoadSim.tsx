import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { CalcChip, DesignChip, IllustrativeChip } from './kit/chips';
import { KeyFact, Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { DayTimeline } from './ato5/DayTimeline';
import { OneDayChart } from './ato5/OneDayChart';
import { Ledger, LoadingFrame, LoadingPanel } from './ato5/LoadingFrame';
import { LEDGER, STEPS, TEXT } from './ato5/oneDayLoad.content';

/**
 * Slide 81 · Carga em 24 Horas, o pico do Ato V. Palco de cima para baixo: a linha do tempo do dia de carga (0 a 24 h;
 * os gomos acendem quando o dia passa; os 3 min do Fairchild entram antes do 0, depois de um corte de escala) e, como
 * herói, a curva medida em 24 h (Bussau, depois Fairchild), uma unidade só: mmol/kg de peso úmido. O Solem 2025 (peso
 * seco, 3–5 dias) saiu do palco: outra escala, outra pergunta; fica nas notas.
 */
const ACCENT = [C.glucose, C.glycogenSoft, C.stone] as const;

const Pill = ({ color, children }: { color: string; children: string }) => (
    <span className="rounded-lg border-2 px-2 py-0.5 text-[16px] font-semibold" style={{ borderColor: color, color }}>{children}</span>
);

const Stage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2 px-5 py-3">
        <DayTimeline lit={step >= 1} sprint={step >= 2} />
        <div className="flex flex-wrap items-center gap-2 pl-[170px]">
            {TEXT.recipe.map(r => <Pill key={r} color={C.glucoseSoft}>{r}</Pill>)}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 border-t-2 border-white/10 pt-2">
            <span className="text-[16px] font-semibold text-gray-200">{TEXT.yAxis}</span>
            <motion.span initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                <IllustrativeChip>{TEXT.plateauChip}</IllustrativeChip>
            </motion.span>
        </div>
        <OneDayChart step={step} />
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
    return (
        <Reveal order={1} className="rounded-xl border-2 px-3 py-2 text-[18px] font-semibold text-white" style={{ borderColor: C.stone }}>
            {TEXT.lbm}
        </Reveal>
    );
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
