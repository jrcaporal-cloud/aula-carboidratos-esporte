import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { A9Frame, Ledger, StepText } from './ato9/A9aShell';
import { SoccerStage } from './ato9/SoccerStage';
import { CALC, CHIPS, LEDGER, STEPS } from './ato9/soccerFibers.content';

/**
 * Slide 160 · 47% das Fibras, no formato palco + painel. À esquerda, o corte do vasto lateral esvazia fibra a fibra
 * enquanto o relógio vai a 90'; depois entram a média que engana, a fibra ampliada (glicogênio por endereço) e o tiro.
 * À direita, o texto do passo e o livro-caixa, que acumula: o quadro final é a soma dos cinco passos.
 */

const ACCENT = [C.glycogenSoft, C.glycogenSoft, C.glycogenSoft, C.glycogenSoft, C.risk] as const;

export default function SoccerFibersSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <A9Frame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="soccer-tabs" chips={<>
            {CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
            {CALC[step] && <CalcChip>{CALC[step]}</CalcChip>}
        </>}>
            <Panel className="shrink-0 px-[10px] py-[8px]"><SoccerStage step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <div className="mt-auto flex flex-col gap-3">
                    <Ledger rows={LEDGER} step={step} />
                    <Source>{sourcesUpTo(STEPS.map(t => t.sources), step)}</Source>
                </div>
            </Panel>
        </A9Frame>
    );
}
