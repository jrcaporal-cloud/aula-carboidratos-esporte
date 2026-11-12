import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { A9Frame, StepText } from './ato9/A9aShell';
import { TeamColumns } from './ato9/TeamColumns';
import { CALC, CHIPS, STEPS } from './ato9/teamSport.content';

/**
 * Slide 161 · CHO no Jogo, em tríptico: músculo → tiro → jogada, uma coluna por estudo, cada uma com o seu gráfico.
 * Embaixo, o painel largo com o texto de pós do passo e as fontes acumuladas. No último passo, cada coluna ganha
 * o veredito: a evidência é nítida no músculo e no tiro e perde nitidez na jogada.
 */

const ACCENT = [C.glycogenSoft, C.glycogenSoft, C.glucoseSoft, C.stone] as const;

export default function TeamSportSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <A9Frame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="team-tabs" chips={<>
            {CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
            {CALC[step] && <CalcChip>{CALC[step]}</CalcChip>}
        </>}>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
                <TeamColumns step={step} />
                <Panel className="flex shrink-0 gap-6 px-5 py-3">
                    <div className="min-w-0 flex-1"><StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} size={17} /></div>
                    <div className="flex w-[220px] shrink-0 flex-col justify-end">
                        <Source>{sourcesUpTo(STEPS.map(t => t.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </A9Frame>
    );
}
