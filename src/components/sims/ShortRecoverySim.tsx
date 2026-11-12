import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { LedgerRow, Narration, RecTop } from './ato7/RecFrame';
import { ProtocolStrip, ShortChart } from './ato7/ShortChart';
import { SHORT_CALC, SHORT_CHIPS, SHORT_STEPS } from './ato7/shortRecovery.content';

/**
 * Slide 121 · Quatro Horas Entre Duas Sessões, no formato palco + painel.
 * Espelhado em relação ao slide 120 (painel à esquerda, palco à direita).
 * Palco: a faixa do protocolo (Alghannam 2016) e o gráfico do glicogênio: barras do fim das 4 h (269 × 157)
 * e as retas da 2ª corrida até o mesmo piso, desenhadas como cronômetro (48 chega antes de 80).
 * Painel: o texto do passo e o livro-caixa (glicogênio, minutos, piso, Craven, regra prática) que acumula.
 */

const ACCENT = [C.glucose, C.glycogenSoft, C.stone, C.glycogenSoft, C.glucose] as const;

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-1 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">por braço</th>
                <th className="text-right font-normal">0,3 g/kg/h</th>
                <th className="text-right font-normal" style={{ color: C.glycogenSoft }}>1,2 g/kg/h</th>
            </tr>
        </thead>
        <tbody className="text-[18px] font-semibold text-gray-100">
            <LedgerRow at={1} step={step}>
                <td>glicogênio, fim das 4 h</td>
                <td className="text-right tabular-nums">157</td>
                <td className="text-right tabular-nums" style={{ color: C.glycogenSoft }}>269</td>
            </LedgerRow>
            <LedgerRow at={2} step={step}>
                <td>2ª corrida</td>
                <td className="text-right tabular-nums">48 min</td>
                <td className="text-right tabular-nums" style={{ color: C.glycogenSoft }}>80 min</td>
            </LedgerRow>
            <LedgerRow at={2} step={step}>
                <td>glicogênio na exaustão</td>
                <td colSpan={2} className="text-right" style={{ color: C.stone }}>~72–78 nos dois</td>
            </LedgerRow>
            <LedgerRow at={3} step={step}>
                <td>CHO × água (Craven)</td>
                <td colSpan={2} className="text-right tabular-nums">+23,5/h <span className="text-gray-300">(19,0–27,9)</span></td>
            </LedgerRow>
            <LedgerRow at={4} step={step} className="font-display text-[20px] font-bold">
                <td colSpan={3} className="pt-1" style={{ color: C.glucose }}>&lt; 4 h: 1,2 g/kg/h, cedo e a cada ≤ 1 h</td>
            </LedgerRow>
        </tbody>
    </table>
);

export default function ShortRecoverySim() {
    const { step, setStep } = useSlideSteps(SHORT_STEPS.length);
    const s = SHORT_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <RecTop tabs={SHORT_STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="short-tabs"
                chips={<>
                    {SHORT_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
                    {SHORT_CALC[step] && <CalcChip>{SHORT_CALC[step]}</CalcChip>}
                </>} />
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                    <Narration step={step} headline={s.headline} color={ACCENT[step]}>{s.text}</Narration>
                    <div className="mt-auto flex flex-col gap-2">
                        <Ledger step={step} />
                        <Source>{sourcesUpTo(SHORT_STEPS.map(t => t.sources), step)}</Source>
                    </div>
                </Panel>
                <Panel className="flex shrink-0 flex-col justify-between px-3 py-2">
                    <ProtocolStrip step={step} />
                    <ShortChart step={step} />
                </Panel>
            </div>
        </div>
    );
}
