import { useSlideSteps } from '../../store/useSlideSteps';
import { Wipe } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { FormatBars, NullSeesaw, Stomach } from './ato6/HydrogelStage';
import { PbRow, PbShell, PbSidePanel } from './ato6/pbShell';
import { HYDRO_LEDGER, HYDRO_STEPS } from './ato6/hydrogel.content';

/**
 * Slide 108 · Formato e Hidrogel. O palco acumula três camadas: os 4 formatos com a mesma oxidação (Hearris),
 * o estômago onde o hidrogel gelifica e esvazia mais rápido em repouso (o mecanismo) e a gangorra que pende
 * para a pilha de nulos mesmo quando o positivo isolado (Rowe) pousa do outro lado (o efeito medido).
 * O painel guarda o livro de estudos; a fonte do rodapé acumula todos os passos.
 */

const ACCENT = [C.glucose, C.glucoseSoft, C.caveat, C.ok] as const;
const TONE = { null: '#F3F4F6', mech: C.glucoseSoft, pos: C.ok } as const;

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-0.5 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">estudo</th>
                <th className="font-normal">desenho</th>
                <th className="text-right font-normal">resultado</th>
            </tr>
        </thead>
        <tbody>
            {HYDRO_LEDGER.filter(r => r.at <= step).map((r, i) => (
                <PbRow key={r.study} at={r.at} step={step} i={i % 2} className="text-[17px] font-semibold" >
                    <td style={{ color: TONE[r.tone] }}>{r.study}</td>
                    <td className="font-mono text-[15px] text-gray-300">{r.n}</td>
                    <td className="text-right tabular-nums" style={{ color: TONE[r.tone] }}>{r.result}</td>
                </PbRow>
            ))}
        </tbody>
    </table>
);

export default function HydrogelSim() {
    const { step, setStep } = useSlideSteps(HYDRO_STEPS.length);
    const s = HYDRO_STEPS[step];
    return (
        <PbShell tabs={HYDRO_STEPS.map(h => h.tab)} step={step} setStep={setStep} layoutId="hydrogel-tabs"
            chips={<DesignChip>{s.chip}</DesignChip>}>
            <Panel className="flex w-[600px] shrink-0 flex-col gap-3 px-5 py-3">
                <FormatBars />
                <div className="grid min-h-0 flex-1 grid-cols-2 gap-5 border-t-2 border-white/15 pt-2">
                    {step >= 1 ? <Wipe from="top"><Stomach step={step} /></Wipe> : <div />}
                    {step >= 2 ? <Wipe from="left"><NullSeesaw step={step} /></Wipe> : <div />}
                </div>
            </Panel>
            <PbSidePanel step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                source={sourcesUpTo(HYDRO_STEPS.map(h => h.sources), step)}>
                <Ledger step={step} />
            </PbSidePanel>
        </PbShell>
    );
}
