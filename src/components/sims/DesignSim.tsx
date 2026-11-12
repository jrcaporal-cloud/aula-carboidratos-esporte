import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { DecideLedger, DecideShell } from './ato10/DecideShell';
import { DesignQuadrants } from './ato10/DesignQuadrants';
import { DESIGN_LEDGER, DESIGN_STEPS } from './ato10/design.content';

/**
 * Slide 186 · O Desenho Decide o Efeito. Palco em quatro quadros que se acumulam: contrarrelógio (CV 3,35%) e tempo até
 * a exaustão (CV 26,6%, a mesma curva alarga), Colombani 2013 (atleta alimentado) e Vandenbogaerde 2011 (jejum, viés,
 * limiares). Painel com o texto do passo e o livro-caixa das perguntas de leitura, que acumula.
 */

const ACCENT = [C.ok, C.stone, C.glucoseSoft, C.caveat] as const;

export default function DesignSim() {
    const { step, setStep } = useSlideSteps(DESIGN_STEPS.length);
    const s = DESIGN_STEPS[step];
    return (
        <DecideShell tabs={DESIGN_STEPS.map(d => d.tab)} step={step} setStep={setStep} layoutId="design-tabs"
            chips={<><IllustrativeChip>curvas ilustrativas</IllustrativeChip><DesignChip>{s.design}</DesignChip></>}
            stageWidth={680} stage={<DesignQuadrants step={step} />}
            accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<DecideLedger rows={DESIGN_LEDGER} step={step} />}
            sources={sourcesUpTo(DESIGN_STEPS.map(d => d.sources), step)} />
    );
}
