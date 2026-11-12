import { useSlideSteps } from '../../store/useSlideSteps';
import { castOf } from './kit/cast';
import { CalcChip, FictionsChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Source, StepTabs } from './kit/ui';
import { PlanBoard } from './ato10/PlanBoard';
import { SIM_H } from './ato10/units';
import { BASE_SOURCE, PLANS } from './ato10/plans.content';

/**
 * Slide 190 · Cinco Atletas, Cinco Planos. Fecho dos cinco personagens FICTÍCIOS: um quadro de cinco colunas que se
 * preenche uma por passo (dia em g/kg → gramas pelo peso, antes, durante, depois e o que NÃO fazer) e fica.
 * O último passo é o quadro inteiro; o rodapé acumula os estudos de cada coluna.
 */
const TABS = ['Dilemas', ...PLANS.map(p => castOf(p.id).name)] as const;

export default function CasePlansSim() {
    const { step, setStep } = useSlideSteps(TABS.length);
    const plan = step > 0 ? PLANS[step - 1] : null;
    const sources = sourcesUpTo([BASE_SOURCE, ...PLANS.map(p => p.sources)], step);
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ height: SIM_H }}>
            <div className="flex min-h-[44px] items-center justify-between gap-4">
                <StepTabs labels={TABS} step={step} onSelect={setStep} layoutId="plans-tabs" />
                <div className="flex flex-wrap justify-end gap-2">
                    <FictionsChip />
                    <CalcChip>{plan ? `gramas: g/kg × ${castOf(plan.id).kg} kg` : 'gramas: g/kg × peso'}</CalcChip>
                </div>
            </div>
            <div className="min-h-0 flex-1"><PlanBoard step={step} /></div>
            <Source>{sources}</Source>
        </div>
    );
}
