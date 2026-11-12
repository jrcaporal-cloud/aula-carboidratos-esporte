import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Wipe } from './kit/Beat';
import { Source } from './kit/ui';
import { BODY_FONT, C, PANEL_BG } from './kit/palette';
import { Lane, Molecule } from './ato2/Lane';

/**
 * Slide 23 · Síntese não é Quebra ao Contrário. Duas pistas em sentidos opostos:
 * a fosforilase quebra (Cori), a glicogênio sintase constrói via UDP-glicose (Leloir). Fecha com os dois Nobel.
 */
const STEPS = [
    { tab: '1939', line: 'No tubo de ensaio, os Cori viram a fosforilase montar um polissacarídeo a partir de glicose-1-fosfato. Parecia uma rua de mão dupla.' },
    { tab: 'Leloir', line: 'Em Buenos Aires, Leloir mostra que a síntese real usa outro doador, a UDP-glicose, e outra enzima: a glicogênio sintase.' },
    { tab: 'Dois controles', line: 'No corpo, a fosforilase quebra e a sintase constrói. Duas enzimas, dois controles: dá para frear uma e soltar a outra.' },
    { tab: 'Nobel', line: 'A quebra rendeu o Nobel de 1947; a construção, o de 1970.' },
] as const;

const Control = ({ text, color, show }: { text: string; color: string; show: boolean }) => (
    <motion.span className="rounded-lg border-2 px-3 py-1 text-[18px]" style={{ borderColor: color, color }}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }}
        transition={{ duration: DUR.enter, ease: EASE_OUT, delay: show ? 0.3 : 0 }}>
        {text}
    </motion.span>
);

const MEDALS = [
    { year: '1947', field: 'Fisiologia ou Medicina', who: 'Carl e Gerty Cori (metade; a outra metade, Houssay)', color: C.glucose },
    { year: '1970', field: 'Química', who: 'Luis F. Leloir, nucleotídeos de açúcar', color: C.glycogenSoft },
] as const;

const Medals = () => (
    <div className="grid grid-cols-2 gap-6">
        {MEDALS.map((m, i) => (
            <motion.div key={m.year} className="flex items-center gap-4"
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: stagger(i, 0.1, 0.2), type: 'spring', duration: 0.5, bounce: 0.2 }}>
                <span className="flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-full border-[5px] font-display text-[28px] font-bold"
                    style={{ borderColor: m.color, color: m.color }}>{m.year}</span>
                <span className="flex flex-col">
                    <span className="text-[22px] font-semibold text-white">{m.field}</span>
                    <span className="text-[18px] leading-snug text-gray-200">{m.who}</span>
                </span>
            </motion.div>
        ))}
    </div>
);

export default function LeloirSim() {
    const { step } = useSlideSteps(STEPS.length);
    const run = String(step);
    return (
        <div className="not-prose flex flex-col gap-4" style={BODY_FONT}>
            <div className="relative flex flex-col gap-3 rounded-2xl p-5" style={PANEL_BG}>
                <motion.span className="absolute inset-x-0 bottom-[44px] text-center font-display text-[34px] font-semibold text-slate-500"
                    animate={{ opacity: step === 0 ? 1 : 0 }} transition={{ duration: DUR.text }} aria-hidden={step !== 0}>
                    e a síntese: é a mesma rua, ao contrário?
                </motion.span>
                <div className="flex min-h-[38px] items-center justify-between">
                    <span className="text-[18px] font-semibold uppercase tracking-wide text-gray-300">quebra</span>
                    <Control text="Ca²⁺ da contração liga a quebra" color={C.glucoseSoft} show={step >= 2} />
                </div>
                <Lane dir={step === 0 ? 'both' : 'right'} enzyme="fosforilase" color={C.glucose} run={run}
                    left={<Molecule name="glicogênio" color={C.glycogenSoft} />}
                    right={<Molecule name="glicose-1-P" color={C.glucoseSoft} />} />

                <Wipe show={step >= 1} from="right" className="mt-2 flex flex-col gap-3 pb-1">
                    <div className="flex min-h-[38px] items-center justify-between">
                        <span className="text-[18px] font-semibold uppercase tracking-wide text-gray-300">síntese</span>
                        <Control text="glicogênio cheio freia a síntese" color={C.glycogenSoft} show={step >= 2} />
                    </div>
                    <Lane dir="left" enzyme="glicogênio sintase" color={C.glycogen} run={step >= 1 ? run : 'off'}
                        left={<Molecule name="glicogênio" color={C.glycogenSoft} />}
                        right={<Molecule name="UDP-glicose" color={C.glucoseSoft} note="glicose ativada" />} />
                </Wipe>
            </div>

            <div className="flex min-h-[96px] items-center">
                {step < 3 ? (
                    <Beat beat={step} className="max-w-[1080px]">
                        <p className="m-0 text-[27px] leading-snug text-gray-100">{STEPS[step].line}</p>
                    </Beat>
                ) : <Medals />}
            </div>
            <Source>Cori CF, Schmidt G, Cori GT. Science 1939 · Leloir LF et al. Arch Biochem Biophys 1959 · Hearris MA et al. Nutrients 2018 · Jensen J et al. Front Physiol 2011 · nobelprize.org</Source>
        </div>
    );
}
