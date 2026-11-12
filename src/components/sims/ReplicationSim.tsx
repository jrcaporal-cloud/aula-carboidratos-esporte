import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { Appear, Foot, Frame, Headline } from './ato8/parts';
import { REPLICATION_BEATS, REPLICATION_SOURCES, SECONDS, SN3, type SecondsRow } from './ato8/replication.content';

/**
 * Slide 146 · A crise de confiança evitada. Composição diferente do Supernova: um eixo de segundos que abre do centro
 * (mais rápido à direita, mais lento à esquerda) e, no fim, as fichas dos 13 marchadores do Supernova 3 (só a contagem).
 */

const COLOR: Record<SecondsRow['id'], string> = { hcho: C.glucose, pcho: C.glucoseSoft, lchf: C.fat };
const HALF = 340;
const MAX_S = 140;

const SecondsBar = ({ row, i }: { row: SecondsRow; i: number }) => {
    const color = COLOR[row.id];
    const w = (Math.abs(row.seconds) / MAX_S) * HALF;
    const right = row.seconds > 0;
    return (
        <div className="flex items-center">
            <span className="w-[120px] text-[28px] font-bold" style={{ color }}>{row.name}</span>
            <div className="relative h-[84px]" style={{ width: HALF * 2 }}>
                <div className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-white/40" />
                <div className="absolute top-[20px] h-[44px] overflow-hidden rounded-md"
                    style={{ width: w, left: right ? HALF : HALF - w, transform: right ? undefined : 'scaleX(-1)' }}>
                    <Grow value={1} color={color} delay={stagger(i, 0, 0.15)} />
                </div>
                <div className="absolute top-1/2 flex -translate-y-1/2 items-baseline gap-2 whitespace-nowrap"
                    style={{ left: right ? HALF + w + 14 : HALF + 14 }}>
                    <CountUp text={`${Math.abs(row.seconds)} s`} delay={stagger(i, 0.2, 0.15)} className="font-display text-[44px] font-bold" style={{ color }} />
                    <span className="text-[18px] text-gray-300">{row.pctText} · {row.note}</span>
                </div>
            </div>
        </div>
    );
};

const Token = ({ up, color, i }: { up: boolean; color: string; i: number }) => (
    <motion.span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px]"
        style={{ borderColor: color, background: up ? color : 'transparent', color: up ? '#04080F' : color }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: stagger(i, 0.1, 0.05), duration: 0.3, ease: EASE_OUT }}>
        {up ? <ArrowUp size={28} strokeWidth={3} /> : <ArrowDown size={28} strokeWidth={3} />}
    </motion.span>
);

const Supernova3 = () => (
    <div className="flex flex-col gap-8">
        {([['HCHO', SN3.hcho, C.glucose, 'todos melhoraram'], ['LCHF', SN3.lchf, C.fat, '6 de 7 pioraram']] as const).map(([name, list, color, verdict], r) => (
            <div key={name} className="flex items-center gap-5">
                <span className="w-[100px] text-[24px] font-bold" style={{ color }}>{name}</span>
                <div className="flex w-[590px] gap-3">{list.map((up, i) => <Token key={i} up={up} color={color} i={i + r * 6} />)}</div>
                <span className="text-[24px] font-semibold text-white">{verdict}</span>
            </div>
        ))}
        <p className="m-0 ml-[120px] text-[22px] text-gray-200">
            Em 5–6 dias: gordura ~1,4 g/min e VO₂ 5–8% maior no ritmo de prova.
        </p>
    </div>
);

export default function ReplicationSim() {
    const { step } = useSlideSteps(REPLICATION_BEATS.length);
    return (
        <Frame>
            <Headline beat={step} chips={step < 3
                    ? <DesignChip>replicação · n = 8 / 8 / 10 · não cego</DesignChip>
                    : <DesignChip>paralelo · 13 de classe mundial · 5–6 dias</DesignChip>} size={28}>{REPLICATION_BEATS[step]}</Headline>
            <div className="flex flex-1 flex-col justify-center">
                {step === 0 && (
                    <Beat beat="replay" className="flex items-center gap-10">
                        <span className="flex h-[160px] w-[160px] shrink-0 items-center justify-center rounded-full" style={{ background: C.stone, color: '#04080F' }}>
                            <RotateCcw size={80} strokeWidth={2.5} />
                        </span>
                        <div className="flex flex-col gap-2">
                            <span className="font-display text-[88px] font-bold leading-none text-white">jan–fev 2017</span>
                            <span className="text-[26px] leading-snug text-gray-200">mesmo campo no AIS, as mesmas três dietas; depois, 2,5 semanas de CHO alto e uma prova de 20 km</span>
                        </div>
                    </Beat>
                )}
                {(step === 1 || step === 2) && (
                    <div className="flex flex-col gap-3">
                        <div className="ml-[120px] flex justify-between text-[17px] text-gray-300" style={{ width: HALF * 2 }}>
                            <span>← mais lento no 10 km</span><span>mais rápido →</span>
                        </div>
                        {SECONDS.map((r, i) => <SecondsBar key={r.id} row={r} i={i} />)}
                        <Appear show={step === 2} className="ml-[120px] mt-3 inline-flex self-start rounded-xl px-4 py-2 text-[22px] font-semibold"
                            style={{ background: C.fat, color: '#04080F' }}>
                            20 km após voltar ao CHO: sem rebote
                        </Appear>
                    </div>
                )}
                {step === 3 && <Beat beat="sn3"><Supernova3 /></Beat>}
            </div>
            <Foot source={step < 3 ? REPLICATION_SOURCES.sn2 : REPLICATION_SOURCES.sn3} />
        </Frame>
    );
}
