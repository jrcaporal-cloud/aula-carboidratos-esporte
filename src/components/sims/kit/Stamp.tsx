import { motion, useReducedMotion } from 'framer-motion';
import { Check, CircleHelp, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { CountUp } from './CountUp';
import { C } from './palette';

export type Verdict = 'mito' | 'verdade' | 'depende';

const VERDICT: Record<Verdict, { color: string; label: string; Icon: typeof Check }> = {
    mito: { color: C.risk, label: 'MITO', Icon: X },
    verdade: { color: C.ok, label: 'VERDADE', Icon: Check },
    depende: { color: C.stone, label: 'DEPENDE', Icon: CircleHelp },
};

/**
 * Carimbo de veredito: cai sobre o cartão com uma mola curta (sem quicar demais) e um leve giro.
 * Cor + ícone + palavra: o veredito nunca depende só da cor.
 */
export const Stamp = ({ verdict, size = 'md' }: { verdict: Verdict; size?: 'md' | 'lg' }) => {
    const reduce = useReducedMotion();
    const { color, label, Icon } = VERDICT[verdict];
    const big = size === 'lg';
    return (
        <motion.span className="inline-flex items-center gap-2 rounded-xl border-[3px] font-display font-bold tracking-wide"
            style={{ color, borderColor: color, padding: big ? '8px 18px' : '4px 12px', fontSize: big ? 34 : 22, background: '#04080F' }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 520, damping: 26, mass: 0.8 }}>
            <Icon size={big ? 30 : 20} strokeWidth={3} aria-hidden />
            {label}
        </motion.span>
    );
};

interface BigStatProps {
    /** O número com unidade, como deve aparecer (ex.: "1,75 g/min"). Conta até o valor ao aparecer. */
    value: string;
    caption: string;
    color?: string;
    size?: number;
    delay?: number;
    style?: CSSProperties;
}

/** Número-chave de um slide: grande, chapado, com a legenda embaixo. Um por tela, no máximo dois. */
export const BigStat = ({ value, caption, color = C.glucose, size = 84, delay = 0, style }: BigStatProps) => (
    <div className="flex flex-col gap-2" style={style}>
        <CountUp text={value} delay={delay} className="font-display font-bold leading-none tracking-tight" style={{ color, fontSize: size }} />
        <span className="max-w-[420px] text-[20px] leading-snug text-gray-200">{caption}</span>
    </div>
);
