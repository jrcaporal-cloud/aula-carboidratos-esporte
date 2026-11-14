import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { C } from '../../sims/kit/palette';
import { DUR, EASE_OUT } from '../../../lib/motion';
import type { Rinse } from './RinseScene';
import { STEP } from './steps';

/*
 * O que fica fora da cena: o botão carboidrato × sacarina (canto da cena, etapa da recompensa; só
 * estriado e cingulado anterior mudam, nada é dito das outras áreas) e os números no painel
 * (CART2004B na boca; BRIE2019 no comando motor).
 */

const OPTIONS: readonly { id: Rinse; label: string; sub: string }[] = [
    { id: 'carb', label: 'Carboidrato', sub: 'glicose' },
    { id: 'sac', label: 'Sacarina', sub: 'doce, sem carboidrato' },
];

interface HudProps { step: number; rinse: Rinse; onRinse: (r: Rinse) => void }

export const RinseHud = ({ step, rinse, onRinse }: HudProps) => {
    if (step !== STEP.reward) return null;
    return (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}
            className="pointer-events-auto w-[300px] rounded-xl bg-[rgba(4,10,20,0.92)] p-3">
            <p className="mb-2 text-[14px] font-mono uppercase tracking-wider text-gray-400">bochecho com</p>
            <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Solução do bochecho">
                {OPTIONS.map(o => {
                    const on = rinse === o.id;
                    const color = o.id === 'carb' ? C.glucose : C.stone;
                    return (
                        <button
                            key={o.id} type="button" role="radio" aria-checked={on} onClick={() => onRinse(o.id)}
                            className="flex flex-col items-start rounded-lg px-2.5 py-1.5 text-left transition-transform duration-150 ease-out active:scale-[0.97]"
                            style={on ? { background: color, color: '#04080F' } : { background: 'rgba(255,255,255,0.06)', color: '#E5E7EB' }}
                        >
                            <span className="text-[16px] font-semibold leading-tight">{o.label}</span>
                            <span className="text-[14px] leading-tight" style={{ color: on ? '#1F2937' : '#9CA3AF' }}>{o.sub}</span>
                        </button>
                    );
                })}
            </div>
            <p className="mt-2 text-[16px] leading-snug text-gray-100">
                {rinse === 'carb' ? 'Estriado e cingulado anterior acendem.' : 'Estriado e cingulado anterior não responderam.'}
            </p>
        </motion.div>
    );
};

const Card = ({ step, color, children }: { step: number; color: string; children: ReactNode }) => (
    <motion.div key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT, delay: 0.3 }}
        className="mt-4 rounded-xl px-4 py-3" style={{ border: `2px solid ${color}`, background: 'rgba(4,10,20,0.6)' }}>
        {children}
    </motion.div>
);

const Kicker = ({ children }: { children: ReactNode }) => <p className="mb-1 text-[14px] font-mono uppercase tracking-wider text-gray-400">{children}</p>;

const Big = ({ value, label, color = C.glucoseSoft }: { value: string; label: string; color?: string }) => (
    <div>
        <div className="text-[34px] font-semibold leading-none tabular-nums" style={{ color, fontFamily: 'var(--font-display)' }}>{value}</div>
        <div className="mt-1 text-[16px] leading-snug text-gray-200">{label}</div>
    </div>
);

export const RinseNumbers = ({ step }: { step: number }) => {
    if (step === STEP.mouth) {
        return (
            <Card step={step} color={C.glucose}>
                <Kicker>contrarrelógio · min</Kicker>
                <div className="flex gap-6">
                    <Big value="59,57" label="bochecho, cuspido" />
                    <Big value="61,37" label="água" color="#E5E7EB" />
                </div>
            </Card>
        );
    }
    if (step === STEP.motor) {
        return (
            <Card step={step} color={C.glucose}>
                <Kicker>meta-análise · 13 estudos</Kicker>
                <div className="flex gap-6">
                    <Big value="0,25" label="SMD · potência média" />
                    <Big value="ns" label="tempo (p = 0,25)" color="#E5E7EB" />
                </div>
            </Card>
        );
    }
    return null;
};
