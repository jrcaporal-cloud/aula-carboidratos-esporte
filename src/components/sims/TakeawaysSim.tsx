import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { PANEL_BG } from './kit/palette';
import { Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { Source } from './kit/ui';
import { SIM_H } from './ato10/units';
import { SOURCE, TAKEAWAYS, type Takeaway } from './ato10/takeaways.content';

/**
 * Slide 191 · O Que Levar para a Segunda-feira. Um mural 3 × 2 que se completa: a cada passo uma mensagem entra
 * (revelação por clip-path) com o número contando; as anteriores ficam, mais quietas, e perdem a legenda.
 */
const Tile = ({ t, index, state }: { t: Takeaway; index: number; state: 'now' | 'past' | 'next' }) => (
    <div className="relative rounded-2xl" style={PANEL_BG}>
        {state !== 'next' && (
            <Wipe from="left" className="absolute inset-0">
                <motion.div className="flex h-full flex-col justify-between rounded-2xl border-[3px] px-6 py-5"
                    animate={{ borderColor: state === 'now' ? t.color : 'rgba(255,255,255,0.08)', opacity: state === 'now' ? 1 : 0.72 }}
                    transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    <div className="flex items-start justify-between gap-3">
                        <CountUp text={t.number} className="whitespace-nowrap font-display text-[40px] font-bold leading-none" style={{ color: t.color }} />
                        <span className="font-mono text-[16px] tabular-nums text-gray-400">{index + 1}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[25px] font-semibold leading-tight text-white">{t.message}</span>
                        <motion.span className="text-[17px] leading-snug text-gray-200" initial={false}
                            animate={{ opacity: state === 'now' ? 1 : 0 }} transition={{ duration: DUR.text }}>
                            {t.what} · {t.source}
                        </motion.span>
                    </div>
                </motion.div>
            </Wipe>
        )}
    </div>
);

export default function TakeawaysSim() {
    const { step } = useSlideSteps(TAKEAWAYS.length);
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ height: SIM_H }}>
            <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-4">
                {TAKEAWAYS.map((t, i) => (
                    <Tile key={t.number} t={t} index={i} state={i === step ? 'now' : i < step ? 'past' : 'next'} />
                ))}
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
