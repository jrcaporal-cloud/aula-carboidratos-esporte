import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { Model3DHint } from './kit/Model3DHint';
import { sourcesUpTo } from './kit/sources';
import { CalciumTriad } from './ato4/calciumTriad';
import { CalciumChart, CHART_W } from './ato4/calciumChart';
import { Ledger, PanelFoot, StageLayout, StepText } from './ato4/tankBLayout';
import { CA_CHIPS, CA_LEDGER, CALCIUM_STEPS } from './ato4/calcium.content';

/**
 * Slide 66 · O cálcio que falha, em palco + painel. No alto do palco, o acoplamento excitação-contração desenhado
 * (DHPR, RyR1, SERCA) com o Ca²⁺ circulando; embaixo, o curso no tempo do braço (Ørtenblad 2011) e a replicação de
 * Gejl 2014, em barras lado a lado sem linha entre elas (grandezas diferentes); r = 0,30 vira 9 de 100 quadrados.
 * No último passo, o elo glicogênio → RyR1 ganha o "?": associação, causa não provada.
 */

const ACCENT = [C.insulinSoft, C.glycogenSoft, C.ok, C.insulinSoft, C.stone] as const;

export default function CalciumReleaseSim() {
    const { step, setStep } = useSlideSteps(CALCIUM_STEPS.length);
    const s = CALCIUM_STEPS[step];
    return (
        <StageLayout tabs={CALCIUM_STEPS.map(c => c.tab)} step={step} onSelect={setStep} layoutId="calcium-tabs" stageWidth={CHART_W}
            chips={<>
                <DesignChip>{CA_CHIPS[step]}</DesignChip>
                {step === 3 && <CalcChip>r² ≈ 0,09: cálculo</CalcChip>}
                <Model3DHint label="tríade 3D" />
            </>}
            stage={<><CalciumTriad step={step} /><CalciumChart step={step} /></>}
            panel={<>
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <PanelFoot source={sourcesUpTo(CALCIUM_STEPS.map(c => c.sources), step)}>
                    {step >= 1 && (
                        <div className="flex flex-col gap-1">
                            <Ledger step={step} head={['', 'glicogênio', 'Ca²⁺']} cols={['48%', '30%', '22%']}
                                rows={CA_LEDGER.map(r => ({ at: r.at, cells: r.cells, color: r.at === 3 ? C.caveat : undefined }))} />
                            <span className="text-[15px] text-gray-300">glicogênio em mmol/kg ps · % do valor antes</span>
                        </div>
                    )}
                </PanelFoot>
            </>}
        />
    );
}
