import { useSlideSteps } from '../../store/useSlideSteps';
import { Reveal } from './kit/rhythm';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { DecideLedger, DecideShell } from './ato10/DecideShell';
import { PlaceboStage } from './ato10/PlaceboStage';
import { DESIGN, PLACEBO_LEDGER, PLACEBO_STEPS, PUNCH, SOURCE } from './ato10/placebo.content';

/**
 * Slide 187 · O Placebo que Pedalou Mais (o pico do Ato X). Palco: o fatorial 2 × 3 de Clark 2000 (o que ouviu × o que
 * bebeu) vira barras de potência por crença e, embaixo, a comparação no mesmo eixo: crença +3,8% × carboidrato −0,3%.
 * Painel com o texto do passo e o livro-caixa que acumula; nada some.
 */

const ACCENT = [C.stone, C.stone, C.glucose, C.caveat] as const;

export default function PlaceboSim() {
    const { step, setStep } = useSlideSteps(PLACEBO_STEPS.length);
    const s = PLACEBO_STEPS[step];
    return (
        <DecideShell tabs={PLACEBO_STEPS.map(p => p.tab)} step={step} setStep={setStep} layoutId="placebo-tabs"
            chips={<><DesignChip>{DESIGN}</DesignChip>{step === 3 && <CalcChip>~7 por célula: cálculo</CalcChip>}</>}
            stageWidth={680} stage={<PlaceboStage step={step} />}
            accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<>
                {step >= 2 && <Reveal order={2}><p className="m-0 text-[19px] font-semibold leading-snug" style={{ color: C.glucoseSoft }}>{PUNCH}</p></Reveal>}
                <DecideLedger rows={PLACEBO_LEDGER} step={step} />
            </>}
            sources={SOURCE} />
    );
}
