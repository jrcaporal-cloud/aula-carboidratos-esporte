import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from './palette';

interface TankProps {
    /** Nível, 0 → 1. Mudar o nível entre passos anima o enchimento/esvaziamento. */
    level: number;
    /** Rótulo embaixo (ex.: "músculo", "fígado"). */
    label?: string;
    /** Texto no topo do tanque (ex.: "~500 g"). */
    value?: string;
    color?: string;
    width?: number;
    height?: number;
    /** Destaca a borda quando o tanque é o assunto do passo. */
    active?: boolean;
}

/**
 * O tanque de glicogênio: o símbolo recorrente da aula (Ato I apresenta, Atos IV–IX voltam a ele).
 * Cápsula chapada; o líquido sobe por scaleY a partir do fundo. Abaixo de 20% a borda fica no tom de risco.
 */
export const Tank = ({ level, label, value, color = C.glycogen, width = 72, height = 200, active = false }: TankProps) => {
    const reduce = useReducedMotion();
    const v = Math.max(0, Math.min(1, level));
    const low = v < 0.2;
    const border = low ? C.risk : active ? color : 'rgba(255,255,255,0.22)';
    return (
        <div className="flex flex-col items-center gap-2">
            {value && <span className="font-mono text-[16px] tabular-nums text-gray-100">{value}</span>}
            <div className="relative overflow-hidden rounded-[999px] border-2 transition-colors duration-300"
                style={{ width, height, borderColor: border, background: 'rgba(255,255,255,0.04)' }}
                role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)} aria-label={label ?? 'tanque'}>
                <motion.div aria-hidden className="absolute inset-0"
                    style={{ background: color, transformOrigin: 'center bottom' }}
                    initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: v }}
                    transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }} />
                {/* marcas de quarto: dão leitura de nível sem número */}
                {[0.25, 0.5, 0.75].map(m => (
                    <span key={m} aria-hidden className="absolute left-0 w-3 h-[2px] bg-black/40" style={{ bottom: `${m * 100}%` }} />
                ))}
            </div>
            {label && <span className="text-[16px] text-gray-200">{label}</span>}
        </div>
    );
};
