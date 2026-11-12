import { useSlideSteps } from '../../store/useSlideSteps';
import { CalcChip, DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, StepTabs } from './kit/ui';
import { CHART_H, Fuchs25Chart } from './ato7/Fuchs25Chart';
import { RefillPanel } from './ato7/RefillPanel';
import { FUCHS_DESIGN, FUCHS_LEDGER, FUCHS_STEPS } from './ato7/fuchs.content';

/**
 * Slide 125 · Nem 10 g/kg em 12 Horas. Gráfico grande à esquerda: fígado e músculo em % do valor de antes, do fim do
 * exercício até 12 h (Fuchs 2025, ¹³C-MRS + biópsia). Primeiro o tombo, depois o jejum que não volta, o fígado que
 * passa dos 100% em 6 h e o músculo que fica em 69% às 12 h; por fim, a segunda prova do dia. Painel à direita com
 * o texto de pós e o livro-caixa em mmol/L que acumula.
 */
export default function Fuchs2025Sim() {
    const { step, setStep } = useSlideSteps(FUCHS_STEPS.length);
    const s = FUCHS_STEPS[step];
    return (
        <div className="not-prose flex h-[512px] w-full flex-col gap-2.5">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={FUCHS_STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="fuchs25-tabs" />
                <div className="flex flex-wrap justify-end gap-2">
                    <DesignChip>{FUCHS_DESIGN}</DesignChip>
                    {step >= 1 && <IllustrativeChip>jejum: esquema</IllustrativeChip>}
                    {step >= 3 && <CalcChip>cálculo: 31%</CalcChip>}
                </div>
            </div>
            <div className="flex min-h-0 flex-1 gap-3.5">
                <Panel className="shrink-0">
                    <div style={{ height: CHART_H }} className="px-0.5 pt-0.5"><Fuchs25Chart step={step} /></div>
                </Panel>
                <RefillPanel className="flex-1" step={step} headline={s.headline} color={s.color} text={s.text} note={s.note} size={16}
                    rows={FUCHS_LEDGER} source={sourcesUpTo(FUCHS_STEPS.map(x => x.sources), step)} />
            </div>
        </div>
    );
}
