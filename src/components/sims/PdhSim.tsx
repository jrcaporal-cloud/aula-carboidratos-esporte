import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Beat, Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { br } from './kit/format';
import { SvgText } from './kit/ui';
import { Faucet } from './ato8/Faucet';
import { Foot, Frame, Headline } from './ato8/parts';
import { ARMS, PDH_BEATS, PDH_SOURCES } from './ato8/pdh.content';

/**
 * Slide 147 · A torneira fechada. Dois tanques iguais (873 × 868) com torneiras diferentes (PDH 2,39 × 1,69).
 * 1 os tanques enchem igual · 2 a manopla gira e o jato da gordura sai mais fino · 3 o sprint de 1 min (50,5 × 37,3)
 * · 4 a prova de Havemann: ritmo médio igual, sprints mais fracos (perfil ilustrativo).
 */

const ACCENT = { hcho: C.glucose, fat: C.fat } as const;
const MAX_PDH = 2.39;

/** Perfil de potência ilustrativo: base estável com quatro ataques de 1 km. */
const profile = (sprint: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= 440; x += 10) {
        const attack = [80, 180, 280, 380].some(a => x >= a && x < a + 20);
        pts.push(`${x},${attack ? 150 - sprint : 150}`);
    }
    return pts.join(' ');
};

const RaceProfile = () => (
    <div className="flex flex-col gap-2">
        <Wipe from="left" duration={0.9}>
            <svg viewBox="0 0 440 200" width={440} height={200} role="img" aria-label="Perfil de potência ilustrativo na prova de 100 km">
                <line x1={0} x2={440} y1={170} y2={170} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                <polyline points={profile(110)} fill="none" stroke={C.glucose} strokeWidth={4} strokeLinejoin="round" />
                <polyline points={profile(70)} fill="none" stroke={C.fat} strokeWidth={4} strokeLinejoin="round" />
                <SvgText x={0} y={194} text="100 km com sprints de 1 km" size={16} color={C.muted} weight={500} />
            </svg>
        </Wipe>
        <span className="text-[20px] text-gray-200"><b style={{ color: C.fat }}>Gordura → CHO</b>: potência menor nos sprints.</span>
    </div>
);

const Numbers = ({ step }: { step: number }) => {
    if (step === 0) {
        return (
            <div className="flex flex-col gap-3">
                <span className="text-[18px] text-gray-300">glicogênio de repouso (µmol/g ps)</span>
                <span className="font-display text-[64px] font-bold leading-none text-white">873 × 868</span>
                <span className="text-[22px] text-gray-200">O estoque se recupera em 1 dia de CHO.</span>
            </div>
        );
    }
    const [a, b] = ARMS;
    const metric = step === 1 ? 'atividade da PDH (mmol/kg/min)' : 'glicogenólise no sprint de 1 min';
    const va = step === 1 ? br(a.pdh, 2) : br(a.sprint, 1);
    const vb = step === 1 ? br(b.pdh, 2) : br(b.sprint, 1);
    return (
        <div className="flex flex-col gap-3">
            <span className="text-[18px] text-gray-300">{metric}</span>
            <div className="flex items-baseline gap-4 font-display font-bold leading-none">
                <CountUp text={va} className="text-[64px]" style={{ color: C.glucose }} />
                <span className="text-[40px] text-gray-400">×</span>
                <CountUp text={vb} className="text-[64px]" style={{ color: C.fat }} />
            </div>
            <span className="text-[22px] leading-snug text-gray-200">
                {step === 1 ? 'Mais gordura oxidada (~45%), menos CHO (~30%).' : 'Mesmo tanque, menos glicogênio liberado quando o esforço aperta.'}
            </span>
        </div>
    );
};

export default function PdhSim() {
    const { step } = useSlideSteps(PDH_BEATS.length);
    return (
        <Frame>
            <Headline beat={step} chips={step < 3
                    ? <DesignChip>cruzado · 7 ciclistas · 5 + 1 dias</DesignChip>
                    : <><DesignChip>cruzado · simples-cego · 8 ciclistas</DesignChip><IllustrativeChip /></>} size={28}>{PDH_BEATS[step]}</Headline>
            <div className="mt-5 flex items-start gap-12">
                <div className="flex gap-6">
                    {ARMS.map(arm => (
                        <Faucet key={arm.id} level={arm.glycogen / 950} value={`${arm.glycogen}`}
                            open={arm.pdh / MAX_PDH} flowing={step >= 1} label={arm.name} accent={ACCENT[arm.id]} />
                    ))}
                </div>
                <div className="flex-1 pt-10">
                    <Beat beat={step}>{step < 3 ? <Numbers step={step} /> : <RaceProfile />}</Beat>
                </div>
            </div>
            <Foot source={step < 3 ? PDH_SOURCES.stell : PDH_SOURCES.havemann} />
        </Frame>
    );
}
