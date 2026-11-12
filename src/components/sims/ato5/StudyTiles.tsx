import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';

/**
 * Os 19 estudos da meta-análise como quadrados (slide 86). Em grade, cada um é um estudo (o 1º, âmbar,
 * é o de 1991); no passo seguinte todos deslizam para uma pilha só e, abaixo dela, o resultado combinado
 * aparece como losango sobre a linha do efeito nulo, cruzando-a (p > 0,05). A largura do losango é desenho:
 * a meta-análise não dá um IC único para o slide. Só transform e opacidade; as posições dos quadrados não carregam dado.
 */
const BOX = { w: 600, h: 330 } as const;
const TILE = 64;
const GAP = 16;
const COLS = 5;
const GRID_X = (BOX.w - (COLS * TILE + (COLS - 1) * GAP)) / 2;
const GRID_Y = 6;
const PILE_STEP = 14;
const PILE_Y = 34;
const NULL_X = BOX.w / 2;
const AXIS_Y = 262;
const DIAMOND = { y: 196, left: 168, right: 392, half: 26 } as const;

export interface PooledText {
    zero: string;
    pile: string;
    result: string;
    sides: readonly [string, string];
}

interface StudyTilesProps {
    count: number;
    show: boolean;
    pooled: boolean;
    text: PooledText;
}

const SVG_TEXT = { fontFamily: 'var(--font-body)', paintOrder: 'stroke', stroke: '#04080F', strokeWidth: 4, strokeLinejoin: 'round' } as const;

/** Linha do efeito nulo, eixo com os dois lados e o losango do resultado combinado. */
const PooledResult = ({ text }: { text: PooledText }) => {
    const { y, left, right, half } = DIAMOND;
    return (
        <svg viewBox={`0 0 ${BOX.w} ${BOX.h}`} width={BOX.w} height={BOX.h} className="absolute inset-0" aria-hidden>
            <text x={NULL_X} y={20} textAnchor="middle" fontSize={18} fill={C.text} style={SVG_TEXT}>{text.pile}</text>
            <path d={`M${NULL_X} 110 L${NULL_X} 150 M${NULL_X - 10} 140 L${NULL_X} 152 L${NULL_X + 10} 140`} stroke={C.muted} strokeWidth={3} fill="none" />
            <path d={`M${left} ${y} L${(left + right) / 2} ${y - half} L${right} ${y} L${(left + right) / 2} ${y + half} Z`} fill={C.co2} />
            <line x1={NULL_X} x2={NULL_X} y1={160} y2={AXIS_Y} stroke={C.text} strokeWidth={4} />
            <text x={right + 14} y={y + 7} fontSize={20} fontWeight={700} fill={C.text} style={SVG_TEXT}>{text.result}</text>
            <line x1={40} x2={BOX.w - 40} y1={AXIS_Y} y2={AXIS_Y} stroke={C.co2} strokeWidth={3} />
            <text x={NULL_X} y={AXIS_Y + 26} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.text} style={SVG_TEXT}>{text.zero}</text>
            <text x={40} y={AXIS_Y + 56} fontSize={17} fill={C.muted} style={SVG_TEXT}>{`← ${text.sides[0]}`}</text>
            <text x={BOX.w - 40} y={AXIS_Y + 56} textAnchor="end" fontSize={17} fill={C.muted} style={SVG_TEXT}>{`${text.sides[1]} →`}</text>
        </svg>
    );
};

export const StudyTiles = ({ count, show, pooled, text }: StudyTilesProps) => {
    const reduce = useReducedMotion();
    const pileX = (BOX.w - (TILE + (count - 1) * PILE_STEP)) / 2;
    return (
        <div className="relative" style={{ width: BOX.w, height: BOX.h }}>
            <motion.div className="absolute inset-0" initial={false} animate={{ opacity: pooled ? 1 : 0 }}
                transition={{ duration: DUR.enter, delay: pooled ? 0.65 : 0 }}>
                <PooledResult text={text} />
            </motion.div>
            {Array.from({ length: count }, (_, i) => {
                const gx = GRID_X + (i % COLS) * (TILE + GAP);
                const gy = GRID_Y + Math.floor(i / COLS) * (TILE + GAP);
                const px = pileX + i * PILE_STEP;
                const founder = i === 0;
                return (
                    <motion.span key={i} className="absolute left-0 top-0 rounded-lg border-2"
                        style={{ width: TILE, height: TILE, background: founder ? C.glucose : '#1E293B', borderColor: founder ? C.glucoseSoft : C.co2 }}
                        initial={{ opacity: 0, x: gx, y: gy, scale: 0.94 }}
                        animate={{ opacity: show ? 1 : 0, x: pooled ? px : gx, y: pooled ? PILE_Y : gy, scale: 1 }}
                        transition={{
                            opacity: { duration: DUR.enter, delay: show && !pooled ? Math.min(i * 0.03, 0.55) : 0 },
                            scale: { duration: DUR.enter, ease: EASE_OUT },
                            x: { duration: reduce ? 0 : 0.7, ease: EASE_IN_OUT, delay: pooled ? Math.min(i * 0.015, 0.3) : 0 },
                            y: { duration: reduce ? 0 : 0.7, ease: EASE_IN_OUT, delay: pooled ? Math.min(i * 0.015, 0.3) : 0 },
                        }} />
                );
            })}
        </div>
    );
};
