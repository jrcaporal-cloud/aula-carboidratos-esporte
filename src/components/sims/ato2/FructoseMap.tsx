import { motion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SugarShape } from './shapes';

/**
 * Mapa dos destinos da frutose (slide 27), viewBox 700 × 380. As frações NÃO somam 100% (se sobrepõem):
 * por isso as setas têm a mesma espessura, sem fingir partilha proporcional (não é um Sankey).
 * `focus`: 'all' (os três destinos), 'muscle' (glicose e lactato chegando ao músculo), 'gut' (o intestino).
 */
export type Focus = 'all' | 'muscle' | 'gut';

const MID = { x: 250, y: 190 };
const DEST = [
    { id: 'ox', name: 'oxidada', pct: '~45%', y: 66, color: C.co2 },
    { id: 'glc', name: 'vira glicose', pct: '~41%', y: 190, color: C.glucose },
    { id: 'lac', name: 'vira lactato', pct: '~¼', y: 314, color: C.lactate },
] as const;
const DX = 440, MUSCLE = { x: 640, y: 252 };

const fade = (on: boolean, delay = 0) => ({
    animate: { opacity: on ? 1 : 0.6 },
    transition: { duration: DUR.enter, ease: EASE_OUT, delay: on ? delay : 0 },
});

export const FructoseMap = ({ focus }: { focus: Focus }) => {
    const gut = focus === 'gut';
    const muscle = focus === 'muscle';
    return (
        <svg viewBox="0 0 700 380" className="h-[346px] w-[637px]" role="img" aria-label="Destinos da frutose ingerida">
            <g transform={`translate(70 ${MID.y}) scale(1.6)`}><SugarShape kind="fru" /></g>
            <SvgText x={70} y={MID.y + 66} text="frutose" size={22} color={C.fructoseSoft} anchor="middle" />
            <line x1={115} y1={MID.y} x2={MID.x - 76} y2={MID.y} stroke={C.fructose} strokeWidth={8} strokeLinecap="round" />

            <motion.g initial={false} animate={{ scale: gut ? 1.08 : 1 }} transition={{ duration: DUR.morph, ease: EASE_OUT }}>
                <rect x={MID.x - 74} y={MID.y - 44} width={148} height={88} rx={18} fill="#04080F"
                    stroke={gut ? C.fructose : '#64748B'} strokeWidth={4} />
                <SvgText x={MID.x} y={MID.y - 6} text="intestino" size={20} anchor="middle" />
                <SvgText x={MID.x} y={MID.y + 22} text="e fígado" size={20} anchor="middle" />
            </motion.g>
            {gut && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: DUR.enter }}>
                    <SvgText x={MID.x} y={MID.y - 72} text="~90% da dose baixa" size={24} color={C.fructoseSoft} anchor="middle" weight={700} />
                    <SvgText x={MID.x} y={MID.y + 84} text="fica no intestino" size={20} anchor="middle" />
                </motion.g>
            )}

            {DEST.map(d => {
                const on = focus === 'all' || (muscle && d.id !== 'ox');
                return (
                    <motion.g key={d.id} {...fade(on && !gut)}>
                        <path d={`M${MID.x + 74} ${MID.y} C${MID.x + 130} ${MID.y} ${DX - 80} ${d.y} ${DX - 18} ${d.y}`}
                            fill="none" stroke={d.color} strokeWidth={6} strokeLinecap="round" />
                        <circle cx={DX} cy={d.y} r={16} fill={d.color} />
                        <SvgText x={DX + 28} y={d.y - 8} text={d.pct} size={34} color={d.color} weight={700} />
                        <SvgText x={DX + 28} y={d.y + 22} text={d.name} size={20} />
                    </motion.g>
                );
            })}

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: muscle ? 1 : 0 }} transition={{ delay: muscle ? 0.3 : 0, duration: DUR.enter }}>
                <path d={`M${DX + 150} ${190} C${MUSCLE.x} 200 ${MUSCLE.x} 210 ${MUSCLE.x} ${MUSCLE.y - 30}`} fill="none" stroke={C.glucose} strokeWidth={6} />
                <path d={`M${DX + 150} ${314} C${MUSCLE.x} 300 ${MUSCLE.x} 290 ${MUSCLE.x} ${MUSCLE.y + 30}`} fill="none" stroke={C.lactate} strokeWidth={6} />
                <rect x={MUSCLE.x - 52} y={MUSCLE.y - 24} width={104} height={48} rx={12} fill={C.stone} />
                <text x={MUSCLE.x} y={MUSCLE.y + 7} textAnchor="middle" fontSize={20} fontWeight={700} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>músculo</text>
            </motion.g>
        </svg>
    );
};
