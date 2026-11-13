import { motion, useReducedMotion } from 'framer-motion';
import { DUR } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { TEXT } from './oneDayLoad.content';

/**
 * Linha do tempo do dia de carga (slide 81), no lugar do relógio em anel: 24 gomos de 1 h, de 0 a 24 h, que acendem
 * da esquerda para a direita quando o dia passa (passo 2). No passo 3 entra, à esquerda do 0 e depois de um corte
 * de escala (//), o bloco dos 3 min de esforço do Fairchild: 3 min não cabem na régua de horas, por isso o corte.
 */
const W = 640;
const H = 92;
const X0 = 170;
const X1 = 628;
const BAR_Y = 30;
const BAR_H = 26;
const GAP = 3;
const HOUR_W = (X1 - X0) / 24;
const SPRINT_X = 30;
const SPRINT_W = 96;

const xOf = (h: number) => X0 + h * HOUR_W;

export const DayTimeline = ({ lit, sprint }: { lit: boolean; sprint: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" role="img"
            aria-label="linha do tempo do dia de carga, de 0 a 24 horas; antes do zero, 3 minutos de esforço só no estudo de Fairchild">
            <SvgText x={X0} y={BAR_Y - 10} text={TEXT.day} size={16} color={C.glucoseSoft} weight={700} />
            {Array.from({ length: 24 }, (_, i) => (
                <motion.rect key={i} x={xOf(i) + GAP / 2} y={BAR_Y} width={HOUR_W - GAP} height={BAR_H} rx={2} fill={C.glucose}
                    initial={false} animate={{ opacity: lit ? 1 : 0.18 }}
                    transition={{ delay: reduce || !lit ? 0 : 0.1 + i * 0.034, duration: 0.12 }} />
            ))}
            {[0, 6, 12, 18, 24].map(h => (
                <g key={h}>
                    <line x1={xOf(h)} x2={xOf(h)} y1={BAR_Y + BAR_H + 2} y2={BAR_Y + BAR_H + 8} stroke={C.muted} strokeWidth={2} />
                    <SvgText x={xOf(h)} y={BAR_Y + BAR_H + 26} text={h === 24 ? '24 h' : String(h)} anchor="middle" size={16} color={C.muted} />
                </g>
            ))}
            <motion.g initial={false} animate={{ opacity: sprint ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
                <SvgText x={SPRINT_X + SPRINT_W / 2} y={BAR_Y - 10} text={TEXT.sprint} anchor="middle" size={16} color={C.stone} weight={700} />
                <rect x={SPRINT_X} y={BAR_Y} width={SPRINT_W} height={BAR_H} rx={2} fill={C.stone} />
                <SvgText x={SPRINT_X + SPRINT_W / 2} y={BAR_Y + BAR_H + 26} text={TEXT.sprintWho} anchor="middle" size={16} color={C.stone} />
                {/* corte de escala: 3 min não cabem na régua de horas */}
                <path d={`M${SPRINT_X + SPRINT_W + 12} ${BAR_Y + BAR_H + 4} l10 -${BAR_H + 8} M${SPRINT_X + SPRINT_W + 22} ${BAR_Y + BAR_H + 4} l10 -${BAR_H + 8}`}
                    stroke={C.muted} strokeWidth={2.5} />
            </motion.g>
        </svg>
    );
};
