import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { Wipe } from './kit/Beat';
import { ViaReviewChip } from './kit/chips';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { Accrue, MolFrame } from './ato2/moleculaA.ui';
import { Scene1848, Scene1855, Scene1857, SceneMilieu } from './ato2/bernardScenes';

/**
 * Slide 21 · O Açúcar que o Fígado Fabrica. Storyboard 2 × 2 no palco (cada cartão entra no seu passo e
 * fica: o quadro final é a história inteira) e, no painel, o caderno de Bernard reconstituído, que acumula.
 * Frases do caderno são paráfrase de Jörgens & Grüsser 2013 (via revisão histórica).
 */
interface Frame {
    tab: string;
    year: string;
    caption: string;
    color: string;
    headline: string;
    note: ReactNode;
    sources: readonly string[];
}

const JORGENS = 'Jörgens & Grüsser 2013';
const HABERT = 'Habert 2022';

const FRAMES: readonly Frame[] = [
    {
        tab: '1848', year: '1848', caption: 'açúcar no sangue', color: C.glucose,
        headline: 'Um cão sem açúcar no prato',
        note: <>Açúcar no sangue de um cão que não comera açúcar. Anota algo como “não entendo mais nada” e publica <i>De l’origine du sucre</i>.</>,
        sources: [JORGENS, HABERT],
    },
    {
        tab: '1855', year: 'fev. 1855', caption: 'isola o glicogênio', color: C.glycogenSoft,
        headline: 'A substância que vira açúcar',
        note: <>Isola no fígado uma substância que vira açúcar. No caderno: “batizo esta substância glicogênio”.</>,
        sources: [JORGENS],
    },
    {
        tab: '1857', year: '1857', caption: 'publica a memória', color: C.glycogenSoft,
        headline: 'Duas datas, um achado',
        note: <>Publica os “fenômenos glicogênicos do fígado”. Isolamento 1855, publicação 1857: as duas datas circulam.</>,
        sources: [JORGENS, HABERT],
    },
    {
        tab: 'Meio interno', year: 'depois', caption: 'meio interno', color: C.glucose,
        headline: 'O fígado é uma torneira',
        note: <>O fígado fabrica e repõe glicose: o sangue não depende só do prato. Daí o meio interno estável.</>,
        sources: [HABERT, 'Wasserman 2009', 'Hearris 2018'],
    },
];

const SCENES = [Scene1848, Scene1855, Scene1857] as const;

const Card = ({ i, step }: { i: number; step: number }) => {
    const f = FRAMES[i];
    const shown = step >= i;
    const current = step === i;
    const Scene = SCENES[i];
    return (
        <div className="relative flex flex-col overflow-hidden rounded-xl border-[3px]"
            style={{ borderColor: current ? f.color : shown ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.14)', borderStyle: shown ? 'solid' : 'dashed' }}>
            <div className="flex items-baseline gap-2 px-3 pt-1.5">
                <span className="font-display text-[24px] font-bold leading-tight" style={{ color: shown ? f.color : C.muted }}>{f.year}</span>
                <span className="text-[16px] font-semibold" style={{ color: shown ? '#E5E7EB' : C.muted }}>{f.caption}</span>
            </div>
            <Wipe show={shown} from="left" className="min-h-0 flex-1 px-2 pb-2" delay={current ? 0.1 : 0}>
                {Scene ? <Scene /> : <SceneMilieu live={current} />}
            </Wipe>
        </div>
    );
};

const Notebook = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-2">
        {FRAMES.filter((_, i) => i <= step).map((f, i) => (
            <Accrue key={f.tab} at={i} step={step} delay={0.45}>
                <p className="m-0 text-[16px] leading-[22px] text-gray-100">
                    <b className="mr-1.5 font-display text-[18px]" style={{ color: f.color }}>{f.year}</b>{f.note}
                </p>
            </Accrue>
        ))}
    </div>
);

export default function BernardSim() {
    const { step, setStep } = useSlideSteps(FRAMES.length);
    const f = FRAMES[step];
    return (
        <MolFrame tabs={FRAMES.map(x => x.tab)} step={step} setStep={setStep} layoutId="bernard-tabs" stageWidth={640}
            chips={<ViaReviewChip>caderno: paráfrase, via revisão histórica</ViaReviewChip>}
            stage={
                <div className="grid h-full grid-cols-2 grid-rows-2 gap-3 p-3">
                    {FRAMES.map((x, i) => <Card key={x.tab} i={i} step={step} />)}
                </div>
            }
            source={sourcesUpTo(FRAMES.map(x => x.sources), step)}>
            <motion.h3 key={step} className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: f.color }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                {f.headline}
            </motion.h3>
            <Notebook step={step} />
            {step >= 3 && (
                <Accrue at={3} step={step} delay={0.7}>
                    <p className="m-0 rounded-xl border-2 px-3 py-1.5 text-[16px] leading-[22px] text-gray-100" style={{ borderColor: C.glucose }}>
                        <b style={{ color: C.glucoseSoft }}>Para o esporte:</b> ~4 g de glicose no sangue; ~100 g de glicogênio no fígado,
                        que repõe sem parar. Por que, então, há hipoglicemia na prova? (Ato III)
                    </p>
                </Accrue>
            )}
        </MolFrame>
    );
}
