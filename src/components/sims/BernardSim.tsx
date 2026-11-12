import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentType } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT } from '../../lib/motion';
import { Beat, Wipe } from './kit/Beat';
import { Source } from './kit/ui';
import { BODY_FONT, C, PANEL_BG } from './kit/palette';
import { Scene1848, Scene1855, Scene1857, SceneMilieu } from './ato2/bernardArt';

/**
 * Slide 21 · O Açúcar que o Fígado Fabrica. História em quadros: uma régua do tempo no alto
 * (o marcador desliza de ano em ano) e um quadro grande por passo, desenhado em SVG chapado.
 */
interface Frame { mark: string; Scene: ComponentType; head: string; sub: string; color: string }

const FRAMES: readonly Frame[] = [
    {
        mark: '1848', Scene: Scene1848, color: C.glucose,
        head: 'Açúcar no sangue de um cão que não comera açúcar.',
        sub: 'Bernard anota algo como “não entendo mais nada”. Publica a origem do açúcar no animal.',
    },
    {
        mark: '1855', Scene: Scene1855, color: C.glycogenSoft,
        head: 'No fígado, uma substância que vira açúcar.',
        sub: 'Ele a isola e escreve no caderno: “batizo esta substância glicogênio”.',
    },
    {
        mark: '1857', Scene: Scene1857, color: C.glycogenSoft,
        head: 'Publica os “fenômenos glicogênicos do fígado”.',
        sub: 'O isolamento é de 1855; a publicação, de 1857. Por isso as duas datas circulam.',
    },
    {
        mark: 'meio interno', Scene: SceneMilieu, color: C.glucose,
        head: 'O sangue não depende só do prato.',
        sub: 'O fígado fabrica e repõe glicose. Daí Bernard chega ao meio interno: o corpo mantém o próprio sangue constante.',
    },
];

const Rail = ({ step }: { step: number }) => (
    <div className="relative flex items-center justify-between px-2">
        <div className="absolute left-6 right-6 top-1/2 h-[3px] -translate-y-1/2 bg-slate-600" aria-hidden />
        {FRAMES.map((f, i) => {
            const active = i === step;
            return (
                <div key={f.mark} className="relative flex items-center">
                    {active && (
                        <motion.span layoutId="bernard-rail" className="absolute -inset-x-3 -inset-y-1.5 rounded-xl"
                            style={{ background: f.color }} transition={{ duration: DUR.morph, ease: EASE_IN_OUT }} />
                    )}
                    <span className="relative rounded-lg px-1 font-display text-[24px] font-semibold"
                        style={{ color: active ? '#04080F' : i < step ? '#E5E7EB' : '#94A3B8', background: active ? 'transparent' : '#04080F' }}>
                        {f.mark}
                    </span>
                </div>
            );
        })}
    </div>
);

export default function BernardSim() {
    const { step } = useSlideSteps(FRAMES.length);
    const reduce = useReducedMotion();
    const f = FRAMES[step];
    const Scene = f.Scene;

    return (
        <div className="not-prose flex flex-col gap-5" style={BODY_FONT}>
            <Rail step={step} />
            <div className="grid grid-cols-[480px_1fr] gap-8 rounded-2xl p-5" style={{ ...PANEL_BG, height: 380 }}>
                <Wipe key={`scene-${step}`} from="left" className="h-[340px]">
                    <Scene />
                </Wipe>
                <div className="flex flex-col justify-center gap-5">
                    <Beat beat={`y-${step}`}>
                        <span className="font-display text-[72px] font-bold leading-none" style={{ color: f.color }}>
                            {f.mark === 'meio interno' ? 'Meio interno' : f.mark}
                        </span>
                    </Beat>
                    <motion.p key={`h-${step}`} className="m-0 text-[32px] font-semibold leading-tight text-white"
                        initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, duration: DUR.enter }}>
                        {f.head}
                    </motion.p>
                    <motion.p key={`s-${step}`} className="m-0 text-[23px] leading-snug text-gray-200"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: DUR.enter }}>
                        {f.sub}
                    </motion.p>
                </div>
            </div>
            <Source>Jörgens V, Grüsser M. Diabetes 2013 · Habert R. 2022 (história de Claude Bernard, cadernos e publicações)</Source>
        </div>
    );
}
