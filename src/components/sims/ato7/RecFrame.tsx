import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { StepTabs } from '../kit/ui';

/**
 * Moldura dos slides 120–123 (Ato VII, parte A: recuperação do músculo). Só composição:
 * abas com nome + selos à direita, e o bloco de narração do painel (título colorido + texto de pós).
 * As peças da parte B do ato (fígado, Fuchs, Lara) não usam este arquivo.
 */

interface RecTopProps {
    tabs: readonly string[];
    step: number;
    setStep: (s: number) => void;
    layoutId: string;
    chips?: ReactNode;
}

export const RecTop = ({ tabs, step, setStep, layoutId, chips }: RecTopProps) => (
    <div className="flex items-center justify-between gap-4">
        <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
        {chips && <div className="flex flex-wrap justify-end gap-2">{chips}</div>}
    </div>
);

interface NarrationProps {
    step: number;
    headline: string;
    color: string;
    children: ReactNode;
    size?: number;
}

/** Título do passo (24 px, na cor da ideia) e o texto de pós. Troca com uma subida curta a cada passo. */
export const Narration = ({ step, headline, color, children, size = 17 }: NarrationProps) => (
    <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color }}>{headline}</h3>
        <p className="m-0 leading-snug text-gray-100" style={{ fontSize: size }}>{children}</p>
    </motion.div>
);

/** Linha que entra no passo `at` e fica (livro-caixa que acumula). */
export const LedgerRow = ({ at, step, children, className = '' }: { at: number; step: number; children: ReactNode; className?: string }) => (
    <motion.tr initial={false} animate={{ opacity: step >= at ? 1 : 0, y: step >= at ? 0 : 6 }}
        transition={{ duration: DUR.enter, delay: step === at ? 0.45 : 0, ease: EASE_OUT }} className={className}>
        {children}
    </motion.tr>
);
