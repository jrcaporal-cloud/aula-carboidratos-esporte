import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { DesignChip } from './kit/chips';
import { Chip } from './kit/ui';
import { SourceLine, StepHeader } from './ato3/shared';
import { FatBrakeDiagram } from './ato3/FatBrakeDiagram';
import { FatOxPanel, PdhPanel, PhosphorylasePanel } from './ato3/FatBrakePanels';
import { FAT_STEPS } from './ato3/fatbrake.content';

/**
 * Slide 45 · Por que a Gordura Trava no Alto. Cena de mecanismo: a porta da mitocôndria (CPT-I) depende de carnitina livre;
 * no alto, a acetil-CoA da PDH sequestra a carnitina e a fila de gordura para. À direita, o número de cada passo.
 */

const CHIPS = [
    <DesignChip key="d">isótopos + biópsias · n = 8</DesignChip>,
    <><DesignChip key="d">isótopos + biópsias · n = 8</DesignChip><Chip key="c">CPT-I não medida: mecanismo inferido</Chip></>,
    <DesignChip key="d">biópsias · n = 7 não treinados</DesignChip>,
    <DesignChip key="d">biópsias · n = 7 não treinados</DesignChip>,
];

export default function FatBrakeSim() {
    const { step } = useSlideSteps(FAT_STEPS.length);
    const reduce = useReducedMotion();
    const s = FAT_STEPS[step];
    const panelKey = step <= 1 ? 'fat' : step;
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-4 overflow-hidden">
            <StepHeader beat={step} chips={CHIPS[step]}>{s.phrase}</StepHeader>
            <div className="flex min-h-0 flex-1 items-center gap-12">
                <FatBrakeDiagram high={s.high} />
                <motion.div key={panelKey} className="min-w-0 flex-1"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    {step <= 1 ? <FatOxPanel high={s.high} /> : step === 2 ? <PdhPanel /> : <PhosphorylasePanel />}
                </motion.div>
            </div>
            <SourceLine>{s.source}</SourceLine>
        </div>
    );
}
