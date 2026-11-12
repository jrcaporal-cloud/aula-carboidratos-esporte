import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentType } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { EASE_IN_OUT } from '../../lib/motion';
import { Beat, Wipe } from './kit/Beat';
import { Source } from './kit/ui';
import { BODY_FONT, C, PANEL_BG } from './kit/palette';
import { HEX } from './ato2/geometry';
import { Amylase, ApicalDoors, BrushBorder, PortalExit } from './ato2/digestionArt';

/**
 * Slide 25 · Da Boca ao Sangue. Uma linha de metrô (boca → fígado): a glicose viaja até a estação do passo,
 * as estações já passadas ficam acesas e embaixo aparece o que acontece ali.
 */
const STATIONS = ['boca', 'intestino', 'borda em escova', 'enterócito', 'fígado'] as const;
const AT = [6, 28, 50, 72, 94]; // posição de cada estação, em % do trilho

interface Stop { station: number; Art: ComponentType; head: string; line: string }

const STOPS: readonly Stop[] = [
    {
        station: 1, Art: Amylase, head: 'Amilases',
        line: 'As amilases da saliva e do pâncreas cortam o amido: maltose da amilose, dextrinas ramificadas da amilopectina.',
    },
    {
        station: 2, Art: BrushBorder, head: 'Borda em escova',
        line: 'Enzimas presas na borda em escova (maltase-glicoamilase, sacarase-isomaltase) soltam as peças: só monossacarídeo atravessa.',
    },
    {
        station: 3, Art: ApicalDoors, head: 'Duas portas de entrada',
        line: 'Glicose e galactose entram pelo SGLT1, que usa o gradiente de Na⁺. A frutose entra por outra porta, o GLUT5.',
    },
    {
        station: 4, Art: PortalExit, head: 'Uma porta de saída',
        line: 'As três saem pelo GLUT2, do outro lado da célula, e caem na veia porta. O fígado é a primeira parada.',
    },
];

const Metro = ({ station }: { station: number }) => {
    const reduce = useReducedMotion();
    return (
        <div className="relative h-[86px] [container-type:inline-size]">
            <div className="absolute left-[6%] right-[6%] top-[22px] h-[6px] rounded bg-slate-700" aria-hidden />
            <motion.div className="absolute left-[6%] top-[22px] h-[6px] origin-left rounded" style={{ width: '88%', background: C.glucose }}
                initial={{ scaleX: 0 }} animate={{ scaleX: (AT[station] - AT[0]) / (AT[4] - AT[0]) }}
                transition={{ duration: reduce ? 0 : 0.9, ease: EASE_IN_OUT }} aria-hidden />
            {STATIONS.map((name, i) => (
                <div key={name} className="absolute top-[10px] flex -translate-x-1/2 flex-col items-center gap-2" style={{ left: `${AT[i]}%` }}>
                    <span className="h-[30px] w-[30px] rounded-full border-[5px]"
                        style={{ borderColor: i <= station ? C.glucose : '#475569', background: '#04080F' }} />
                    <span className="whitespace-nowrap text-[18px]" style={{ color: i <= station ? '#F3F4F6' : '#94A3B8' }}>{name}</span>
                </div>
            ))}
            <div className="absolute left-0 top-[10px] w-0">
                <motion.div initial={{ x: `${AT[0]}cqw` }} animate={{ x: `${AT[station]}cqw` }}
                    transition={{ duration: reduce ? 0 : 0.9, ease: EASE_IN_OUT }}>
                    <svg width={30} height={30} viewBox="-26 -26 52 52" className="-translate-x-1/2" aria-hidden>
                        <polygon points={HEX} fill={C.glucose} stroke="#04080F" strokeWidth={5} />
                    </svg>
                </motion.div>
            </div>
        </div>
    );
};

export default function DigestionSim() {
    const { step } = useSlideSteps(STOPS.length);
    const stop = STOPS[step];
    const Art = stop.Art;
    return (
        <div className="not-prose flex flex-col gap-4" style={BODY_FONT}>
            <Metro station={stop.station} />
            <div className="grid grid-cols-[560px_1fr] items-center gap-8 rounded-2xl p-5" style={PANEL_BG}>
                <Wipe key={step} from="left" delay={0.35} className="h-[240px]"><Art /></Wipe>
                <Beat beat={step} className="flex flex-col gap-3">
                    <span className="font-display text-[34px] font-semibold leading-tight" style={{ color: C.glucoseSoft }}>{stop.head}</span>
                    <p className="m-0 text-[24px] leading-snug text-gray-100">{stop.line}</p>
                </Beat>
            </div>
            <Source>Chi C et al. Front Nutr 2022 · Wright EM et al. Physiol Rev 2011 · Ferraris RP et al. Annu Rev Nutr 2018</Source>
        </div>
    );
}
