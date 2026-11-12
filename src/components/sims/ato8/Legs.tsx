import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Duas pernas vistas de frente, a coxa de cada uma é um tanque de glicogênio (violeta).
 * O nível sobe e desce por scaleY (nunca por altura do retângulo).
 */
interface LegsProps {
    low: number;
    high: number;
    /** Destaca a perna LOW (borda na cor do ato). */
    focusLow?: boolean;
}

const W = 300;
const H = 384;

const Leg = ({ x, level, label, focus }: { x: number; level: number; label: string; focus: boolean }) => {
    const reduce = useReducedMotion();
    const v = Math.max(0, Math.min(1, level));
    return (
        <g>
            <rect x={x} y={44} width={88} height={290} rx={40} fill="#1E293B" stroke={focus ? C.stone : '#475569'} strokeWidth={3} />
            {/* a coxa: o tanque. O líquido desce por translateY dentro do recorte da coxa. */}
            <clipPath id={`coxa-${label}`}><rect x={x + 8} y={70} width={72} height={140} rx={30} /></clipPath>
            <rect x={x + 8} y={70} width={72} height={140} rx={30} fill="rgba(255,255,255,0.06)" />
            <g clipPath={`url(#coxa-${label})`}>
                <motion.rect x={x + 8} y={70} width={72} height={140} fill={C.glycogen}
                    initial={false} animate={{ y: (1 - v) * 140 }}
                    transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }} />
            </g>
            <line x1={x + 18} x2={x + 70} y1={232} y2={232} stroke="#475569" strokeWidth={3} strokeLinecap="round" />
            <rect x={x - 4} y={326} width={96} height={20} rx={10} fill="#334155" />
            <SvgText x={x + 44} y={374} text={label} anchor="middle" size={22} weight={700} color={focus ? '#FFFFFF' : '#9CA3AF'} />
        </g>
    );
};

export const Legs = ({ low, high, focusLow = false }: LegsProps) => (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Duas pernas do mesmo voluntário: LOW e HIGH">
        <rect x={34} y={8} width={232} height={58} rx={26} fill="#334155" />
        <Leg x={44} level={low} label="LOW" focus={focusLow} />
        <Leg x={168} level={high} label="HIGH" focus={false} />
    </svg>
);
