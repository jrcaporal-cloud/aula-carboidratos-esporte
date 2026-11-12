import { useSlideSteps } from '../../store/useSlideSteps';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { AnimalChip, DesignChip } from './kit/chips';
import { Source } from './kit/ui';
import { BODY_FONT, C, PANEL_BG } from './kit/palette';
import { Enterocyte } from './ato2/Enterocyte';
import { Model3DHint } from './kit/Model3DHint';

/**
 * Slide 26 · Duas Pistas no Intestino. O enterócito à esquerda (a fila no SGLT1 cresce; o GLUT5 abre
 * a segunda pista) e, à direita, o medidor de oxidação exógena com o teto de uma fonte só.
 */
const MAX = 1.4; // g/min no fim da régua

interface Step {
    value: string; flow: number; caption: string; line: string;
    queue: number; fructose: boolean; glut2: boolean; chip: 'design' | 'animal' | null;
}

const STEPS: readonly Step[] = [
    {
        value: '~1,0–1,1', flow: 1.05, queue: 2, fructose: false, glut2: false, chip: null,
        caption: 'g/min: teto da oxidação exógena com uma fonte só',
        line: 'O gargalo está na absorção e no fígado, não no músculo.',
    },
    {
        value: '0,83', flow: 0.83, queue: 8, fructose: false, glut2: false, chip: 'design',
        caption: 'g/min oxidados com 1,8 g/min de glicose (com 1,2 g/min: 0,80)',
        line: 'Mais glicose na boca só aumenta a fila na porta.',
    },
    {
        value: '1,26', flow: 1.26, queue: 3, fructose: true, glut2: false, chip: 'design',
        caption: 'g/min com 1,2 de glicose + 0,6 de frutose: ~55% a mais',
        line: 'A frutose usa outra porta, o GLUT5: uma segunda pista.',
    },
    {
        value: '1,26', flow: 1.26, queue: 3, fructose: true, glut2: true, chip: 'animal',
        caption: 'g/min: a segunda pista explica o ganho',
        line: 'GLUT2 na membrana apical? Em camundongo sem SGLT1, a glicose quase não foi retida. A porta principal é o SGLT1.',
    },
];

const Gauge = ({ flow }: { flow: number }) => (
    <div className="flex flex-col gap-2">
        <div className="relative h-[40px] overflow-hidden rounded-lg bg-slate-800">
            <Grow value={flow / MAX} color={C.glucose} />
            <div className="absolute inset-y-0 border-x-[3px] border-dashed border-white/90"
                style={{ left: `${(1.0 / MAX) * 100}%`, width: `${(0.1 / MAX) * 100}%` }} aria-hidden />
        </div>
        <div className="relative h-[24px] text-[16px] text-gray-300">
            <span className="absolute left-0">0</span>
            <span className="absolute -translate-x-1/2" style={{ left: `${(1.05 / MAX) * 100}%` }}>teto 1,0–1,1</span>
            <span className="absolute right-0">1,4 g/min</span>
        </div>
    </div>
);

export default function TwoLanesSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <div className="not-prose flex flex-col gap-3" style={BODY_FONT}>
            <div className="grid grid-cols-[507px_1fr] gap-8 rounded-2xl px-5 py-3" style={PANEL_BG}>
                <Enterocyte glucoseQueue={s.queue} fructose={s.fructose} apicalGlut2={s.glut2} />
                <div className="flex flex-col justify-center gap-5">
                    <div className="flex flex-col gap-1">
                        <CountUp text={s.value} className="font-display text-[84px] font-bold leading-none"
                            style={{ color: s.fructose ? C.fructoseSoft : C.glucose }} />
                        <span className="text-[20px] leading-snug text-gray-200">{s.caption}</span>
                    </div>
                    <Gauge flow={s.flow} />
                </div>
            </div>
            <div className="flex min-h-[76px] items-start justify-between gap-6">
                <Beat beat={step} className="min-w-0 flex-1">
                    <p className="m-0 text-[27px] leading-snug text-gray-100">{s.line}</p>
                </Beat>
                <span className="mt-1 flex shrink-0 flex-col items-end gap-2">
                    {s.chip === 'design' && <DesignChip>cruzado randomizado · n = 8 · ¹³C/¹⁴C · sem desempenho</DesignChip>}
                    {s.chip === 'animal' && <AnimalChip>camundongo knockout</AnimalChip>}
                    <Model3DHint label="enterócito em 3D" />
                </span>
            </div>
            <Source>Jeukendrup AE, Jentjens R. Sports Med 2000 · Jentjens RL et al. J Appl Physiol 2004 · Röder PV et al. PLoS One 2014</Source>
        </div>
    );
}
