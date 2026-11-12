import { motion } from 'framer-motion';
import { Ban } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Beat } from './kit/Beat';
import { CAST, castOf } from './kit/cast';
import { CountUp } from './kit/CountUp';
import { CalcChip, FictionsChip } from './kit/chips';
import { br } from './kit/format';
import { Frame } from './ato10/Frame';
import { int } from './ato10/units';
import { INTRO_LINE, PLANS, SOURCE, type Plan } from './ato10/plans.content';

/**
 * Slide 190 · Cinco Atletas, Cinco Planos. Faixa do elenco no alto (o marcador desliza até o caso da vez, layoutId);
 * embaixo, o plano em quatro tempos: o dia (g/kg/d → gramas pelo peso, cálculo), antes/durante/depois e o que NÃO fazer.
 */
const STEPS = PLANS.length + 1;
/** Aspas tipográficas na fala do personagem (o elenco do kit usa aspas retas). */
const curly = (t: string) => t.replace(/"([^"]*)"/, '“$1”');
const range = (lo: number, hi: number, f: (n: number) => string) => (lo === hi ? f(lo) : `${f(lo)}–${f(hi)}`);

const CastStrip = ({ active }: { active: number }) => (
    <div className="grid grid-cols-5 gap-3">
        {CAST.map((m, i) => {
            const Icon = m.icon;
            const on = i === active;
            return (
                <div key={m.id} className="relative flex items-center gap-3 rounded-xl px-3 py-2" style={PANEL_BG}>
                    {on && <motion.span layoutId="plan-cursor" className="absolute inset-0 rounded-xl border-[3px]" style={{ borderColor: C.glucose }}
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                    <Icon size={26} strokeWidth={2.4} color={on || active < 0 ? C.glucose : '#6B7280'} aria-hidden />
                    <span className="flex flex-col leading-tight">
                        <span className={`text-[20px] font-semibold ${on || active < 0 ? 'text-white' : 'text-gray-400'}`}>{m.name}</span>
                        <span className="text-[16px] text-gray-300">{m.kg} kg</span>
                    </span>
                </div>
            );
        })}
    </div>
);

const Dilemmas = () => (
    <div className="grid h-full grid-cols-5 gap-3">
        {CAST.map((m, i) => (
            <motion.p key={m.id} className="m-0 self-center px-2 text-[21px] italic leading-snug text-gray-100"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger(i, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                {curly(m.dilemma)}
            </motion.p>
        ))}
    </div>
);

const PlanView = ({ plan }: { plan: Plan }) => {
    const kg = castOf(plan.id).kg;
    const { lo, hi, label } = plan.day;
    return (
        <div className="flex h-full gap-4">
            <div className="flex w-[300px] shrink-0 flex-col justify-center gap-2 rounded-2xl border-2 px-6" style={{ ...PANEL_BG, borderColor: `${C.glucose}99` }}>
                <span className="text-[18px] leading-snug text-gray-300">{label}</span>
                <span className="font-display text-[44px] font-bold leading-none tabular-nums" style={{ color: C.glucose }}>{range(lo, hi, n => br(n, Number.isInteger(n) ? 0 : 1))} g/kg</span>
                <CountUp text={`${range(lo, hi, n => int(n * kg))} g`} className="font-display text-[34px] font-bold leading-none text-white" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                {plan.slots.map((s, i) => (
                    <motion.div key={s.when} className="flex flex-1 items-center gap-4 rounded-xl px-5" style={PANEL_BG}
                        initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stagger(i, 0.1, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                        <span className="w-[150px] shrink-0 text-[19px] font-semibold" style={{ color: C.glucoseSoft }}>{s.when}</span>
                        <span className="flex-1 text-[20px] leading-snug text-white">{s.what}</span>
                        <span className="shrink-0 font-mono text-[14px] text-gray-300">{s.from}</span>
                    </motion.div>
                ))}
                <motion.div className="flex flex-1 items-center gap-4 rounded-xl border-2 px-5" style={{ ...PANEL_BG, borderColor: C.risk }}
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="flex w-[150px] shrink-0 items-center gap-2 text-[19px] font-bold" style={{ color: C.risk }}>
                        <Ban size={20} strokeWidth={2.8} aria-hidden />NÃO
                    </span>
                    <span className="flex-1 text-[20px] leading-snug text-white">{plan.dont.what}</span>
                    <span className="shrink-0 font-mono text-[14px] text-gray-300">{plan.dont.from}</span>
                </motion.div>
            </div>
        </div>
    );
};

export default function CasePlansSim() {
    const { step } = useSlideSteps(STEPS);
    const plan = step > 0 ? PLANS[step - 1] : null;
    const line = plan ? `${castOf(plan.id).name}: ${curly(castOf(plan.id).dilemma)}` : INTRO_LINE;
    return (
        <Frame step={step} line={line} source={SOURCE}
            chips={<><FictionsChip />{plan && <CalcChip>cálculo: g/kg × {castOf(plan.id).kg} kg</CalcChip>}</>}>
            <div className="flex h-full flex-col gap-3">
                <CastStrip active={step - 1} />
                <div className="min-h-0 flex-1">
                    <Beat beat={step} className="h-full">{plan ? <PlanView plan={plan} /> : <Dilemmas />}</Beat>
                </div>
            </div>
        </Frame>
    );
}
