import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { C } from '../../sims/kit/palette';
import { br } from '../../sims/kit/format';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { TRANSPORT, transportOf, type KeyMode, type Keys } from './steps';

/*
 * Controles das duas chaves (etapas 4 e 5, no painel) e o placar da fibra (no canto da cena):
 * transporte de glicose medido por LUND1995 e, na etapa do cálcio, os números de ORTENBLAD2011.
 */

const MODES: readonly { id: KeyMode; label: string }[] = [
    { id: 'insulina', label: 'Insulina' }, { id: 'contracao', label: 'Contração' }, { id: 'ambas', label: 'As duas' },
];

export const KeyControls = ({ keys, onChange }: { keys: Keys; onChange: (k: Keys) => void }) => {
    const wortBlocked = TRANSPORT[keys.mode].wort === null;
    return (
        <div className="mt-4 rounded-xl bg-white/[0.05] p-3">
            <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Chave do GLUT4">
                {MODES.map(m => {
                    const on = keys.mode === m.id;
                    return (
                        <button
                            key={m.id} type="button" role="radio" aria-checked={on}
                            onClick={() => onChange({ mode: m.id, wort: TRANSPORT[m.id].wort === null ? false : keys.wort })}
                            className="h-10 rounded-lg text-[16px] font-semibold transition-transform duration-150 ease-out active:scale-[0.97]"
                            style={on ? { background: C.insulin, color: '#04080F' } : { background: 'rgba(255,255,255,0.06)', color: '#D1D5DB' }}
                        >
                            {m.label}
                        </button>
                    );
                })}
            </div>
            <button
                type="button" role="switch" aria-checked={keys.wort} disabled={wortBlocked}
                onClick={() => onChange({ ...keys, wort: !keys.wort })}
                className="mt-2 flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-[16px] font-semibold transition-transform duration-150 ease-out active:scale-[0.98] disabled:opacity-50"
                style={keys.wort ? { background: `${C.risk}26`, color: '#fff', boxShadow: `inset 0 0 0 2px ${C.risk}` } : { background: 'rgba(255,255,255,0.06)', color: '#D1D5DB' }}
            >
                <span className="relative h-5 w-9 shrink-0 rounded-full" style={{ background: keys.wort ? C.risk : 'rgba(255,255,255,0.25)' }}>
                    <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-out ${keys.wort ? 'translate-x-4' : ''}`} />
                </span>
                Wortmanina (bloqueia a PI3K)
            </button>
            {wortBlocked && <p className="mt-1.5 text-[14px] text-gray-400">As duas chaves com wortmanina: não medido.</p>}
        </div>
    );
};

const Card = ({ step, children }: { step: number; children: ReactNode }) => (
    <motion.div key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}
        className="rounded-xl bg-[rgba(4,10,20,0.92)] px-4 py-3">
        {children}
    </motion.div>
);

const Big = ({ value, color, label }: { value: string; color: string; label: string }) => (
    <div>
        <div className="text-[34px] font-semibold leading-none tabular-nums" style={{ color, fontFamily: 'var(--font-display)' }}>{value}</div>
        <div className="mt-1 text-[16px] text-gray-300">{label}</div>
    </div>
);

export const FiberHud = ({ step, keys }: { step: number; keys: Keys | null }) => {
    if (keys && (step === 3 || step === 4)) {
        return (
            <Card step={step}>
                <p className="mb-1 text-[14px] font-mono tracking-wider text-gray-400">TRANSPORTE DE GLICOSE · µmol·mL⁻¹·h⁻¹</p>
                <Big value={br(transportOf(keys), 1)} color={C.insulinSoft} label={`${MODES.find(m => m.id === keys.mode)?.label ?? ''}${keys.wort ? ' + wortmanina' : ''}`} />
            </Card>
        );
    }
    if (step === 1) {
        return (
            <Card step={step}>
                <p className="mb-1 text-[14px] font-mono uppercase tracking-wider text-gray-400">do glicogênio total</p>
                <Big value="10–15%" color={C.glycogenSoft} label="intramiofibrilar" />
            </Card>
        );
    }
    if (step === 5) {
        return (
            <Card step={step}>
                <p className="mb-1 text-[14px] font-mono uppercase tracking-wider text-gray-400">braço · % do inicial</p>
                <div className="flex gap-6">
                    <Big value="31%" color={C.glycogenSoft} label="glicogênio" />
                    <Big value="85%" color="#F5F5F4" label="liberação de Ca²⁺" />
                </div>
                <p className="mt-2 text-[16px] text-gray-300">4 h sem CHO: 29% e 77%</p>
            </Card>
        );
    }
    return null;
};
