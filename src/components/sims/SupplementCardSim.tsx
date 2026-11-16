import { useSlideSteps } from '../../store/useSlideSteps';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { CardStage } from './ato10/CardStage';
import { DecideLedger, DecideShell } from './ato10/DecideShell';
import { CARD_DESIGNS, CARD_LEDGER, CARD_STEPS } from './ato10/supplementCard.content';

/**
 * Slide 192 · O Cartão do Carboidrato. Complementa «O Relógio da Prova» (quanto por hora) com o "como":
 * palco com as unidades de cada formato, uma hora de prova montada para 30, 60 e 90 g/h e a mistura em gramas;
 * painel com o estudo de cada regra e o livro-caixa que acumula. Os exemplos em gramas são cálculo.
 */
export default function SupplementCardSim() {
    const { step, setStep } = useSlideSteps(CARD_STEPS.length);
    const s = CARD_STEPS[step];
    return (
        <DecideShell tabs={CARD_STEPS.map(c => c.tab)} step={step} setStep={setStep} layoutId="card-tabs"
            chips={<>{step > 0 && <CalcChip>exemplos em gramas: cálculo</CalcChip>}<DesignChip>{CARD_DESIGNS[step]}</DesignChip></>}
            stageWidth={680} stage={<CardStage step={step} />}
            accent={s.color} headline={s.headline} text={s.text}
            ledger={<DecideLedger rows={CARD_LEDGER} step={step} />}
            sources={sourcesUpTo(CARD_STEPS.map(c => c.sources), step)} />
    );
}
