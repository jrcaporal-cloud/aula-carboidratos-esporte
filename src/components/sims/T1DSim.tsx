import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Chip } from './kit/ui';
import { CountUp } from './kit/CountUp';
import { KeyFact } from './kit/rhythm';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { CgmReader } from './ato9/CgmReader';
import { FrameB, PanelB, StageLabel } from './ato9/FrameB';
import { DESIGN, LIMITS, RULES, SOURCE, STEPS, type Rule, type Trend } from './ato9/t1d.content';

/**
 * Slide 169 · Diabetes Tipo 1 em Campo, palco + painel. À esquerda do palco, o leitor do sensor (a seta gira, o traçado
 * se transforma); à direita, a Tabela 2 do posicionamento EASD/ISPAD 2025: as regras do "antes" e as quatro doses do
 * "durante". Cada linha acende no seu passo e fica acesa; a da vez ganha o marcador que viaja (layoutId).
 */

const TREND_TURN: Record<Trend, number> = { flat: 0, slight: 45, down: 90, double: 90 };
const ACCENT = [C.insulinSoft, C.glucoseSoft, C.glucoseSoft, C.glucoseSoft, C.glucoseSoft] as const;

const TrendIcon = ({ trend }: { trend: Trend }) => (
    <span className="flex w-[48px] items-center">
        {Array.from({ length: trend === 'double' ? 2 : 1 }, (_, i) => (
            <ArrowRight key={i} size={22} strokeWidth={3} color={C.text} style={{ transform: `rotate(${TREND_TURN[trend]}deg)` }} aria-hidden />
        ))}
    </span>
);

const Row = ({ rule, step, current }: { rule: Rule; step: number; current: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const lit = step >= rule.at;
    return (
        <motion.div className={`relative flex min-h-[36px] items-center gap-3 rounded-lg px-3 ${rule.trend ? '' : 'py-1'}`} initial={false}
            animate={{ opacity: lit ? 1 : 0.6 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            {current && (
                <motion.span layoutId="t1d-row" className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(245,158,11,0.16)', border: `2px solid ${C.glucose}` }}
                    transition={reduce ? { duration: 0 } : { duration: DUR.morph, ease: EASE_IN_OUT }} />
            )}
            {rule.trend && <span className="relative"><TrendIcon trend={rule.trend} /></span>}
            <span className={`relative flex flex-1 ${rule.trend ? 'items-center justify-between gap-3' : 'flex-col gap-0.5'}`}>
                <span className={`${rule.trend ? 'text-[16px]' : 'text-[15px]'} leading-tight text-gray-200`}>{rule.when}</span>
                <span className="whitespace-nowrap font-mono text-[18px] font-semibold leading-tight"
                    style={{ color: lit ? (current ? C.glucoseSoft : C.text) : '#9CA3AF' }}>{lit ? rule.action : '?'}</span>
            </span>
        </motion.div>
    );
};

const Table = ({ step }: { step: number }) => {
    const active = STEPS[step].active;
    const group = (g: Rule['group']) => RULES.filter(r => r.group === g);
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            <StageLabel color={C.insulinSoft}>antes</StageLabel>
            {group('antes').map(r => <Row key={r.id} rule={r} step={step} current={r.id === active} />)}
            <div className="mt-1.5 border-t-2 border-white/10 pt-1.5"><StageLabel color={C.glucoseSoft}>durante · abaixo de 7,0 mmol/L</StageLabel></div>
            {group('durante').map(r => <Row key={r.id} rule={r} step={step} current={r.id === active} />)}
            <motion.div className="mt-1 flex flex-col gap-0.5 rounded-lg border-2 px-3 py-1.5" style={{ borderColor: 'rgba(231,229,228,0.45)' }}
                initial={false} animate={{ opacity: step >= 4 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step >= 4 ? 0.4 : 0, ease: EASE_OUT }}>
                <span className="text-[16px] text-gray-100">toda correção: reavaliar em <b className="font-mono text-white">20–30 min</b></span>
                <span className="text-[16px] text-gray-100">acima de <b className="font-mono text-white">15,0 mmol/L</b>: cateter e cetonas</span>
            </motion.div>
        </div>
    );
};

export default function T1DSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <FrameB tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="t1d-tabs"
            chips={<><DesignChip>{DESIGN}</DesignChip><IllustrativeChip>sensor ilustrativo</IllustrativeChip></>}
            stage={
                <div className="flex h-full gap-4 px-4 py-3">
                    <div className="flex flex-col gap-3">
                        <CgmReader reading={s.reading} trend={s.trend} trace={s.trace} />
                        <Chip color={C.stone}>consenso, não prescrição</Chip>
                    </div>
                    <Table step={step} />
                </div>
            }
            panel={
                <PanelB step={step} headline={s.headline} color={ACCENT[step]} text={s.text} source={SOURCE}
                    ledger={
                        <div className="flex flex-col gap-0.5 border-t-2 border-white/15 pt-2">
                            <span className="text-[15px] text-gray-300">como ler o documento</span>
                            {LIMITS.map(l => <span key={l} className="text-[16px] leading-snug text-gray-100">· {l}</span>)}
                        </div>
                    }>
                    <div key={`key-${step}`} className="flex flex-wrap items-baseline gap-x-3">
                        <KeyFact color={C.glucose} delay={0.3}>
                            <CountUp text={s.key} delay={0.3} className="whitespace-nowrap font-display text-[40px] font-bold leading-none" style={{ color: C.glucoseSoft }} />
                        </KeyFact>
                        <span className="text-[16px] leading-snug text-gray-200">{s.keyCaption}</span>
                    </div>
                </PanelB>
            } />
    );
}
