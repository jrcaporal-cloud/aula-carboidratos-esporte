import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Tank } from '../kit/Tank';

/**
 * Tanque de glicogênio com uma torneira embaixo: a manopla gira e o jato engrossa conforme a abertura (0 → 1).
 * O jato cresce por scaleX/scaleY (nunca por largura), e nada fica correndo em loop.
 */
interface FaucetProps {
    level: number;
    value: string;
    /** Abertura da torneira, 0 → 1. */
    open: number;
    /** Mostra o jato (antes disso a torneira está fechada). */
    flowing: boolean;
    label: string;
    accent: string;
}

export const Faucet = ({ level, value, open, flowing, label, accent }: FaucetProps) => {
    const reduce = useReducedMotion();
    const angle = flowing ? -90 * open : 0;
    return (
        <div className="flex w-[220px] flex-col items-center">
            <Tank level={level} value={value} width={120} height={168} />
            {/* cano e manopla */}
            <div className="h-[18px] w-[22px]" style={{ background: '#475569' }} />
            <div className="relative flex h-[44px] w-[44px] items-center justify-center rounded-full border-[3px]" style={{ borderColor: accent, background: '#0B1220' }}>
                <motion.span className="absolute h-[8px] w-[56px] rounded-full" style={{ background: accent }}
                    initial={false} animate={{ rotate: angle }}
                    transition={{ duration: reduce ? 0 : DUR.morph * 1.5, ease: EASE_IN_OUT }} />
            </div>
            <div className="h-[10px] w-[22px]" style={{ background: '#475569' }} />
            {/* o jato: largura = abertura da PDH */}
            <div className="flex h-[70px] w-[48px] justify-center">
                <motion.div className="h-full w-full rounded-b-lg" style={{ background: C.glucose, transformOrigin: 'center top' }}
                    initial={false} animate={{ scaleX: flowing ? open : 0.05, scaleY: flowing ? 1 : 0 }}
                    transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }} />
            </div>
            <span className="mt-2 text-center text-[20px] font-bold leading-tight" style={{ color: accent }}>{label}</span>
        </div>
    );
};
