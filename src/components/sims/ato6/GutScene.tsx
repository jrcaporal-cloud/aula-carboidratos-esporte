import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Corte esquemático do intestino (slide 109): lúmen com o carboidrato, a fileira de enterócitos com os
 * transportadores na borda apical e o capilar embaixo. Sem treino: poucos transportadores, fila no lúmen,
 * bactérias fermentando e H₂ subindo. Treinado: mais transportadores (a explicação provável, não medida), fila curta.
 * viewBox 290 × 186.
 */

export const GUT_W = 290;
export const GUT_H = 186;
const APICAL = 96;
const CELL_W = 52;
const CELLS = [10, 66, 122, 178, 234] as const;
const HEX = 'M 0 -10 L 8.7 -5 L 8.7 5 L 0 10 L -8.7 5 L -8.7 -5 Z';

interface SideSpec {
    transporters: readonly number[];
    queue: readonly (readonly [number, number])[];
    bubbles: readonly (readonly [number, number])[];
    bacteria: readonly (readonly [number, number])[];
}

const SIDES: Record<'untrained' | 'trained', SideSpec> = {
    untrained: {
        transporters: [92, 204],
        queue: [[78, 70], [100, 62], [124, 72], [148, 62], [172, 72], [196, 64], [214, 78]],
        bubbles: [[214, 38], [238, 34], [262, 38]],
        bacteria: [[226, 58], [262, 62]],
    },
    trained: {
        transporters: [36, 92, 148, 204, 260],
        queue: [[96, 70], [176, 66], [232, 76]],
        bubbles: [[262, 36]],
        bacteria: [[262, 62]],
    },
};

/** Moléculas que atravessam os transportadores no lado treinado (uma vez por clique). */
const Crossing = ({ xs }: { xs: readonly number[] }) => (
    <g>
        {xs.map((x, i) => (
            <motion.path key={x} d={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={2}
                initial={{ x, y: APICAL - 26, opacity: 0 }} animate={{ x, y: [APICAL - 26, APICAL + 22, 172], opacity: [0, 1, 0] }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.7, ease: EASE_IN_OUT }} />
        ))}
    </g>
);

export const GutSide = ({ kind, h2, note, animate }: {
    kind: 'untrained' | 'trained';
    /** Leitura do hálito (vazia até o passo do resultado). */
    h2?: string;
    note: string;
    /** Passo em que este lado entra: a cena se monta uma vez. */
    animate: boolean;
}) => {
    const reduce = useReducedMotion() ?? false;
    const s = SIDES[kind];
    const enter = (i: number) => ({ delay: animate ? stagger(i, 0.15, 0.06) : 0, duration: DUR.enter, ease: EASE_OUT });
    return (
        <svg viewBox={`0 0 ${GUT_W} ${GUT_H}`} width={GUT_W} height={GUT_H} role="img"
            aria-label={kind === 'trained' ? 'Intestino treinado: mais transportadores, pouca fila e pouco H₂' : 'Intestino sem treino: fila de carboidrato, fermentação e H₂'}>
            <rect x={0} y={42} width={GUT_W} height={APICAL - 42} rx={8} fill="#0F172A" />
            <SvgText x={6} y={60} text="lúmen" size={16} color={C.muted} weight={700} />
            {CELLS.map(x => <rect key={x} x={x} y={APICAL} width={CELL_W} height={56} rx={8} fill="#1E293B" stroke="#64748B" strokeWidth={2} />)}
            <rect x={0} y={162} width={GUT_W} height={24} rx={10} fill="#334155" />
            <SvgText x={10} y={180} text="sangue →  fígado" size={16} color="#F1F5F9" />
            {s.transporters.map((x, i) => (
                <motion.rect key={x} x={x - 8} y={APICAL - 6} width={16} height={18} rx={4} fill={C.glucose} stroke="#04080F" strokeWidth={2}
                    initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={enter(i)} />
            ))}
            {s.bacteria.map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx={13} ry={8} fill={C.stone} stroke="#04080F" strokeWidth={2} />)}
            {s.queue.map(([x, y], i) => (
                <motion.path key={x} d={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={2} transform={`translate(${x} ${y})`}
                    initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={enter(i)} />
            ))}
            {s.bubbles.map(([x, y], i) => (
                <motion.circle key={x} cx={x} cy={y} r={10} fill="none" stroke={C.caveat} strokeWidth={3}
                    initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: animate ? 0.5 + i * 0.12 : 0, duration: DUR.morph, ease: EASE_OUT }} />
            ))}
            <SvgText x={GUT_W - 4} y={15} text={h2 ? `H₂ ${h2}` : 'H₂ ↑'} size={18} anchor="end" color={C.stone} weight={800} />
            <SvgText x={4} y={15} text={note} size={16} color="#E5E7EB" weight={700} />
            {kind === 'trained' && animate && !reduce && <Crossing xs={s.transporters.slice(0, 3)} />}
        </svg>
    );
};
