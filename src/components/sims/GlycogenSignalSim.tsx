import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { SIGNAL_W, SignalStage } from './ato4/signalStage';
import { Ledger, PanelFoot, StageLayout, StepText, type LedgerRow } from './ato4/tankBLayout';
import { SIGNAL_CHIPS, SIGNAL_STEPS } from './ato4/signal.content';

/**
 * Slide 69 · O glicogênio também fala, em palco + painel. No palco, o dimmer do glicogênio e a cascata de sinal
 * (Bartlett 2013), depois o train low original de Hansen 2005 e o funil de Impey 2018. No painel, o texto do passo e o
 * livro-caixa de Bartlett (alto × baixo), que acumula. O fim deixa a pergunta para o Ato VIII.
 */

const ACCENT = [C.co2, C.insulinSoft, C.stone, C.insulinSoft, C.ok] as const;

const ROWS: readonly LedgerRow[] = [
    { at: 0, cells: ['glicogênio, mmol/kg ps', '467', '103'], color: C.glycogenSoft },
    { at: 0, cells: ['p-ACC (leitura da AMPK)', '1,4×', '2,9×'] },
    { at: 0, cells: ['p-p53 Ser15', '0,9×', '2,6×'] },
    { at: 2, cells: ['PGC-1α mRNA', '~3×', '~3×'], color: C.stone },
];

/** As colunas "baixo" só se enchem a partir do passo do tanque baixo. */
const rowsAt = (step: number): LedgerRow[] =>
    ROWS.map(r => (step >= 1 || r.at > 0 ? r : { ...r, cells: [r.cells[0], r.cells[1], r === ROWS[0] ? r.cells[2] : ''] }));

export default function GlycogenSignalSim() {
    const { step, setStep } = useSlideSteps(SIGNAL_STEPS.length);
    const s = SIGNAL_STEPS[step];
    return (
        <StageLayout tabs={SIGNAL_STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="signal-tabs" stageWidth={SIGNAL_W}
            chips={<DesignChip>{SIGNAL_CHIPS[step]}</DesignChip>}
            stage={<SignalStage step={step} onPick={isLow => setStep(isLow ? 1 : 0)} />}
            panel={<>
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <PanelFoot source={sourcesUpTo(SIGNAL_STEPS.map(x => x.sources), step)}>
                    <Ledger step={step} head={['Bartlett 2013', 'alto', 'baixo']} cols={['56%', '22%', '22%']} rows={rowsAt(step)} />
                </PanelFoot>
            </>}
        />
    );
}
