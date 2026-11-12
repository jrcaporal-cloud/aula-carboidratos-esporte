import { useSlideSteps } from '../../store/useSlideSteps';
import { StepTabs } from './kit/ui';
import { CAST } from './kit/cast';
import { FictionsChip, IllustrativeChip } from './kit/chips';
import { CastCard } from './ato1/CastCard';
import { CAST_TABS } from './ato1/cast.content';

/**
 * Slide 12 · Cinco Atletas, Cinco Tanques. Cinco cartões lado a lado; a cada passo um se abre: o tanque esvazia até o
 * nível do esforço típico (ilustrativo), aparece a fala do atleta, a pergunta fisiológica que ele traz e o dado real
 * que espera por ele no ato em que volta. Os cartões abertos ficam: o último passo é o elenco inteiro.
 */
const STEPS = CAST_TABS.length;
const FINAL = STEPS - 1;

export default function CastSim() {
    const { step, setStep } = useSlideSteps(STEPS);
    const final = step === FINAL;
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-2.5">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={CAST_TABS} step={step} onSelect={setStep} layoutId="cast-tabs" />
                <div className="flex shrink-0 gap-2">
                    <FictionsChip />
                    <IllustrativeChip>tanques ilustrativos</IllustrativeChip>
                </div>
            </div>
            <div className="flex min-h-0 flex-1 gap-2.5">
                {CAST.map((m, i) => <CastCard key={m.id} member={m} at={i} step={step} final={final} />)}
            </div>
        </div>
    );
}
