import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { CalcChip, DesignChip } from './kit/chips';
import { CountSvgText } from './kit/CountUp';
import { br } from './kit/format';
import { C } from './kit/palette';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { SvgText } from './kit/ui';
import { Gut } from './ato6/paGut';
import { PaFrame, PaSide, STAGE_INNER_H, STAGE_INNER_W } from './ato6/paFrame';
import { LESSONS, ROWS, STEPS } from './ato6/ceiling.content';

/**
 * Slide 103 · O Teto de um Grama. Palco em dois andares: em cima, o funil de três ensaios com ¹³C (o que entra ×
 * o que se oxida, em g/h; legenda no alto: vazada = ingerido, âmbar = oxidado, vermelho = no caminho, faixa = teto); embaixo, o enterócito com a glicose passando pelo SGLT1 em laço, e a fila que se forma
 * quando a ingestão passa do teto. Nada some: o quadro final tem o teto, a sobra de 144 g/h e o gargalo.
 */

const X0 = 168;
const X1 = 616;
const sx = (gh: number) => X0 + (gh / 150) * (X1 - X0);
const ROW_Y = [56, 120, 198] as const;
const BAR = 18;
const perHour = (gmin: number) => Math.round(gmin * 60);

const Axis = () => (
    <g>
        <line x1={X0} x2={X1} y1={226} y2={226} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
        {[0, 30, 60, 90, 120, 150].map(v => <SvgText key={v} x={sx(v)} y={248} text={String(v)} size={16} anchor="middle" color={C.muted} weight={500} />)}
        <SvgText x={X0 - 14} y={248} text="g/h" size={16} anchor="end" color={C.muted} weight={700} />
    </g>
);

/** Legenda das barras, no alto do palco: cada cor diz o que é; teto e "no caminho" acendem no passo deles. */
const LEGEND_Y = 20;
const Legend = ({ step }: { step: number }) => (
    <g>
        <rect x={8} y={LEGEND_Y - 13} width={18} height={14} rx={3} fill="transparent" stroke={C.stone} strokeWidth={2.5} />
        <SvgText x={32} y={LEGEND_Y} text="ingerido" size={16} color="#E5E7EB" weight={700} />
        <rect x={120} y={LEGEND_Y - 13} width={18} height={14} rx={3} fill={C.glucose} />
        <SvgText x={144} y={LEGEND_Y} text="oxidado (¹³C)" size={16} color={C.glucoseSoft} weight={700} />
        <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0.3 }} transition={{ duration: DUR.enter }}>
            <rect x={274} y={LEGEND_Y - 15} width={18} height={18} fill={`${C.glucose}55`} />
            <line x1={283} x2={283} y1={LEGEND_Y - 15} y2={LEGEND_Y + 3} stroke={C.glucose} strokeWidth={2} strokeDasharray="4 3" />
            <SvgText x={298} y={LEGEND_Y} text="teto (fonte única)" size={16} color={C.glucoseSoft} weight={700} />
        </motion.g>
        <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0.3 }} transition={{ duration: DUR.enter }}>
            <rect x={460} y={LEGEND_Y - 13} width={18} height={14} rx={3} fill={C.risk} />
            <SvgText x={484} y={LEGEND_Y} text="no caminho" size={16} color="#FDA4AF" weight={700} />
        </motion.g>
    </g>
);

const Ceiling = ({ on }: { on: boolean }) => (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter }}>
        <rect x={sx(60)} y={30} width={sx(66) - sx(60)} height={196} fill={`${C.glucose}55`} />
        <line x1={sx(63)} x2={sx(63)} y1={30} y2={226} stroke={C.glucose} strokeWidth={2} strokeDasharray="6 5" />
        <SvgText x={sx(66) + 12} y={44} text="teto ~1 g/min ≈ 60–66 g/h" size={16} color={C.glucoseSoft} weight={700} />
    </motion.g>
);

const Row = ({ i, step, reduce }: { i: number; step: number; reduce: boolean }) => {
    const r = ROWS[i];
    const y = ROW_Y[i];
    const ox = perHour(r.ox);
    const grow = (delay: number) => ({
        initial: reduce ? false : { scaleX: 0 },
        animate: { scaleX: 1 },
        transition: { duration: DUR.bar, delay, ease: EASE_OUT },
        style: { originX: 0 },
    });
    return (
        <g>
            <SvgText x={8} y={y - 2} text={r.study} size={16} color={C.muted} weight={600} />
            <SvgText x={8} y={y + 20} text={`entra ${r.gh} g/h`} size={17} color="#F3F4F6" weight={700} />
            <motion.rect x={X0} y={y - BAR - 3} width={sx(r.gh) - X0} height={BAR} rx={4} fill="transparent" stroke={C.stone} strokeWidth={2.5} {...grow(stagger(i, 0, 0.1))} />
            <motion.rect x={X0} y={y + 3} width={sx(ox) - X0} height={BAR} rx={4} fill={C.glucose} {...grow(stagger(i, 0.3, 0.12))} />
            <CountSvgText x={sx(ox) + 8} y={y + 18} text={`oxida ${br(r.ox, 2)} g/min ≈ ${ox} g/h`} size={16} color={C.glucoseSoft} weight={700}
                delay={stagger(i, 0.4, 0.12)} />
            {i === 2 && <Leftover on={step >= 2} y={y - BAR - 3} from={ox} to={r.gh} />}
        </g>
    );
};

/** A sobra de 144 g/h: o que entrou e não foi oxidado na hora. */
const Leftover = ({ on, y, from, to }: { on: boolean; y: number; from: number; to: number }) => (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, delay: on ? 0.2 : 0 }}>
        <rect x={sx(from)} y={y} width={sx(to) - sx(from)} height={BAR} rx={4} fill={C.risk} />
        <SvgText x={X1} y={y - 8} text={`~${to - from} g/h no caminho`} size={16} anchor="end" color="#FDA4AF" weight={800} />
    </motion.g>
);

/** Rótulos do gargalo, no lado do sangue (passo 4). */
const Bottleneck = ({ on }: { on: boolean }) => (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0, x: on ? 0 : 10 }} transition={{ duration: DUR.enter, delay: on ? 0.3 : 0, ease: EASE_OUT }}>
        <SvgText x={640} y={22} text="fígado libera ~1 g/min" size={16} anchor="end" color={C.glucoseSoft} weight={800} />
        <SvgText x={640} y={46} text="músculo: não é o limite" size={16} anchor="end" color="#E5E7EB" weight={700} />
    </motion.g>
);

const Stage = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${STAGE_INNER_W} ${STAGE_INNER_H}`} width="100%" height="100%" className="block" role="img"
            aria-label="Ingestão e oxidação exógena de glicose em três ensaios com isótopo, e o enterócito com o SGLT1 saturado">
            <Legend step={step} />
            <Ceiling on={step >= 1} />
            <Axis />
            {ROWS.map((r, i) => <Row key={r.study} i={i} step={step} reduce={reduce} />)}
            <g transform="translate(4 266)">
                <Gut fructose={false} queue={step >= 1} stressSglt1={step >= 3} queueLabel={step >= 2 ? 'sobra na luz' : 'fila: SGLT1 saturado'} />
                <Bottleneck on={step >= 3} />
            </g>
        </svg>
    );
};

/** Número-chave do passo (um por passo, pulso curto). */
const FACT: Readonly<Record<number, { value: string; caption: string; color: string }>> = {
    1: { value: '~1 g/min', caption: 'teto de uma fonte só', color: C.glucose },
    2: { value: '49%', caption: 'do que entra a 144 g/h', color: C.risk },
};

export default function CeilingSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const fact = FACT[step];
    return (
        <PaFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="ceiling-tabs"
            chips={<><DesignChip>3 ECRs cruzados · n = 7–8 cada · ¹³C</DesignChip><CalcChip>g/min × 60 = g/h</CalcChip></>}
            stage={<Stage step={step} />}
            panel={
                <PaSide step={step} color={s.color} headline={s.headline} text={s.text} lessons={LESSONS}
                    source={sourcesUpTo(STEPS.map(t => t.sources), step)}>
                    {fact && (
                        <div key={step} className="flex items-baseline gap-3">
                            <KeyFact color={fact.color} delay={0.3}>
                                <span className="font-display text-[44px] font-bold leading-none tabular-nums" style={{ color: fact.color }}>{fact.value}</span>
                            </KeyFact>
                            <span className="text-[17px] text-gray-200">{fact.caption}</span>
                        </div>
                    )}
                </PaSide>
            } />
    );
}
