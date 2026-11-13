import { useSlideSteps } from '../../store/useSlideSteps';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { PaFrame, PaSide } from './ato6/paFrame';
import { ForestChain } from './ato6/ForestChain';
import { DESIGN, LESSONS, STEPS } from './ato6/forest.content';

/**
 * Slide 101 · 82% dos Ensaios. Palco: a cadeia em 3 faixas numeradas (ato6/ForestChain): 82% dos ensaios ajudam
 * (Stellingwerff & Cox, revisão sistemática) → prova mais longa, ganho maior (mesma revisão, gráfico duração × ganho) →
 * a formulação decide o tamanho (Vandenbogaerde & Hopkins, meta-análise, OUTRA base). Painel: texto do passo, livro-caixa
 * que acumula e a fonte que acumula.
 */

export default function DuringForestSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <PaFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="forest-tabs"
            chips={step >= 2
                ? <><DesignChip>faixas 1–2 · revisão sistemática</DesignChip><DesignChip>faixa 3 · meta-análise · 88 estudos</DesignChip></>
                : <DesignChip>{DESIGN[0]}</DesignChip>}
            stage={<ForestChain step={step} />}
            panel={<PaSide step={step} color={s.color} headline={s.headline} text={s.text} lessons={LESSONS}
                source={sourcesUpTo(STEPS.map(t => t.sources), step)} />} />
    );
}
