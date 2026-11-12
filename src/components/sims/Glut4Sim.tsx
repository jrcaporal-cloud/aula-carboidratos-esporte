import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { BigStat } from './kit/Stamp';
import { AnimalChip, DesignChip } from './kit/chips';
import { Model3DHint } from './kit/Model3DHint';
import { BarRow, SourceLine, StepHeader } from './ato3/shared';
import { Glut4Door } from './ato3/Glut4Door';
import { Glut4Window } from './ato3/Glut4Window';
import { BAR_MAX, BLOCK_ROWS, GLUT4_STEPS, SUM_ROWS } from './ato3/glut4.content';

/**
 * Slide 40 · Duas Chaves para a Mesma Porta.
 * À esquerda, a porta (GLUT4) com as fechaduras da insulina e da contração; à direita, o número que cada passo prova:
 * 50× → wortmanina trava a insulina → não trava a contração → as duas somam → a janela de ~48 h.
 */

const UNIT = 'µmol·mL⁻¹·h⁻¹';
const COLOR_BY_KEY: Record<string, string> = { ins: C.insulin, insW: C.insulin, con: C.stone, conW: C.stone, c: C.stone, i: C.insulin, ci: C.glucose };

const RightPanel = ({ step }: { step: number }) => {
    if (step === 0) {
        return <BigStat value="até 50×" caption="de captação de glicose no exercício" color={C.glucose} size={96} />;
    }
    if (step === 4) return <Glut4Window />;
    const rows = step === 3 ? SUM_ROWS : BLOCK_ROWS.slice(0, step === 1 ? 2 : 4);
    return (
        <div className="flex w-full flex-col gap-4">
            <span className="text-[17px] text-gray-300">{UNIT}</span>
            {rows.map((r, i) => (
                <BarRow key={r.key} label={r.label} value={r.value} max={BAR_MAX} text={r.text}
                    color={COLOR_BY_KEY[r.key]} dim={step === 2 && i < 2} delay={step === 2 && i < 2 ? 0 : stagger(step === 2 ? i - 2 : i, 0.15)} />
            ))}
        </div>
    );
};

const CHIPS = [
    <><DesignChip key="r">revisão</DesignChip><Model3DHint key="h" label="a fibra" /></>,
    <AnimalChip key="a">sóleo de rato isolado</AnimalChip>,
    <AnimalChip key="a">sóleo de rato isolado</AnimalChip>,
    <AnimalChip key="a">sóleo de rato isolado</AnimalChip>,
    <><DesignChip key="m">clamp · n = 7</DesignChip><DesignChip key="r">uma perna · n = 6</DesignChip></>,
];

export default function Glut4Sim() {
    const { step } = useSlideSteps(GLUT4_STEPS.length);
    const reduce = useReducedMotion();
    const s = GLUT4_STEPS[step];
    const panelKey = step === 0 ? 'stat' : step === 4 ? 'window' : step === 3 ? 'sum' : 'block';
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-4 overflow-hidden">
            <StepHeader beat={step} chips={CHIPS[step]}>{s.phrase}</StepHeader>
            <div className="flex min-h-0 flex-1 items-center gap-12">
                <Glut4Door step={step} insulin={s.insulin} contraction={s.contraction} pass={s.pass} detail={step === 1 || step === 2} />
                <motion.div key={panelKey} className="flex min-w-0 flex-1 items-center"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    <RightPanel step={step} />
                </motion.div>
            </div>
            <SourceLine>{s.source}</SourceLine>
        </div>
    );
}
