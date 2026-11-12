import { useSlideSteps } from '../../store/useSlideSteps';
import { CalcChip, DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { AbsorbFrame, StepText } from './ato2/AbsorbFrame';
import { GlycemicChart } from './ato2/GlycemicChart';
import { GlycemicBottom } from './ato2/GlycemicPanel';
import { GI_STEPS } from './ato2/glycemic.content';

/**
 * Slide 29 · Índice Glicêmico: o Que Ele Mede. Gráfico grande + painel: a curva de 2 h se transforma
 * (glicose → cereal → leguminosa) e deixa as anteriores tracejadas; a régua de Jenkins entra embaixo e ganha
 * as faixas de corte. O painel traz o método, o dado-chave, a carga glicêmica (porção arrastável) e o limite.
 */
const Chips = ({ step }: { step: number }) => (
    <>
        {step <= 2 && <DesignChip>62 alimentos · grupos de 5–10</DesignChip>}
        {step === 3 && <DesignChip>revisão sistemática · tabelas</DesignChip>}
        {step >= 4 && <CalcChip>carga: cálculo pela definição</CalcChip>}
        <IllustrativeChip>curvas ilustrativas</IllustrativeChip>
    </>
);

export default function GlycemicIndexSim() {
    const { step, setStep } = useSlideSteps(GI_STEPS.length);
    const s = GI_STEPS[step];
    return (
        <AbsorbFrame tabs={GI_STEPS.map(g => g.tab)} step={step} setStep={setStep} layoutId="gi-tabs" chips={<Chips step={step} />}>
            <Panel className="shrink-0 px-1 py-1"><GlycemicChart step={step} food={s.food} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-3">
                <StepText step={step} headline={s.headline} color={s.color} text={s.text} />
                <div className="mt-auto flex flex-col gap-2">
                    <GlycemicBottom step={step} />
                    <Source>{sourcesUpTo(GI_STEPS.map(g => g.sources), step)}</Source>
                </div>
            </Panel>
        </AbsorbFrame>
    );
}
