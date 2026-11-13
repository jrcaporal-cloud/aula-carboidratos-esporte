import type { ReactNode } from 'react';
import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { C } from '../../sims/kit/palette';
import { DUR, EASE_OUT } from '../../../lib/motion';
import type { Vec3 } from '../shared/modal/types';
import { STEP } from './steps';

/*
 * Placar no canto da cena (só números do dossiê 02: ORTENBLAD2011 e GEJL2014; r² é conta nossa) e o
 * "?" grande entre o glicogênio intramiofibrilar e o RyR1: o elo é hipótese, não uma peça da fibra.
 */

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

export const TriadHud = ({ step }: { step: number }) => {
    if (step === STEP.low) {
        return (
            <Card step={step}>
                <p className="mb-1 text-[14px] font-mono uppercase tracking-wider text-gray-400">braço · % do inicial</p>
                <div className="flex gap-6">
                    <Big value="31%" color={C.glycogenSoft} label="glicogênio" />
                    <Big value="85%" color={C.insulinSoft} label="liberação de Ca²⁺" />
                </div>
                <p className="mt-2 text-[16px] text-gray-300">4 h só com água: 29% e 77%</p>
            </Card>
        );
    }
    if (step === STEP.doubt) {
        return (
            <Card step={step}>
                <p className="mb-1 text-[14px] font-mono uppercase tracking-wider text-gray-400">Gejl 2014 · 14 triatletas</p>
                <Big value="r = 0,30" color={C.stone} label="glicogênio × liberação de Ca²⁺" />
                <p className="mt-2 text-[16px] text-gray-300">r² ≈ 0,09 (cálculo): ~9% da variação</p>
            </Card>
        );
    }
    return null;
};

/** O "?" do elo glicogênio → RyR1, ancorado no vão entre os dois (sem linha: nada de ligação desenhada). */
export const DoubtMark = ({ at, visible }: { at: Vec3; visible: boolean }) => (visible ? (
    <group position={[...at]}>
        <Html center zIndexRange={[41, 11]} style={{ pointerEvents: 'none' }}>
            <div
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-full opacity-0 animate-[label-in_250ms_cubic-bezier(0.23,1,0.32,1)_forwards] text-[34px] font-bold leading-none"
                style={{ background: '#04080F', border: `3px solid ${C.stone}`, color: C.stone, animationDelay: '200ms' }}
            >
                ?
            </div>
        </Html>
    </group>
) : null);
