import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { Model3DHint } from './kit/Model3DHint';
import { sourcesUpTo } from './kit/sources';
import { CalciumFlow } from './ato4/calciumFlow';
import { Ledger, PanelFoot, StageLayout, StepText } from './ato4/tankBLayout';
import { CA_CHIPS, CA_LEDGER, CALCIUM_STEPS } from './ato4/calcium.content';

/**
 * Slide 66 · O cálcio que falha, em palco + painel. Palco: a cadeia em 5 faixas numeradas (ato4/calciumFlow), um
 * estudo e uma escala por elo: o gatilho → 1 h de esqui (Ørtenblad 2011, perna como controle) → 4 h depois, CHO × água →
 * outro grupo repete (Gejl 2014) → junto não é causa (r = 0,30, r² ≈ 0,09 e o "?" no elo glicogênio → RyR1).
 * Painel: texto do passo + livro-caixa que acumula um elo por linha.
 */

const STAGE_W = 680;
const ACCENT = [C.insulinSoft, C.glycogenSoft, C.ok, C.insulinSoft, C.stone] as const;

export default function CalciumReleaseSim() {
    const { step, setStep } = useSlideSteps(CALCIUM_STEPS.length);
    const s = CALCIUM_STEPS[step];
    return (
        <StageLayout tabs={CALCIUM_STEPS.map(c => c.tab)} step={step} onSelect={setStep} layoutId="calcium-tabs" stageWidth={STAGE_W}
            chips={<>
                <DesignChip>{CA_CHIPS[step]}</DesignChip>
                {step === 4 && <CalcChip>r²: cálculo</CalcChip>}
                <Model3DHint label="tríade 3D" />
            </>}
            stage={<CalciumFlow step={step} />}
            panel={<>
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <PanelFoot source={sourcesUpTo(CALCIUM_STEPS.map(c => c.sources), step)}>
                    {step >= 1 && (
                        <Ledger step={step} head={['', 'glicogênio → Ca²⁺ (% do antes)']} cols={['46%', '54%']}
                            rows={CA_LEDGER.map(r => ({ at: r.at, cells: r.cells, color: r.caveat ? C.caveat : undefined }))} />
                    )}
                </PanelFoot>
            </>}
        />
    );
}
