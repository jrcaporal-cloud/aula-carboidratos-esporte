import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { LedgerRow, Narration, RecTop } from './ato7/RecFrame';
import { WindowChart } from './ato7/WindowChart';
import { WindowFiber } from './ato7/WindowFiber';
import { WINDOW_CHIPS, WINDOW_STEPS } from './ato7/window.content';

/**
 * Slide 120 · A Janela que Fecha Devagar, no formato palco + painel.
 * Palco: em cima, a fibra logo após o treino (GLUT4 ainda na membrana, glicogênio sintase ativada pelo
 * glicogênio baixo, glicose percorrendo a via em loop); embaixo, as taxas do Ivy 1988 e, depois do corte no
 * eixo, o Parkin 1997 às 8 e 24 h. Painel: o texto do passo e o livro-caixa que acumula.
 */

const ACCENT = [C.glycogenSoft, C.glycogenSoft, C.stone, C.stone, C.glucose] as const;

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-1 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">mmol/kg ww/h</th>
                <th className="text-right font-normal" style={{ color: C.glycogenSoft }}>logo após</th>
                <th className="text-right font-normal">2 h depois</th>
            </tr>
        </thead>
        <tbody className="text-[18px] font-semibold text-gray-100">
            <LedgerRow at={1} step={step}>
                <td>0–2 h</td>
                <td className="text-right tabular-nums" style={{ color: C.glycogenSoft }}>7,7</td>
                <td className="text-right tabular-nums">2,5</td>
            </LedgerRow>
            <LedgerRow at={2} step={step}>
                <td>2–4 h</td>
                <td className="text-right text-gray-300">não relatado</td>
                <td className="text-right tabular-nums">4,1 <span style={{ color: C.stone }}>(−45%)</span></td>
            </LedgerRow>
            <LedgerRow at={3} step={step}>
                <td>glicogênio 8 e 24 h</td>
                <td colSpan={2} className="text-right" style={{ color: C.stone }}>igual (Parkin)</td>
            </LedgerRow>
            <LedgerRow at={4} step={step} className="font-display text-[20px] font-bold">
                <td colSpan={3} className="pt-1" style={{ color: C.glucose }}>próxima sessão cedo → 1–1,2 g/kg/h já</td>
            </LedgerRow>
        </tbody>
    </table>
);

export default function WindowSim() {
    const { step, setStep } = useSlideSteps(WINDOW_STEPS.length);
    const s = WINDOW_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <RecTop tabs={WINDOW_STEPS.map(w => w.tab)} step={step} setStep={setStep} layoutId="window-tabs"
                chips={WINDOW_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)} />
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="flex shrink-0 flex-col justify-between px-3 py-2">
                    <WindowFiber step={step} />
                    <WindowChart step={step} />
                </Panel>
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                    <Narration step={step} headline={s.headline} color={ACCENT[step]}>{s.text}</Narration>
                    <div className="mt-auto flex flex-col gap-2">
                        <Ledger step={step} />
                        <Source>{sourcesUpTo(WINDOW_STEPS.map(w => w.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
}
