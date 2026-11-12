import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { A9Frame, Ledger, StepText } from './ato9/A9aShell';
import { MpsStage } from './ato9/MpsStage';
import { CALC, CHIPS, LEDGER, STEPS } from './ato9/mps.content';

/**
 * Slide 163 · Insulina Sobe, Síntese Não. Aqui o painel vai à ESQUERDA (o slide vizinho tem o painel à direita)
 * e o palco à direita: o gráfico espelhado de Koopman 2007 (insulina para cima, síntese para baixo, mesmo braço),
 * os dois números que desacoplam e as duas réplicas. O livro-caixa acumula.
 */

const ACCENT = [C.proteinSoft, C.insulinSoft, C.proteinSoft, C.stone] as const;

export default function MpsSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <A9Frame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="mps-tabs" chips={<>
            {CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
            {CALC[step] && <CalcChip>{CALC[step]}</CalcChip>}
        </>}>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} size={17} />
                <div className="mt-auto flex flex-col gap-3">
                    <Ledger rows={LEDGER} step={step} />
                    <Source>{sourcesUpTo(STEPS.map(t => t.sources), step)}</Source>
                </div>
            </Panel>
            <Panel className="shrink-0 px-[10px] py-[8px]"><MpsStage step={step} /></Panel>
        </A9Frame>
    );
}
