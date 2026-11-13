import { motion } from 'framer-motion';
import { C } from '../../sims/kit/palette';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { LAST_STEP } from './steps';

/*
 * Número da última etapa, no painel lateral (o canto do palco fica livre para o feixe ampliado): o que
 * a dosagem entrega, com a faixa medida em 1967 (BERGSTROM1967, dossiê 02: 0,6 a 4,7 g/100 g de
 * músculo úmido entre as dietas).
 */
export const BiopsyNumber = ({ step }: { step: number }) => {
    if (step !== LAST_STEP) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT, delay: 0.3 }}
            className="mt-4 rounded-xl px-4 py-3" style={{ border: `2px solid ${C.glycogen}`, background: 'rgba(4,10,20,0.6)' }}
        >
            <p className="mb-1 text-[14px] font-mono uppercase tracking-wider text-gray-400">o que a dosagem entrega</p>
            <p className="text-[40px] font-semibold leading-none tabular-nums" style={{ color: C.glycogenSoft, fontFamily: 'var(--font-display)' }}>0,6–4,7</p>
            <p className="mt-1.5 text-[18px] text-gray-100">g/100 g de músculo úmido</p>
            <p className="mt-1 text-[15px] text-gray-400">faixa medida em 1967, entre as dietas</p>
        </motion.div>
    );
};
