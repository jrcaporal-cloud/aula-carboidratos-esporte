import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { PANEL_BG } from './kit/palette';
import { Beat } from './kit/Beat';
import { ChoiceDetail, FuelDetail, SignalDetail } from './ato1/RoleDetails';
import { ROLE_BEATS, ROLES, type Role, type RoleId } from './ato1/roles.content';

/**
 * Slide 11 · Três Papéis de uma Molécula. Três cartões lado a lado; a cada passo um deles se abre
 * (layout compartilhado: os outros dois encolhem para dar lugar) e mostra o seu número-gancho.
 * O último passo devolve os três ao mesmo tamanho, cada um com o seu número em uma linha.
 */
const STEPS = ROLE_BEATS.length;
/** Passo em que cada papel abre (1, 2, 3); 0 e 4 = todos fechados. */
const OPEN_AT: Record<RoleId, number> = { fuel: 1, signal: 2, choice: 3 };
const RECAP = STEPS - 1;

const DETAIL: Record<RoleId, () => ReactNode> = {
    fuel: () => <FuelDetail />,
    signal: () => <SignalDetail />,
    choice: () => <ChoiceDetail />,
};

interface RoleCardProps {
    role: Role;
    step: number;
}

const RoleCard = ({ role, step }: RoleCardProps) => {
    const reduce = useReducedMotion();
    const open = step === OPEN_AT[role.id];
    const dim = !open && step >= 1 && step < RECAP;
    const recap = step === RECAP;
    const Icon = role.icon;
    const layoutT = { duration: reduce ? 0 : DUR.morph, ease: EASE_IN_OUT };
    return (
        <motion.div layout transition={layoutT}
            className="relative flex min-w-0 flex-col overflow-hidden border-2 p-6"
            style={{
                ...PANEL_BG, borderRadius: 18, flex: open ? 2.7 : 1,
                borderColor: open || recap ? role.color : 'rgba(255,255,255,0.16)',
            }}>
            <motion.div animate={{ opacity: dim ? 0.55 : 1 }}
                className={open ? 'flex items-center gap-4' : 'flex flex-col gap-2'}>
                <motion.span layout="position" transition={layoutT}><Icon size={36} color={role.color} strokeWidth={2.2} aria-hidden /></motion.span>
                <motion.span layout="position" transition={layoutT}
                    className="font-display text-[34px] font-semibold leading-none tracking-tight" style={{ color: role.color }}>{role.name}</motion.span>
                <motion.span layout="position" transition={layoutT} className="text-[22px] text-gray-200">{role.ask}</motion.span>
            </motion.div>

            {open && (
                <motion.div className="mt-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.25, duration: DUR.enter, ease: EASE_OUT }}>
                    {DETAIL[role.id]()}
                </motion.div>
            )}

            {recap && (
                <motion.div className="mt-auto flex flex-col gap-1"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.3, duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="font-display text-[52px] font-bold leading-none tracking-tight" style={{ color: role.color }}>{role.hook}</span>
                    <span className="text-[20px] leading-snug text-gray-100">{role.hookCaption}</span>
                </motion.div>
            )}

            {/* abertura: o ícone grande ocupa o cartão ainda fechado */}
            {step === 0 && (
                <motion.span aria-hidden className="absolute bottom-6 right-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: reduce ? 0 : 0.2, duration: DUR.enter, ease: EASE_OUT }}>
                    <Icon size={132} color={role.color} strokeWidth={1.6} />
                </motion.span>
            )}
        </motion.div>
    );
};

export default function ThreeRolesSim() {
    const { step } = useSlideSteps(STEPS);
    return (
        <div className="not-prose flex w-full flex-col gap-4" style={{ maxHeight: 516 }}>
            <Beat beat={step} className="min-h-[44px] text-[30px] font-semibold leading-tight text-white">{ROLE_BEATS[step]}</Beat>
            <div className="flex gap-4" style={{ height: 440 }}>
                {ROLES.map(r => <RoleCard key={r.id} role={r} step={step} />)}
            </div>
        </div>
    );
}
