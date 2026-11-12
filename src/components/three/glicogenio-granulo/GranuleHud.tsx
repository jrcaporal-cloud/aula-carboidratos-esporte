import { motion } from 'framer-motion';
import { C } from '../../sims/kit/palette';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { CHAIN, TIERS, glucoseIn } from './build';

/*
 * Placar do modelo de camadas (canto inferior esquerdo): camadas, glicoses e o que a etapa diz delas.
 * Contas do próprio modelo (13 glicoses por cadeia, 2 ramos por cadeia interna), não medidas.
 */

const n = (v: number) => v.toLocaleString('pt-BR');
const OUTER = CHAIN * 2 ** (TIERS - 1);
const RELEASED = (CHAIN - 4) * 2 ** (TIERS - 1);

interface Row { label: string; value: string; color: string }

const ROWS: readonly (readonly Row[])[] = [
    [{ label: 'camadas', value: '1', color: C.glycogenSoft }, { label: 'glicoses', value: n(glucoseIn(1)), color: C.glucose }],
    [{ label: 'camadas', value: '3', color: C.glycogenSoft }, { label: 'glicoses', value: n(glucoseIn(3)), color: C.glycogenSoft }],
    [{ label: 'camadas', value: '7', color: C.glycogenSoft }, { label: 'glicoses', value: n(glucoseIn(7)), color: C.glycogenSoft }],
    [{ label: 'glicoses', value: n(glucoseIn(TIERS)), color: C.glycogenSoft }, { label: 'na casca', value: `${n(OUTER)} · 50%`, color: C.glucoseSoft }],
    [{ label: 'liberadas', value: n(RELEASED), color: C.glucose }, { label: 'ficam', value: n(glucoseIn(TIERS) - RELEASED), color: C.glycogenSoft }],
    [{ label: 'de volta', value: n(RELEASED), color: C.glycogenSoft }, { label: 'glicoses', value: n(glucoseIn(TIERS)), color: C.glycogenSoft }],
];

export const GranuleHud = ({ step }: { step: number }) => (
    <motion.div
        key={step}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}
        className="rounded-xl bg-[rgba(4,10,20,0.92)] px-4 py-3"
    >
        <p className="mb-1 text-[14px] font-mono uppercase tracking-wider text-gray-400">modelo de camadas · contagem</p>
        <div className="flex gap-6">
            {ROWS[step].map(r => (
                <div key={r.label}>
                    <div className="text-[34px] font-semibold leading-none tabular-nums" style={{ color: r.color, fontFamily: 'var(--font-display)' }}>{r.value}</div>
                    <div className="mt-1 text-[16px] text-gray-300">{r.label}</div>
                </div>
            ))}
        </div>
    </motion.div>
);
