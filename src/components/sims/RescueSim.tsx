import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { MotorFrame, StepText } from './ato3/motorB';
import { RescueFlow } from './ato3/RescueFlow';
import { RESCUE_STEPS } from './ato3/rescue.content';

/**
 * Slide 49 · O Resgate pela Veia. Palco: a cadeia de causa em 4 faixas (ato3/RescueFlow): o açúcar do sangue acabou →
 * três resgates, três tempos → o músculo não era o limite → o cérebro sente a hipoglicemia. Painel: texto do passo + dado-chave.
 */

const ACCENT = [C.risk, C.glucose, C.glycogenSoft, C.stone] as const;

const COGGAN_CHIP = 'cruzado · n = 7 · não cego';
const CHIPS: readonly (readonly string[])[] = [
    [COGGAN_CHIP], [COGGAN_CHIP], [COGGAN_CHIP], ['Nybo MSSE: cruzado · n = 8', 'Acta: n = 6'],
];

export default function RescueSim() {
    const { step, setStep } = useSlideSteps(RESCUE_STEPS.length);
    const s = RESCUE_STEPS[step];
    return (
        <MotorFrame tabs={RESCUE_STEPS.map(r => r.tab)} step={step} setStep={setStep} layoutId="rescue-tabs" chips={CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}>
            <Panel className="w-[660px] shrink-0 p-2"><RescueFlow step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <Reveal key={`lim-${step}`} order={2}>
                    <p className="m-0 text-[16px] leading-snug text-gray-300"><b className="text-gray-200">Limitação:</b> {s.limit}</p>
                </Reveal>
                <Reveal key={`stat-${step}`} order={1} className="mt-auto flex items-baseline gap-3">
                    <CountUp text={s.stat} delay={0.2} className="whitespace-nowrap font-display text-[44px] font-bold leading-none"
                        style={{ color: ACCENT[step], wordSpacing: '0.15em' }} />
                    <span className="text-[17px] leading-snug text-gray-200">{s.statCaption}</span>
                </Reveal>
                <Source>{sourcesUpTo(RESCUE_STEPS.map(r => r.sources), step)}</Source>
            </Panel>
        </MotorFrame>
    );
}
