import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { KETO_BLOCKS, type KetoBlock } from './keto.content';

/**
 * Palco das meta-análises de keto e cetona: três florestas compactas empilhadas, cada uma com a sua régua
 * (% de diferença, kg, g de Hedges). Cada bloco entra no seu passo e fica; o intervalo se abre a partir da estimativa.
 */

const W = 608;
const ROW = 32;
const TOP = 22;
const AXIS = 24;
const X0 = 196;
const X1 = 482;

const Row = ({ block, i, y, show }: { block: KetoBlock; i: number; y: number; show: boolean }) => {
    const reduce = useReducedMotion();
    const r = block.rows[i];
    const sx = (v: number) => X0 + ((v - block.domain[0]) / (block.domain[1] - block.domain[0])) * (X1 - X0);
    const origin = `${((sx(r.est) - sx(r.lo)) / (sx(r.hi) - sx(r.lo))) * 100}% 50%`;
    const delay = stagger(i, 0.1, 0.15);
    return (
        <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, delay: show ? delay : 0 }}>
            <SvgText x={0} y={y + 6} text={r.label} size={17} weight={600} color="#F3F4F6" />
            <motion.rect x={sx(r.lo)} y={y - 2} width={sx(r.hi) - sx(r.lo)} height={4} rx={2} fill={block.color}
                style={{ transformBox: 'fill-box', transformOrigin: origin }}
                initial={false} animate={{ scaleX: show || reduce ? 1 : 0 }} transition={{ duration: DUR.bar, delay: show ? delay + 0.1 : 0, ease: EASE_OUT }} />
            <polygon points={`${sx(r.est) - 9},${y} ${sx(r.est)},${y - 10} ${sx(r.est) + 9},${y} ${sx(r.est)},${y + 10}`}
                fill={block.color} stroke="#04080F" strokeWidth={2} />
            <SvgText x={W} y={y + 6} text={r.right} anchor="end" size={18} weight={700} color={block.color} />
        </motion.g>
    );
};

const Block = ({ block, step }: { block: KetoBlock; step: number }) => {
    const sx = (v: number) => X0 + ((v - block.domain[0]) / (block.domain[1] - block.domain[0])) * (X1 - X0);
    const h = TOP + ROW * block.rows.length + AXIS;
    const show = step >= block.at;
    return (
        <motion.div className="flex flex-col" initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }} aria-hidden={!show}>
            <div className="flex items-baseline gap-2 leading-none">
                <span className="text-[18px] font-bold" style={{ color: block.color }}>{block.title}</span>
                <span className="text-[16px] text-gray-300">{block.sub}</span>
            </div>
            <svg viewBox={`0 0 ${W} ${h}`} width={W} height={h} role="img" aria-label={block.title}>
                <SvgText x={sx(0) - 8} y={16} text={`← ${block.sides[0]}`} anchor="end" size={16} weight={600}
                    color={block.sides[0] === 'favorece CHO' ? C.glucose : C.muted} />
                <SvgText x={sx(0) + 8} y={16} text={`${block.sides[1]} →`} size={16} weight={500} color={C.muted} />
                {block.ticks.map(t => (
                    <g key={t}>
                        <line x1={sx(t)} x2={sx(t)} y1={TOP} y2={h - AXIS + 2} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
                        <SvgText x={sx(t)} y={h - 4} text={block.tickText(t)} anchor="middle" size={16} weight={500} color={C.muted} />
                    </g>
                ))}
                <line x1={sx(0)} x2={sx(0)} y1={TOP - 2} y2={h - AXIS + 4} stroke="rgba(255,255,255,0.55)" strokeWidth={2} strokeDasharray="5 5" />
                {block.rows.map((r, i) => (
                    <Row key={r.id} block={block} i={i} y={TOP + ROW * i + ROW / 2} show={step >= r.at} />
                ))}
            </svg>
        </motion.div>
    );
};

export const KetoStage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col justify-between">
        {KETO_BLOCKS.map(b => <Block key={b.id} block={b} step={step} />)}
    </div>
);
