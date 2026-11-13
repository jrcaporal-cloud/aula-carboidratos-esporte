import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { ChainCell as Cell, ScaleBar as Bar } from './chainStrip';

/**
 * Slide 46 · o palco em 4 quadros numerados, um por elo da cadeia (lidos em Z): 1 o FADH₂ rende menos ATP por O →
 * 2 a gordura gera mais FADH₂ → 3 logo o litro de O₂ rende menos → 4 na prova, isso pesa. Cada quadro entra no seu
 * passo e fica; antes disso, só a moldura tracejada com o título (o aluno vê o caminho inteiro desde o início).
 * Números: HINKLE2005 (P/O), livro-texto (carreadores), SCOTT2012 (kJ/L), BURKE2017 (10 km).
 */

const DARK = '#04080F';

/** Complexos que bombeiam H⁺: o FADH₂ entra depois do I e pula esse bombeamento. */
const Pumps = ({ skipFirst }: { skipFirst: boolean }) => (
    <div className="flex gap-1.5">
        {['I', 'III', 'IV'].map((p, i) => {
            const off = skipFirst && i === 0;
            return (
                <span key={p} className="flex h-[30px] w-[42px] items-center justify-center rounded-md border-2 text-[16px] font-bold"
                    style={off ? { borderColor: '#475569', borderStyle: 'dashed', color: '#64748B' } : { background: '#E2E8F0', borderColor: '#E2E8F0', color: DARK }}>{p}</span>
            );
        })}
    </div>
);

const PumpRow = ({ carrier, skip, po }: { carrier: string; skip: boolean; po: string }) => (
    <div className="flex items-center gap-2">
        <span className="w-[62px] text-[17px] font-bold text-white">{carrier}</span>
        <span className="text-[17px] text-gray-300">→</span>
        <Pumps skipFirst={skip} />
        <span className="ml-auto text-[16px] text-gray-300">P/O</span>
        <span className="w-[44px] text-right font-display text-[24px] font-bold leading-none text-white">{po}</span>
    </div>
);

/** Um quadradinho por carreador: cheio = NADH, vazado = FADH₂ (mesmo tamanho nos dois combustíveis). */
const Carriers = ({ nadh, fadh, color }: { nadh: number; fadh: number; color: string }) => (
    <div className="flex flex-wrap gap-[3px]">
        {Array.from({ length: nadh + fadh }, (_, i) => (
            <span key={i} className="h-[10px] w-[10px] rounded-[2px]"
                style={i < nadh ? { background: color } : { border: `2px solid ${color}` }} />
        ))}
    </div>
);

const FuelCount = ({ label, nadh, fadh, share, color }: { label: string; nadh: number; fadh: number; share: string; color: string }) => (
    <div className="flex items-center gap-3">
        <div className="flex w-[92px] shrink-0 flex-col leading-tight">
            <span className="text-[17px] font-bold" style={{ color }}>{label}</span>
            <span className="text-[16px] text-gray-300">{nadh} + {fadh}</span>
        </div>
        <div className="w-[299px]"><Carriers nadh={nadh} fadh={fadh} color={color} /></div>
        <span className="ml-auto whitespace-nowrap font-display text-[22px] font-bold leading-none" style={{ color }}>{share}</span>
    </div>
);

/** Barras divergentes a partir do zero (melhora à direita, piora à esquerda). Escala −4 a +8%. */
const RACE = [
    { label: 'HCHO', value: 6.6, text: '+6,6%', color: C.glucose },
    { label: 'PCHO', value: 5.3, text: '+5,3%', color: C.glucoseSoft },
    { label: 'LCHF', value: -1.6, text: '−1,6%', color: C.fat },
] as const;
const R_MIN = -4;
const R_MAX = 8;
const ZERO = (-R_MIN / (R_MAX - R_MIN)) * 100;

const RaceBars = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1.5">
            {RACE.map((r, i) => {
                const w = (Math.abs(r.value) / (R_MAX - R_MIN)) * 100;
                const left = r.value >= 0 ? ZERO : ZERO - w;
                return (
                    <div key={r.label} className="flex items-center gap-2">
                        <span className="w-[52px] text-[16px] font-bold" style={{ color: r.color }}>{r.label}</span>
                        <div className="relative h-[22px] flex-1">
                            <span className="absolute inset-y-[-4px] w-[2px] bg-gray-400" style={{ left: `${ZERO}%` }} />
                            <motion.div className="absolute inset-y-0 rounded-sm" style={{ left: `${left}%`, width: `${w}%`, background: r.color, transformOrigin: r.value >= 0 ? 'left center' : 'right center' }}
                                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, delay: 0.3 + i * 0.12, ease: EASE_OUT }} />
                        </div>
                        <span className="w-[62px] text-right font-display text-[18px] font-bold tabular-nums" style={{ color: r.color }}>{r.text}</span>
                    </div>
                );
            })}
        </div>
    );
};

export const OxygenFlow = ({ step }: { step: number }) => (
    <div className="grid h-full grid-rows-4 gap-2">
        <Cell n={1} title="O FADH₂ rende menos ATP por O" note="I, III e IV bombeiam H⁺; o FADH₂ entra depois do I" show={step >= 0} born={step === 0}>
            <PumpRow carrier="NADH" skip={false} po="2,5" />
            <PumpRow carrier="FADH₂" skip po="1,5" />
        </Cell>
        <Cell n={2} title="A gordura gera mais FADH₂" note="■ NADH · □ FADH₂, por molécula" show={step >= 1} born={step === 1}>
            <FuelCount label="glicose" nadh={10} fadh={2} share="1 em 6" color={C.glucose} />
            <FuelCount label="palmitato" nadh={31} fadh={15} share="1 em 3" color={C.fat} />
        </Cell>
        <Cell n={3} title="Logo, o litro de O₂ rende menos" note="energia liberada por 1 L de O₂" show={step >= 2} born={step === 2}>
            <div className="flex items-center gap-4">
                <div className="flex flex-1 flex-col gap-1.5">
                    <Bar label="glicose" value={21.1} text="21,1 kJ" max={22} color={C.glucose} delay={0.25} />
                    <Bar label="gordura" value={19.6} text="19,6 kJ" max={22} color={C.fat} delay={0.4} />
                </div>
                <div className="flex w-[118px] shrink-0 flex-col leading-tight">
                    <KeyFact color={C.fat} delay={0.8}><span className="font-display text-[26px] font-bold" style={{ color: C.fat }}>+7,7%</span></KeyFact>
                    <span className="text-[16px] text-gray-200">de O₂ para o mesmo trabalho</span>
                </div>
            </div>
        </Cell>
        <Cell n={4} title="Na prova, o O₂ é o teto" note="tempo de 10 km após 3 semanas · elite" show={step >= 3} born={step === 3}>
            <RaceBars />
        </Cell>
    </div>
);
