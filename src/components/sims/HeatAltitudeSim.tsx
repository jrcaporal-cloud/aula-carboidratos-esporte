import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { FrameB, LedgerB, PanelB } from './ato9/FrameB';
import { HeatAltitudeStage } from './ato9/HeatAltitudeStage';
import { EXO_DOWN, LEDGER, STEPS } from './ato9/heatAltitude.content';

/**
 * Slide 166 · Calor e Altitude, palco + painel. O palco são duas cadeias de faixas numeradas, um estudo por faixa
 * (ato9/HeatAltitudeStage): CALOR (Jentjens, Febbraio) e ALTITUDE (Péronnet, Braun). Cada faixa entra no seu passo
 * e fica; o painel conta o passo e o livro-caixa acumula.
 */

const ACCENT = [C.glucoseSoft, C.glycogenSoft, C.stone, C.glucoseSoft, C.glucoseSoft] as const;

export default function HeatAltitudeSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const calc = step >= 4 ? `−${EXO_DOWN}% e índice: cálculo` : `−${EXO_DOWN}%: cálculo`;
    return (
        <FrameB tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="heat-alt-tabs"
            chips={<><DesignChip>{s.design}</DesignChip>{step >= 1 && <CalcChip>{calc}</CalcChip>}</>}
            stage={<HeatAltitudeStage step={step} />}
            panel={
                <PanelB step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                    source={sourcesUpTo(STEPS.map(x => x.source), step)}
                    ledger={step >= 1 ? <LedgerB title="o que fica" items={LEDGER} step={step} /> : undefined} />
            } />
    );
}
