import { motion } from 'framer-motion';
import { Bike } from 'lucide-react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { FAT_BARS, GROUP_CAPTION, PHINNEY, type FatBar } from './fat.content';

/**
 * Palco do slide 144: linha do tempo 1983 → 2021. À esquerda, o arquivo de 1983 (cinco bicicletas, sem controle);
 * à direita, as colunas do pico de oxidação de gordura (g/min) com o desenho de cada estudo embaixo da barra.
 * Os anos ficam numa mesma linha no pé, como uma régua do tempo.
 */

const CHART_H = 196;
const MAX_G = 2;
const OUTLIER = 3;

const Year = ({ y, on }: { y: string; on: boolean }) => (
    <span className="relative z-10 rounded-full border-[3px] px-3 py-0.5 text-[18px] font-bold tabular-nums"
        style={{ background: '#04080F', borderColor: on ? '#FFFFFF' : 'rgba(255,255,255,0.35)', color: on ? '#FFFFFF' : '#D1D5DB' }}>{y}</span>
);

const Archive = ({ step }: { step: number }) => (
    <div className="flex w-[222px] shrink-0 flex-col items-center gap-3">
        <motion.div className="flex w-full flex-col gap-2 rounded-2xl border-2 px-4 py-3" initial={false}
            animate={{ opacity: step < 2 ? 1 : 0.75 }} transition={{ duration: DUR.enter }}
            style={{ borderColor: 'rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.04)' }}>
            <span className="text-[18px] font-bold text-white">Phinney · n = {PHINNEY.n}</span>
            <div className="flex justify-between">
                {Array.from({ length: PHINNEY.n }, (_, i) => {
                    const out = step >= 1 && i === OUTLIER;
                    return (
                        <motion.span key={i} initial={false} animate={{ opacity: step >= 1 && !out ? 0.6 : 1, y: out ? -8 : 0 }}
                            transition={{ duration: DUR.morph, ease: EASE_OUT }}
                            style={{ color: out ? C.stone : C.text, borderColor: out ? C.stone : 'transparent' }}
                            className="rounded-lg border-[3px] p-0.5">
                            <Bike size={32} strokeWidth={2.2} />
                        </motion.span>
                    );
                })}
            </div>
            {PHINNEY.rows.map(r => (
                <div key={r.label} className="flex flex-col leading-tight">
                    <span className="text-[16px] text-gray-300">{r.label}</span>
                    <span className="text-[21px] font-bold tabular-nums text-white">{r.value}</span>
                </div>
            ))}
            <motion.span className="text-[17px] font-semibold leading-snug" style={{ color: C.stone }} initial={false}
                animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.4 : 0 }}>
                um ciclista puxou a média
            </motion.span>
        </motion.div>
        <Year y="1983" on={step < 2} />
    </div>
);

const Column = ({ bar, step }: { bar: FatBar; step: number }) => {
    const show = step >= bar.at;
    const color = bar.cho ? C.glucose : C.fat;
    const h = (bar.gmin / MAX_G) * CHART_H;
    const delay = show && step === bar.at ? 0.15 + FAT_BARS.filter(b => b.at === bar.at).indexOf(bar) * 0.15 : 0;
    return (
        <motion.div className="flex w-[88px] flex-col items-center" initial={false} animate={{ opacity: show ? 1 : 0 }}
            transition={{ duration: DUR.enter, delay: show ? delay : 0 }}>
            <div className="relative w-full" style={{ height: CHART_H }}>
                <div className="absolute inset-x-[8px] bottom-0 overflow-hidden rounded-t-lg" style={{ height: h }}>
                    {show && <Grow value={1} axis="y" color={color} delay={delay} />}
                </div>
                <div className="absolute inset-x-[-10px] text-center" style={{ bottom: h + 6 }}>
                    <CountUp text={`${bar.approx ? '~' : ''}${br(bar.gmin, 2)}`} run={show} delay={delay}
                        className="font-display text-[24px] font-bold leading-none" style={{ color }} />
                </div>
            </div>
            <span className="mt-1 h-[42px] text-center text-[16px] font-semibold leading-tight text-white">{bar.label}</span>
            <span className="h-[22px] text-center text-[16px] leading-tight text-gray-300">{bar.design}</span>
        </motion.div>
    );
};

const GROUPS = ['2016', '2017', '2021'] as const;

const Chart = ({ step }: { step: number }) => (
    <div className="flex flex-1 flex-col">
        <span className="mb-1 text-[16px] text-gray-300">pico de oxidação de gordura · g/min</span>
        <div className="relative flex items-start gap-2 pl-[40px]">
            {[0.5, 1, 1.5].map(v => (
                <div key={v} className="pointer-events-none absolute inset-x-0 flex items-center" style={{ top: CHART_H * (1 - v / MAX_G) - 10 }}>
                    <span className="w-[36px] text-[16px] tabular-nums text-gray-300">{br(v, 1)}</span>
                    <span className="h-0 flex-1 border-t-2 border-dashed border-white/20" />
                </div>
            ))}
            {GROUPS.map(g => (
                <div key={g} className="flex flex-col items-center gap-3">
                    <div className="flex">{FAT_BARS.filter(b => b.year === g).map(b => <Column key={b.id} bar={b} step={step} />)}</div>
                    <motion.div className="flex flex-col items-center gap-3" initial={false}
                        animate={{ opacity: FAT_BARS.some(b => b.year === g && step >= b.at) ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                        <span className="flex h-[42px] flex-col items-center justify-end whitespace-nowrap text-center text-[16px] leading-tight" style={{ color: C.stone }}>
                            <span className="font-semibold">{GROUP_CAPTION[g][0]}</span><span>{GROUP_CAPTION[g][1]}</span>
                        </span>
                        <Year y={g} on={FAT_BARS.some(b => b.year === g && step === b.at)} />
                    </motion.div>
                </div>
            ))}
        </div>
    </div>
);

export const FatStage = ({ step }: { step: number }) => (
    <div className="relative flex h-full items-end gap-5">
        {/* a régua do tempo: uma linha só, atrás das pílulas dos anos */}
        <span className="absolute inset-x-0 bottom-[17px] h-[3px] rounded-full bg-white/35" aria-hidden />
        <Archive step={step} />
        <Chart step={step} />
    </div>
);
