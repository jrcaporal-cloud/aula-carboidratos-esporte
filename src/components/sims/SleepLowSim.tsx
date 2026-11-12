import { useSlideSteps } from '../../store/useSlideSteps';
import { Beat } from './kit/Beat';
import { Chip } from './kit/ui';
import { DesignChip } from './kit/chips';
import { C } from './kit/palette';
import { CostScene, DayStrip, StudyRows } from './ato8/SleepParts';
import { Foot, Frame, Headline } from './ato8/parts';
import { SLEEP_BEATS, SLEEP_SOURCES } from './ato8/sleeplow.content';

/**
 * Slide 142 · Sleep low: o ganho que sumiu.
 * 1 o dia de sleep low, grande, no centro (mesmo CHO, outro horário) · 2 o trilho vira faixa fina no topo; entra Marquet 2016
 * · 3 entram as réplicas (Gejl 2017, Riis 2019) e Marquet apaga · 4 o custo: 323 × 297 W no HIT (Hulston 2010).
 */

const SOURCE_OF_STEP = [0, 0, 1, 2] as const;

const DESIGN = [
    <Chip key="g" color={C.glucose}>6 g/kg/d nos dois grupos</Chip>,
    <DesignChip key="m">ECR não cego · 11 × 10 triatletas · 3 semanas</DesignChip>,
    <DesignChip key="r">ECRs · treinados e elite · 4 semanas</DesignChip>,
    <DesignChip key="h">ECR pareado · 14 ciclistas · 3 semanas</DesignChip>,
];

export default function SleepLowSim() {
    const { step } = useSlideSteps(SLEEP_BEATS.length);
    return (
        <Frame>
            <Headline beat={step} chips={DESIGN[step]}>{SLEEP_BEATS[step]}</Headline>
            {/* o trilho do dia: grande no centro no passo 1; depois vira faixa fina no topo, como legenda */}
            {step === 0 && <Beat beat="dia" className="mt-[96px]"><DayStrip /></Beat>}
            {step === 0 && <p className="m-0 mt-6 text-[22px] text-gray-300">Total de carboidrato no dia: igual nos dois grupos.</p>}
            {(step === 1 || step === 2) && <div className="mt-3 mb-3"><DayStrip compact /></div>}
            {(step === 1 || step === 2) && <StudyRows count={step === 1 ? 1 : 3} dimFirst={step === 2} />}
            {step === 3 && <Beat beat="custo" className="mt-6"><CostScene /></Beat>}
            <Foot source={SLEEP_SOURCES[SOURCE_OF_STEP[step]]} />
        </Frame>
    );
}
