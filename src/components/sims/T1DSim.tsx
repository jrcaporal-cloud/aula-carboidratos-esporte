import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Chip } from './kit/ui';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { CgmReader } from './ato9/CgmReader';
import { Head, Reveal, SimBox, SourceLine } from './ato9/parts';
import { DESIGN, RULES, SOURCE, STEPS, type Rule, type Trend } from './ato9/t1d.content';

/**
 * Slide 169 · Diabetes Tipo 1 em Campo. À esquerda, o leitor do sensor (a seta gira, o traçado se transforma);
 * à direita, a tabela do consenso EASD/ISPAD 2025 com a linha da vez acesa por um marcador compartilhado (layoutId).
 */

const TREND_TURN: Record<Trend, number> = { flat: 0, slight: 45, down: 90, double: 90 };

const TrendIcon = ({ trend }: { trend: Trend }) => (
    <span className="flex w-[56px] items-center">
        {Array.from({ length: trend === 'double' ? 2 : 1 }, (_, i) => (
            <ArrowRight key={i} size={26} strokeWidth={3} color={C.text} style={{ transform: `rotate(${TREND_TURN[trend]}deg)` }} aria-hidden />
        ))}
    </span>
);

const Row = ({ rule, on }: { rule: Rule; on: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="relative flex h-[50px] items-center gap-4 rounded-xl px-4">
            {on && (
                <motion.span layoutId="t1d-row" className="absolute inset-0 rounded-xl" style={{ background: 'rgba(245,158,11,0.18)', border: `2px solid ${C.glucose}` }}
                    transition={reduce ? { duration: 0 } : { duration: DUR.morph, ease: EASE_IN_OUT }} />
            )}
            {rule.trend && <span className="relative"><TrendIcon trend={rule.trend} /></span>}
            <span className="relative flex-1 text-[20px] text-gray-200">{rule.when}</span>
            <span className="relative font-mono text-[22px] font-semibold" style={{ color: on ? C.glucoseSoft : C.text }}>{rule.action}</span>
        </div>
    );
};

const GroupTitle = ({ children }: { children: string }) => (
    <span className="px-4 pb-1 text-[20px] font-semibold text-gray-200">{children}</span>
);

/** Passo 1: as duas regras do "antes", grandes, sem tabela. */
const Before = () => (
    <div className="flex flex-col gap-5 rounded-2xl p-6" style={{ border: `2px solid ${C.glucose}`, background: 'rgba(245,158,11,0.12)' }}>
        {RULES.filter(r => r.group === 'antes').map(r => (
            <div key={r.id} className="flex flex-col gap-1">
                <span className="text-[20px] text-gray-300">{r.when}</span>
                <span className="text-[28px] font-semibold" style={{ color: C.glucoseSoft }}>{r.action}</span>
            </div>
        ))}
    </div>
);

export default function T1DSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const during = RULES.filter(r => r.group === 'durante');
    return (
        <SimBox className="flex flex-col">
            <Head beat={step} say={s.say} className="min-h-[76px]" chips={<>
                <DesignChip>{DESIGN}</DesignChip>
                <Chip color={C.stone}>consenso, não prescrição individual</Chip>
                <IllustrativeChip />
            </>} />
            <div className="mt-4 flex min-h-0 flex-1 gap-10">
                <CgmReader reading={s.reading} trend={s.trend} trace={s.trace} />
                <div className="relative min-w-0 flex-1">
                    <Reveal show={step === 0} className="absolute inset-x-0 top-0">{step === 0 && <Before />}</Reveal>
                    <Reveal show={step >= 1} className="absolute inset-x-0 top-0 flex flex-col gap-1">
                        <GroupTitle>durante · abaixo de 7,0 mmol/L</GroupTitle>
                        {during.map(r => <Row key={r.id} rule={r} on={s.active.includes(r.id)} />)}
                    </Reveal>
                </div>
            </div>
            <SourceLine>{SOURCE}</SourceLine>
        </SimBox>
    );
}
