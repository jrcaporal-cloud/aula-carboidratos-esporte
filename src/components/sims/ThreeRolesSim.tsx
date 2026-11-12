import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { CHAPTERS } from '../../data/chapters';
import { PANEL_BG } from './kit/palette';
import { Source, StepTabs } from './kit/ui';
import { Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { CalcChip, DesignChip, ViaReviewChip } from './kit/chips';
import { ChoiceDiagram, FuelDiagram, SignalDiagram } from './ato1/RoleDetails';
import { CHOICE, FUEL, OPEN_AT, ROLE_FINAL, ROLE_TABS, ROLES, SIGNAL, type Role, type RoleId } from './ato1/roles.content';

/**
 * Slide 11 · Três Papéis de uma Molécula, em tríptico. Os três cartões começam fechados (só o ícone e a pergunta);
 * a cada passo um se abre com o seu mini-diagrama desenhado com eixo e unidade e o texto do estudo, e FICA aberto.
 * O último passo acende, no pé de cada cartão, os atos em que aquele papel volta.
 */
const STEPS = ROLE_TABS.length;
const FINAL = STEPS - 1;

const DIAGRAM: Record<RoleId, () => ReactNode> = {
    fuel: () => <FuelDiagram />,
    signal: () => <SignalDiagram />,
    choice: () => <ChoiceDiagram />,
};

const CHIPS: Record<RoleId, () => ReactNode> = {
    fuel: () => <CalcChip>{FUEL.calc}</CalcChip>,
    signal: () => <><DesignChip>{SIGNAL.design}</DesignChip><CalcChip>{SIGNAL.calc}</CalcChip></>,
    choice: () => <><ViaReviewChip>{CHOICE.via}</ViaReviewChip><CalcChip>{CHOICE.calc}</CalcChip></>,
};

const colorOf = (roman: string): string => CHAPTERS.find(c => c.roman === roman)?.color ?? '#F3F4F6';

const Acts = ({ role }: { role: Role }) => (
    <div className="flex items-center gap-2">
        <span className="text-[16px] text-gray-200">volta nos atos</span>
        {role.acts.map((a, i) => (
            <motion.span key={a} className="rounded-md border-2 px-2 font-mono text-[16px] font-bold leading-6"
                style={{ borderColor: colorOf(a), color: colorOf(a) }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: DUR.enter, ease: EASE_OUT }}>
                {a}
            </motion.span>
        ))}
    </div>
);

const RoleCard = ({ role, step }: { role: Role; step: number }) => {
    const reduce = useReducedMotion();
    const open = step >= OPEN_AT[role.id];
    const current = step === OPEN_AT[role.id] || step === FINAL;
    const Icon = role.icon;
    return (
        <div className="relative flex min-w-0 flex-1 flex-col gap-2.5 rounded-2xl border-2 px-4 py-3.5 transition-colors duration-300"
            style={{ ...PANEL_BG, borderColor: current ? role.color : open ? `${role.color}66` : 'rgba(255,255,255,0.16)' }}>
            <div className="flex items-center gap-3">
                <Icon size={30} color={role.color} strokeWidth={2.2} aria-hidden />
                <span className="font-display text-[26px] font-semibold leading-none tracking-tight" style={{ color: role.color }}>{role.name}</span>
                <span className="ml-auto shrink-0 whitespace-nowrap text-[17px] text-gray-200">{role.ask}</span>
            </div>

            {open ? (
                <>
                    <Reveal order={0}>{DIAGRAM[role.id]()}</Reveal>
                    <Reveal order={1}><p className="m-0 text-[16px] leading-snug text-gray-100">{role.text}</p></Reveal>
                    <Reveal order={2} className="mt-auto flex gap-2">{CHIPS[role.id]()}</Reveal>
                    {step === FINAL && <Acts role={role} />}
                </>
            ) : (
                <motion.div className="flex flex-1 items-center justify-center" initial={false}
                    animate={{ opacity: 0.45 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
                    <Icon size={120} color={role.color} strokeWidth={1.5} aria-hidden />
                </motion.div>
            )}
        </div>
    );
};

export default function ThreeRolesSim() {
    const { step, setStep } = useSlideSteps(STEPS);
    const opened = ROLES.filter(r => step >= OPEN_AT[r.id]).map(r => r.source);
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-2.5">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={ROLE_TABS} step={step} onSelect={setStep} layoutId="roles-tabs" />
                <motion.span key={step === FINAL ? 'fim' : 'meio'} className="text-[20px] font-semibold text-white"
                    initial={{ opacity: 0 }} animate={{ opacity: step === 0 || step === FINAL ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                    {step === FINAL ? ROLE_FINAL : 'A mesma glicose, três perguntas.'}
                </motion.span>
            </div>
            <div className="flex min-h-0 flex-1 gap-3.5">
                {ROLES.map(r => <RoleCard key={r.id} role={r} step={step} />)}
            </div>
            <Source>{opened.length ? sourcesUpTo(opened, opened.length - 1) : 'O fio da aula: Combustível, Sinal e Escolha.'}</Source>
        </div>
    );
}
