import { motion, useReducedMotion } from 'framer-motion';
import { Ban } from 'lucide-react';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { CAST } from '../kit/cast';
import { CountUp } from '../kit/CountUp';
import { br } from '../kit/format';
import { C, PANEL_BG } from '../kit/palette';
import { int } from './units';
import { PLANS, type Plan } from './plans.content';

/**
 * Quadro do slide 190 (Cinco Atletas, Cinco Planos): cinco colunas, uma por personagem FICTÍCIO. O cabeçalho traz o
 * dilema; a cada passo a coluna da vez se preenche de cima para baixo (dia em g/kg → gramas, antes, durante, depois,
 * o que NÃO fazer) e fica. No último passo, o quadro inteiro: os cinco planos lado a lado.
 */

/** Aspas tipográficas na fala do personagem (o elenco do kit usa aspas retas). */
const curly = (t: string) => t.replace(/"([^"]*)"/, '“$1”');
const range = (lo: number, hi: number, f: (n: number) => string) => (lo === hi ? f(lo) : `${f(lo)}–${f(hi)}`);
const gkg = (n: number) => br(n, Number.isInteger(n) ? 0 : 1);

interface CellProps {
    i: number;
    fresh: boolean;
    className?: string;
    /** Borda de 2 px na cor do aviso (só a célula do NÃO). */
    border?: string;
    children: ReactNode;
}

const Cell = ({ i, fresh, className = '', border, children }: CellProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className={`rounded-lg px-2.5 py-1.5 ${className}`} style={border ? { ...PANEL_BG, border: `2px solid ${border}` } : PANEL_BG}
            initial={reduce || !fresh ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stagger(i, 0.15, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};

const Empty = ({ h }: { h: number }) => <div className="rounded-lg border-2 border-dashed border-slate-700" style={{ height: h }} />;

const Filled = ({ plan, kg, fresh }: { plan: Plan; kg: number; fresh: boolean }) => {
    const { lo, hi, unit } = plan.day;
    return (
        <>
            <Cell i={0} fresh={fresh} className="flex flex-col">
                <span className="text-[20px] font-bold leading-tight tabular-nums" style={{ color: C.glucose }}>{range(lo, hi, gkg)} <span className="text-[15px] font-semibold">{unit}</span></span>
                <CountUp text={`${range(lo, hi, n => int(n * kg))} g`} delay={fresh ? 0.2 : 0} run={fresh}
                    className="text-[17px] font-semibold leading-tight text-white" />
            </Cell>
            {plan.slots.map((s, k) => (
                <Cell key={s.when} i={k + 1} fresh={fresh}>
                    <p className="m-0 text-[16px] leading-[1.22] text-gray-100">
                        <b style={{ color: C.glucoseSoft }}>{s.when}:</b> {s.what}
                    </p>
                </Cell>
            ))}
            <Cell i={4} fresh={fresh} border={C.risk}>
                <p className="m-0 text-[16px] leading-[1.22] text-gray-100">
                    <b className="inline-flex items-center gap-1" style={{ color: C.risk }}><Ban size={15} strokeWidth={3} aria-hidden />NÃO:</b> {plan.dont}
                </p>
            </Cell>
        </>
    );
};

export const PlanBoard = ({ step }: { step: number }) => (
    <div className="grid h-full grid-cols-5 gap-2.5">
        {CAST.map((m, i) => {
            const Icon = m.icon;
            const plan = PLANS.find(p => p.id === m.id);
            const filled = !!plan && step >= i + 1;
            const current = step === i + 1;
            return (
                <div key={m.id} className="relative flex min-w-0 flex-col gap-1.5 rounded-xl p-1.5">
                    {current && <motion.span layoutId="plan-cursor" className="pointer-events-none absolute inset-0 rounded-xl border-[3px]"
                        style={{ borderColor: C.glucose }} transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                    <div className="flex items-center gap-2 px-1">
                        <Icon size={24} strokeWidth={2.4} color={C.glucose} aria-hidden />
                        <span className="flex flex-col leading-tight">
                            <span className="text-[19px] font-semibold text-white">{m.name}</span>
                            <span className="text-[15px] text-gray-300">{m.kg} kg</span>
                        </span>
                    </div>
                    <p className="m-0 min-h-[40px] px-1 text-[15px] italic leading-snug text-gray-200">{curly(m.dilemma)}</p>
                    {filled && plan ? <Filled plan={plan} kg={m.kg} fresh={current} /> : (
                        <div className="flex flex-col gap-1.5">
                            <Empty h={52} />{[0, 1, 2, 3].map(k => <Empty key={k} h={50} />)}
                        </div>
                    )}
                </div>
            );
        })}
    </div>
);
