import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SugarShape, type SugarKind } from './shapes';

/**
 * Enterócito em corte (slide 26), viewBox 560 × 380: luz do intestino em cima, membrana apical com SGLT1
 * e GLUT5, célula, membrana basolateral com GLUT2 e o sangue embaixo. A fila diante do SGLT1 cresce
 * quando a dose de glicose passa do que a porta deixa entrar.
 */
const APICAL = 112, BASAL = 300;
const SGLT_X = 170, GLUT5_X = 400, GLUT2_X = 285;

interface Piece { k: SugarKind; x: number; y: number }

/** Fila de glicoses esperando o SGLT1 (até 3 por linha, empilhando para cima). */
const queue = (n: number): Piece[] =>
    Array.from({ length: n }, (_, i) => ({ k: 'glc', x: SGLT_X - 54 + (i % 4) * 36, y: APICAL - 34 - Math.floor(i / 4) * 34 }));

const Door = ({ x, y, color, name, on = true, side = 'middle' }: { x: number; y: number; color: string; name: string; on?: boolean; side?: 'start' | 'middle' | 'end' }) => (
    <motion.g animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter }}>
        <rect x={x - 32} y={y - 20} width={64} height={40} rx={10} fill={color} />
        <SvgText x={side === 'end' ? x - 4 : side === 'start' ? x + 4 : x} y={y + 46} text={name} size={20} color={color} anchor={side} />
    </motion.g>
);

interface EnterocyteProps { glucoseQueue: number; fructose: boolean; apicalGlut2: boolean }

export const Enterocyte = ({ glucoseQueue, fructose, apicalGlut2 }: EnterocyteProps) => {
    const reduce = useReducedMotion();
    const pieces: Piece[] = [...queue(glucoseQueue), ...(fructose ? [{ k: 'fru' as const, x: GLUT5_X - 18, y: APICAL - 34 }, { k: 'fru' as const, x: GLUT5_X + 18, y: APICAL - 34 }] : [])];
    return (
        <svg viewBox="0 0 560 380" className="h-[344px] w-[507px]" role="img" aria-label="Enterócito com SGLT1, GLUT5 e GLUT2">
            <SvgText x={546} y={28} text="luz do intestino" size={18} color="#D1D5DB" anchor="end" />
            <rect x={10} y={APICAL - 6} width={540} height={12} rx={4} fill={C.co2} />
            <rect x={10} y={BASAL - 6} width={540} height={12} rx={4} fill={C.co2} />
            <SvgText x={14} y={BASAL - 22} text="enterócito" size={18} color="#D1D5DB" />
            <SvgText x={14} y={366} text="sangue (veia porta)" size={18} color="#D1D5DB" />

            {/* vazão dentro da célula: uma faixa por porta aberta */}
            <path d={`M${SGLT_X} ${APICAL + 20} L${GLUT2_X - 10} ${BASAL - 20}`} stroke={C.glucose} strokeWidth={10} strokeLinecap="round" />
            <motion.path d={`M${GLUT5_X} ${APICAL + 20} L${GLUT2_X + 10} ${BASAL - 20}`} stroke={C.fructose} strokeWidth={10} strokeLinecap="round"
                initial={{ opacity: 0 }} animate={{ opacity: fructose ? 1 : 0 }} transition={{ delay: fructose ? 0.4 : 0, duration: DUR.enter }} />

            <Door x={SGLT_X} y={APICAL} color={C.co2} name="SGLT1" side="end" />
            <Door x={GLUT5_X} y={APICAL} color={C.fructose} name="GLUT5" on={fructose} side="start" />
            <Door x={GLUT2_X} y={BASAL} color={C.stone} name="GLUT2" />

            {pieces.map((p, i) => (
                <motion.g key={`${p.k}-${i}`} initial={{ x: p.x, y: p.y - 30, opacity: 0 }} animate={{ x: p.x, y: p.y, opacity: 1 }}
                    transition={{ delay: reduce ? 0 : stagger(i, 0.1, 0.06), duration: DUR.enter, ease: EASE_OUT }}>
                    <g transform="scale(0.66)"><SugarShape kind={p.k} /></g>
                </motion.g>
            ))}

            {apicalGlut2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter }}>
                    <rect x={GLUT2_X - 32} y={APICAL - 20} width={64} height={40} rx={10} fill="none" stroke={C.stone} strokeWidth={3} strokeDasharray="7 5" />
                    <line x1={GLUT2_X - 30} y1={APICAL - 30} x2={GLUT2_X + 30} y2={APICAL + 30} stroke={C.risk} strokeWidth={6} strokeLinecap="round" />
                    <line x1={GLUT2_X + 30} y1={APICAL - 30} x2={GLUT2_X - 30} y2={APICAL + 30} stroke={C.risk} strokeWidth={6} strokeLinecap="round" />
                    <SvgText x={GLUT2_X} y={APICAL + 46} text="GLUT2 apical?" size={20} color={C.risk} anchor="middle" />
                </motion.g>
            )}
        </svg>
    );
};
