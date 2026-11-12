import { motion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Grow } from '../kit/Beat';
import { DECOMBAZ, DECOMBAZ_MAX } from './liver.content';

/**
 * Faixa de baixo do slide 124: à esquerda, o protocolo do Fuchs 2016 (5 h de bebida, ¹³C-MRS aos 0, 120 e 300 min);
 * à direita, a partir do passo 4, as barras do Décombaz 2011 (síntese hepática em g/h, frutose e galactose × glicose).
 */

const MRS = [0, 120, 300] as const;

const Protocol = () => (
    <div className="flex w-[232px] shrink-0 flex-col gap-1.5">
        <span className="text-[16px] font-semibold text-gray-200">Fuchs 2016 · 5 h de bebida</span>
        <div className="relative mx-2 h-[70px] [container-type:inline-size]">
            {/* a bebida, 1,5 g/kg/h do minuto 0 ao 300 */}
            <div className="absolute inset-x-0 top-0 flex h-[24px] items-center justify-center rounded-md text-[15px] font-bold"
                style={{ background: C.glucose, color: '#04080F' }}>1,5 g/kg/h</div>
            <span aria-hidden className="absolute inset-x-0 top-[36px] h-[3px] rounded-full bg-white/50" />
            {MRS.map(t => (
                <div key={t} className="absolute top-[30px] w-0" style={{ left: `${(t / 300) * 100}%` }}>
                    <span aria-hidden className="absolute -left-[7px] h-[14px] w-[14px] rounded-full border-[3px]" style={{ borderColor: C.glycogenSoft, background: '#04080F' }} />
                    <span className={`absolute top-[17px] whitespace-nowrap text-[15px] tabular-nums text-gray-200 ${t === 300 ? "-translate-x-[78%]" : "-translate-x-1/2"}`}>{t === 300 ? '300 min' : t}</span>
                </div>
            ))}
        </div>
        <span className="flex items-center gap-1.5 text-[15px] leading-tight text-gray-300">
            <span aria-hidden className="h-[12px] w-[12px] rounded-full border-[3px]" style={{ borderColor: C.glycogenSoft }} />
            ¹³C-MRS: fígado e músculo
        </span>
    </div>
);

const Decombaz = () => (
    <motion.div className="flex min-w-0 flex-1 flex-col gap-1.5" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
        <span className="text-[16px] font-semibold text-gray-200">Décombaz 2011 · síntese no fígado, g/h</span>
        {DECOMBAZ.map((d, i) => (
            <div key={d.label} className="flex items-center gap-2.5">
                <span className="w-[146px] shrink-0 text-[16px] text-gray-100">{d.label}</span>
                <div className="relative h-[20px] flex-1 overflow-hidden rounded-[4px]" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <Grow value={d.value / DECOMBAZ_MAX} color={d.color} delay={stagger(i, 0.2, 0.1)} />
                </div>
                <span className="w-[34px] shrink-0 text-right font-display text-[19px] font-semibold tabular-nums" style={{ color: d.color }}>{d.text}</span>
            </div>
        ))}
    </motion.div>
);

export const LiverStrip = ({ step }: { step: number }) => (
    <div className="flex h-full items-stretch gap-5 px-4 py-2.5">
        <Protocol />
        <span aria-hidden className="w-[2px] self-stretch rounded-full bg-white/15" />
        {step >= 3 ? <Decombaz /> : <div className="flex-1" />}
    </div>
);
