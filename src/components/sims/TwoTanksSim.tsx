import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { CHAIN_W, TanksChain } from './ato4/tanksChain';
import { Ledger, PanelFoot, StageLayout, StepText } from './ato4/tankBLayout';
import { TANK_LEDGER, TANK_STEPS } from './ato4/twoTanks.content';

/**
 * Slide 67 · O fígado, o segundo limite, como cadeia de causa em 4 faixas numeradas (ato4/tanksChain): o carboidrato
 * da prova cai no sangue → o fígado fica cheio (Gonzalez 2015) → a glicemia se mantém (Coyle 1986) → o músculo poupa
 * quase nada (Rothschild 2026). Um estudo e uma unidade por faixa. O painel conta o elo e acumula a cadeia.
 */

const ACCENT = [C.glucoseSoft, C.glycogenSoft, C.glucoseSoft, C.glycogenSoft] as const;

export default function TwoTanksSim() {
    const { step, setStep } = useSlideSteps(TANK_STEPS.length);
    const s = TANK_STEPS[step];
    return (
        <StageLayout tabs={TANK_STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="tanks-tabs" stageWidth={CHAIN_W}
            chips={<DesignChip>{s.design}</DesignChip>}
            stage={<TanksChain step={step} />}
            panel={<>
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <PanelFoot source={sourcesUpTo(TANK_STEPS.map(t => t.sources), step)}>
                    <Ledger step={step} head={['a cadeia', '']} cols={['58%', '42%']}
                        rows={TANK_LEDGER.map(r => ({ at: r.at, cells: [r.label, r.value], strong: r.at === 3 }))} />
                </PanelFoot>
            </>}
        />
    );
}
