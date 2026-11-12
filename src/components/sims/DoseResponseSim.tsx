import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { CalcChip, DesignChip, IllustrativeChip, IndustryChip } from './kit/chips';
import { C } from './kit/palette';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { SvgText } from './kit/ui';
import { PaFrame, PaSide, STAGE_INNER_H, STAGE_INNER_W } from './ato6/paFrame';
import { CENTERS, DOSES, LESSONS, POINTS, STEPS } from './ato6/dose.content';

/**
 * Slide 102 · A Curva de Smith. O delineamento vira a curva: em cima, a matriz de blocos incompletos (4 centros ×
 * placebo + 12 doses; cada ciclista fez 4 ensaios); no clique seguinte, cada coluna "desce" para o eixo e o modelo
 * misto desenha a curva até 48 g/h, depois até o ótimo (~78 g/h); no fim, a zona de retorno decrescente e as duas
 * inclinações (cálculo). Tudo fica: o quadro final mostra o desenho, a curva, o ótimo e o preço.
 */

const L = 98;
const R = 626;
const sx = (dose: number) => L + (dose / 120) * (R - L);
const TOP = 206;
const BASE = 398;
const sy = (gain: number) => BASE - (gain / 5) * (BASE - TOP);
const ROWS_Y = [52, 82, 112, 142] as const;
const CELL = 34;
const CELL_H = 24;
const COLUMNS = [0, ...DOSES];

const pathOf = (pts: readonly { dose: number; gain: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.dose).toFixed(1)} ${sy(p.gain).toFixed(1)}`).join(' ');
const LOW = POINTS.slice(0, 5);
const HIGH = POINTS.slice(4);

/** Matriz do delineamento: placebo (neutro) em todos os centros, 3 doses (âmbar) por centro. */
const Matrix = ({ step }: { step: number }) => (
    <motion.g initial={false} animate={{ opacity: step >= 1 ? 0.75 : 1 }} transition={{ duration: DUR.enter }}>
        <SvgText x={8} y={22} text="cada linha: um centro · cada ciclista: placebo + 3 doses" size={16} color="#E5E7EB" weight={700} />
        {CENTERS.map((doses, r) => (
            <g key={r}>
                <SvgText x={8} y={ROWS_Y[r] + 7} text={`centro ${r + 1}`} size={16} color={C.muted} weight={600} />
                {COLUMNS.map((d, c) => {
                    const on = d === 0 || doses.includes(d);
                    return (
                        <motion.rect key={d} x={sx(d) - CELL / 2} y={ROWS_Y[r] - CELL_H / 2} width={CELL} height={CELL_H} rx={5}
                            fill={on ? (d === 0 ? C.co2 : C.glucose) : 'transparent'} stroke={on ? 'none' : 'rgba(255,255,255,0.22)'} strokeWidth={2}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.text, delay: stagger(r * 13 + c, 0.05, 0.01) }} />
                    );
                })}
            </g>
        ))}
        <SvgText x={sx(0)} y={ROWS_Y[3] + 36} text="placebo" size={16} anchor="middle" color={C.muted} weight={600} />
        <SvgText x={sx(65)} y={ROWS_Y[3] + 36} text="10 a 120 g/h, de 10 em 10" size={16} anchor="middle" color={C.glucoseSoft} weight={700} />
    </motion.g>
);

/** Passo 2: cada coluna desce até o eixo (o modelo junta tudo numa curva). Um disparo só. */
const Drop = () => (
    <g>
        {COLUMNS.map((d, i) => (
            <motion.circle key={d} cx={sx(d)} cy={0} r={7} fill={d === 0 ? C.co2 : C.glucose}
                initial={{ y: ROWS_Y[3] + 14, opacity: 0 }} animate={{ y: [ROWS_Y[3] + 14, BASE], opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, delay: stagger(i, 0, 0.03), ease: EASE_IN_OUT }} />
        ))}
    </g>
);

const Axes = () => (
    <g>
        <line x1={L} x2={R} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5].map(g => <SvgText key={g} x={L - 12} y={sy(g) + 6} text={`${g}%`} size={16} anchor="end" color={C.muted} weight={500} />)}
        {[0, 20, 40, 60, 80, 100, 120].map(d => <SvgText key={d} x={sx(d)} y={BASE + 24} text={String(d)} size={16} anchor="middle" color={C.muted} weight={500} />)}
        <SvgText x={L + 14} y={TOP + 8} text="ganho no contrarrelógio" size={16} color="#CBD5E1" weight={600} />
        <SvgText x={R} y={BASE + 44} text="g/h" size={16} anchor="end" color={C.muted} weight={600} />
    </g>
);

const LABELS: Readonly<Record<number, string>> = { 9: '+1,0%', 19: '+2,0%', 31: '+3,0%', 48: '+4,0% · 48 g/h' };

const Curve = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const draw = (show: boolean, delay: number) => ({
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: show ? 1 : 0, opacity: show ? 1 : 0 },
        transition: { duration: reduce ? 0 : DUR.draw, delay: show ? delay : 0, ease: EASE_IN_OUT },
    });
    return (
        <g>
            {/* zona de retorno decrescente */}
            <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                <rect x={sx(78)} y={TOP - 2} width={R - sx(78)} height={BASE - TOP + 2} rx={8} fill={`${C.co2}2E`} />
                <SvgText x={(sx(78) + R) / 2} y={sy(3)} text="retorno decrescente" size={18} anchor="middle" color="#F3F4F6" weight={800} />
                <SvgText x={(sx(78) + R) / 2} y={sy(3) + 24} text="sem pontos estimados" size={16} anchor="middle" color={C.muted} weight={600} />
                <SvgText x={sx(26) + 12} y={sy(1.3)} text="~0,8% / 10 g/h" size={16} color={C.glucoseSoft} weight={800} />
                <SvgText x={sx(64)} y={sy(4.35) + 30} text="~0,2% / 10 g/h" size={16} anchor="middle" color={C.glucoseSoft} weight={800} />
            </motion.g>
            <motion.path d={pathOf(LOW)} fill="none" stroke={C.glucose} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" {...draw(step >= 1, 0.55)} />
            <motion.path d={pathOf(HIGH)} fill="none" stroke={C.glucose} strokeWidth={5} strokeLinecap="round" {...draw(step >= 2, 0.1)} />
            {POINTS.slice(1).map(p => {
                const shown = p.dose <= (step >= 2 ? 78 : step >= 1 ? 48 : -1);
                const delay = p.dose === 78 ? 0.6 : 0.55 + (p.dose / 48) * 0.8;
                return (
                    <motion.g key={p.dose} initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ delay: shown ? delay : 0, duration: DUR.text }}>
                        <circle cx={sx(p.dose)} cy={sy(p.gain)} r={8} fill="#04080F" stroke={C.glucose} strokeWidth={4} />
                        {LABELS[p.dose] && <SvgText x={sx(p.dose) - 10} y={sy(p.gain) - 10} text={LABELS[p.dose]} size={16} anchor="end" color="#F3F4F6" weight={700} />}
                    </motion.g>
                );
            })}
            {/* o ótimo */}
            <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 2 ? 0.8 : 0 }}>
                <line x1={sx(78)} x2={sx(78)} y1={sy(4.7) + 10} y2={BASE} stroke={C.glucose} strokeWidth={2.5} strokeDasharray="6 6" />
                <SvgText x={sx(78) + 16} y={sy(4.7) + 4} text="+4,7%" size={22} color="#FFFFFF" weight={800} />
                <SvgText x={sx(78) + 16} y={sy(4.7) + 28} text="ótimo ~78 g/h" size={18} color={C.glucoseSoft} weight={800} />
            </motion.g>
        </g>
    );
};

const Stage = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="relative h-full w-full">
            <svg viewBox={`0 0 ${STAGE_INNER_W} ${STAGE_INNER_H}`} width="100%" height="100%" className="block" role="img"
                aria-label="Delineamento de blocos incompletos de Smith 2013 e a curva de ganho por dose de carboidrato">
                <Matrix step={step} />
                <Axes />
                {step === 1 && !reduce && <Drop />}
                <Curve step={step} reduce={reduce} />
            </svg>
            <div className="absolute right-3 top-2"><IllustrativeChip>matriz: esquema</IllustrativeChip></div>
        </div>
    );
};

export default function DoseResponseSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <PaFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="dose-tabs"
            chips={<>
                <DesignChip>duplo-cego · n = 51 · 4 centros</DesignChip>
                {step >= 1 && <CalcChip />}
                {step >= 3 && <IndustryChip />}
            </>}
            stage={<Stage step={step} />}
            panel={
                <PaSide step={step} color={s.color} headline={s.headline} text={s.text} lessons={LESSONS}
                    source={sourcesUpTo(STEPS.map(t => t.sources), step)}>
                    <motion.div key={step} className="flex items-baseline gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: DUR.enter, delay: 0.2, ease: EASE_OUT }}>
                        <KeyFact color={s.color} delay={0.3}>
                            <span className="font-display text-[44px] font-bold leading-none tabular-nums" style={{ color: s.color }}>{s.fact.value}</span>
                        </KeyFact>
                        <span className="text-[17px] leading-snug text-gray-200">{s.fact.caption}</span>
                    </motion.div>
                </PaSide>
            } />
    );
}
