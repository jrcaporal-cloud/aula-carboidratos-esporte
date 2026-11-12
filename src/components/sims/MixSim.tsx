import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { Model3DHint } from './kit/Model3DHint';
import { C } from './kit/palette';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { SvgText } from './kit/ui';
import { Gut } from './ato6/paGut';
import { MixChart } from './ato6/paMixChart';
import { PaFrame, PaSide, STAGE_INNER_H, STAGE_INNER_W } from './ato6/paFrame';
import { LESSONS, STEPS } from './ato6/mix.content';

/**
 * Slide 104 · Quebrando o Teto. A resposta ao slide 103 no mesmo enterócito: em cima, a pista do SGLT1 lotada e a do
 * GLUT5 que se abre (o fluxo nas duas pistas é o laço do palco); embaixo, a curva de oxidação se transforma da glicose
 * na mistura e ganha, passo a passo, a dose moderada (sem vantagem) e o 2:1 do desempenho. A tecla 3 abre o enterócito 3D.
 */

const Stage = ({ step }: { step: number }) => (
    <svg viewBox={`0 0 ${STAGE_INNER_W} ${STAGE_INNER_H}`} width="100%" height="100%" className="block" role="img"
        aria-label="Enterócito com SGLT1 e GLUT5 e a oxidação exógena da glicose e da mistura glicose + frutose">
        <g transform="translate(4 6)">
            <Gut fructose={step >= 1} queue={step !== 2} queueLabel="fila: SGLT1 saturado" />
            <motion.g initial={false} animate={{ opacity: step === 2 ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <SvgText x={8} y={18} text="48 g/h: o SGLT1 dá conta" size={16} color="#F3F4F6" weight={700} />
            </motion.g>
        </g>
        <MixChart step={step} />
    </svg>
);

/** Número-chave do passo. */
const FACT: readonly { value: string; caption: string; color: string }[] = [
    { value: '1,06', caption: 'g/min, só glicose a 72 g/h', color: C.glucose },
    { value: '1,75', caption: 'g/min, glicose + frutose 1:1 a 144 g/h', color: C.fructose },
    { value: '0,57 × 0,60', caption: 'g/min a 48 g/h: empate', color: C.stone },
    { value: '8%', caption: 'mais rápido no contrarrelógio que só glicose', color: C.ok },
];

export default function MixSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const fact = FACT[step];
    return (
        <PaFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="mix-tabs"
            chips={<><DesignChip>{s.design}</DesignChip><IllustrativeChip>curva composta</IllustrativeChip><Model3DHint label="enterócito" /></>}
            stage={<Stage step={step} />}
            panel={
                <PaSide step={step} color={s.color} headline={s.headline} text={s.text} lessons={LESSONS}
                    source={sourcesUpTo(STEPS.map(t => t.sources), step)}>
                    <div key={step} className="flex items-baseline gap-3">
                        <KeyFact color={fact.color} delay={0.3}>
                            <span className="font-display text-[40px] font-bold leading-none tabular-nums" style={{ color: fact.color }}>{fact.value}</span>
                        </KeyFact>
                        <span className="text-[17px] leading-snug text-gray-200">{fact.caption}</span>
                    </div>
                </PaSide>
            } />
    );
}
