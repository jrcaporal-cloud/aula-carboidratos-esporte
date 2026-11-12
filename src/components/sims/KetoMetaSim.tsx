import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Wipe } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { ForestPlot } from './kit/ForestPlot';
import { Appear, Foot, Frame, Headline } from './ato8/parts';
import { DIET_ROWS, KETO_BEATS, KETO_SOURCES, KETONE_ROWS } from './ato8/keto.content';

/**
 * Slide 148 · Cetonas e keto: as meta-análises. Dois instrumentos lado a lado, cada um com a sua régua
 * (% de diferença × g de Hedges): a dieta à esquerda, a cetona em gole à direita, revelada por clip-path.
 */

const PANEL_W = 548;
const PLOT_H = 230;

const PanelTitle = ({ title, sub, color }: { title: string; sub: string; color: string }) => (
    <div className="mb-2">
        <p className="m-0 text-[24px] font-bold" style={{ color }}>{title}</p>
        <p className="m-0 text-[17px] text-gray-300">{sub}</p>
    </div>
);

export default function KetoMetaSim() {
    const { step } = useSlideSteps(KETO_BEATS.length);
    return (
        <Frame>
            <Headline beat={step} chips={<DesignChip>{step < 2 ? 'meta-análise bayesiana · ECR e não randomizados' : 'meta-análises de ECR · endurance'}</DesignChip>} size={28}>{KETO_BEATS[step]}</Headline>
            <div className="mt-5 flex gap-10">
                <div style={{ width: PANEL_W }}>
                    <PanelTitle title="Dieta cetogênica" sub="Koerich 2023 · 18 estudos · IC credível 95%" color={C.fat} />
                    <div style={{ height: PLOT_H }}><ForestPlot rows={DIET_ROWS} width={PANEL_W} height={PLOT_H} domain={[-16, 4]} ticks={[-15, -10, -5, 0]}
                        axisLabel="diferença × dieta rica em CHO (%)" labelWidth={150} valueWidth={90} sides={['favorece CHO', 'keto']} decimals={1} /></div>
                    <Appear show={step >= 1} className="mt-2 rounded-xl px-4 py-2 text-[21px] text-gray-100" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        massa gorda <b style={{ color: C.fat }}>−2,4 kg</b> · massa magra −0,8 kg
                    </Appear>
                </div>
                <div style={{ width: PANEL_W }}>
                    <Wipe show={step >= 2} from="left" duration={0.7}>
                        <PanelTitle title="Cetona exógena, dose aguda" sub="meta-análises de ECR · IC 95%" color={C.stone} />
                        <div style={{ height: PLOT_H }}><ForestPlot rows={step >= 3 ? KETONE_ROWS : KETONE_ROWS.slice(0, 1)} width={PANEL_W} height={PLOT_H}
                            domain={[-0.5, 0.5]} ticks={[-0.4, -0.2, 0, 0.2, 0.4]} axisLabel="tamanho de efeito (g de Hedges)"
                            labelWidth={190} valueWidth={110} sides={['pior', 'melhor']} decimals={2} /></div>
                    </Wipe>
                </div>
            </div>
            <Foot source={step < 2 ? KETO_SOURCES.koerich : KETO_SOURCES.ketone} />
        </Frame>
    );
}
