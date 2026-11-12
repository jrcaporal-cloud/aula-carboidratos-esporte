import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { C } from './kit/palette';
import { Lead, SimFrame } from './ato6/Frame';
import { OxidationChart } from './ato6/OxidationChart';
import { MIX_LEADS } from './ato6/oxidation.content';
import { Model3DHint } from './kit/Model3DHint';

/**
 * Slide 104 · Quebrando o Teto. A resposta ao slide 103: em cima, as duas "pistas" do enterócito
 * (SGLT1 lotada; GLUT5 que abre); embaixo, a mesma curva de oxidação se transforma da glicose na mistura.
 * A tecla 3 abre o modelo 3D do enterócito (feito à parte).
 */

const BIG = [
    { value: '1,06 g/min', caption: 'só glicose, Jentjens 2005', color: C.glucose },
    { value: '1,75 g/min', caption: 'glicose + frutose 1:1 a 144 g/h', color: C.fructose },
    { value: '0,57 × 0,60', caption: 'mistura × glicose a ~48 g/h', color: '#E5E7EB' },
    { value: '8%', caption: 'mais rápido que só glicose', color: C.fructose },
] as const;

const DESIGN = [
    'ECR cruzado · n = 8 · isótopo 13C',
    'ECR cruzado · n = 8 · isótopo 13C',
    'ECR cruzado · n = 7 · isótopo 13C',
    'ECR cruzado · n = 8 · contrarrelógio',
] as const;

const SOURCES = [
    'Jentjens & Jeukendrup, Br J Nutr 2005',
    'Jentjens & Jeukendrup, Br J Nutr 2005',
    'Hulston, Wallis & Jeukendrup, Med Sci Sports Exerc 2009',
    'Currell & Jeukendrup, MSSE 2008 · O’Brien & Rowlands 2011; O’Brien et al. 2013',
] as const;

/** Uma pista do intestino: a porta (transportador) e as moléculas passando. */
const Lane = ({ name, sugar, color, count, open }: { name: string; sugar: string; color: string; count: number; open: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex items-center gap-4">
            <div className="flex w-[118px] shrink-0 flex-col">
                <span className="text-[22px] font-bold" style={{ color: open ? color : '#6B7280' }}>{name}</span>
                <span className="text-[16px] text-gray-400">{sugar}</span>
            </div>
            <div className="relative h-[52px] flex-1 overflow-hidden rounded-xl border-2" style={{ borderColor: open ? `${color}AA` : 'rgba(255,255,255,0.18)' }}>
                {!open && <span className="absolute inset-0 flex items-center pl-4 text-[18px] text-gray-500">fechada</span>}
                {open && Array.from({ length: count }, (_, i) => (
                    <motion.span key={i} className="absolute top-[12px] h-6 w-6 rounded-full" style={{ left: 12 + i * 32, background: color }}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: stagger(i, 0.1, 0.03), duration: DUR.enter, ease: EASE_OUT }} />
                ))}
            </div>
        </div>
    );
};

export default function MixSim() {
    const { step } = useSlideSteps(4);
    const big = BIG[step];
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{MIX_LEADS[step]}</Lead></Beat>}
            chips={<><DesignChip>{DESIGN[step]}</DesignChip>{(step === 1 || step === 2) && <IllustrativeChip />}<Model3DHint label="enterócito em 3D" /></>}
            source={SOURCES[step]}>
            <div className="flex h-full flex-col gap-3">
                <div className="flex h-[118px] shrink-0 items-center gap-10">
                    <div className="flex w-[560px] shrink-0 flex-col gap-3">
                        <Lane name="SGLT1" sugar="glicose" color={C.glucose} count={13} open />
                        {step === 0
                            ? <Lane name="GLUT5" sugar="frutose" color={C.fructose} count={0} open={false} />
                            : <Wipe from="left"><Lane name="GLUT5" sugar="frutose" color={C.fructose} count={10} open /></Wipe>}
                    </div>
                    <Beat beat={step} className="flex min-w-0 flex-1 flex-col gap-1">
                        <CountUp text={big.value} className="font-display text-[64px] font-bold leading-none" style={{ color: big.color }} />
                        <span className="text-[20px] leading-tight text-gray-300">{big.caption}</span>
                    </Beat>
                </div>
                <OxidationChart width={1136} height={250} curve={step === 0 ? 'glucose' : 'mix'} ghostGlucose={step >= 1}
                    showCeiling focusLow={step === 2} />
            </div>
        </SimFrame>
    );
}
