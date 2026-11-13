import { Check, Mountain, Thermometer, X } from 'lucide-react';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { ALT, BRAUN_INDEX, EXO_DOWN, FEBBRAIO_DOSES, FEBBRAIO_TEMP, GLY_UP, HEAT, WOMEN_DROP } from './heatAltitude.content';
import { BEFORE, GroupLabel, Measure, StudyCard } from './studyBand';

/**
 * Slide 166 · o palco em duas colunas, uma cadeia em cada, um estudo por cartão: CALOR (1 Jentjens 2002,
 * 2 Febbraio 1996) e ALTITUDE (3 Péronnet 2006, 4 Braun 2000). Cada cartão diz quem e onde (termômetro e montanha;
 * "—" quando a temperatura não é dado do estudo) e desenha a medida dele com a sua unidade. A referência é sempre cinza.
 */

/** Quem e onde: amostra, temperatura (termômetro) e altitude (montanha). "—" = não é dado do estudo. */
const Meta = ({ who, temp, alt }: { who: string; temp: string; alt?: string }) => (
    <span className="flex items-center gap-2.5 whitespace-nowrap">
        {who}
        <span className="flex items-center gap-0.5"><Thermometer size={16} strokeWidth={2.6} color={C.risk} aria-hidden />{temp}</span>
        {alt && <span className="flex items-center gap-0.5"><Mountain size={16} strokeWidth={2.6} color={C.co2} aria-hidden />{alt}</span>}
    </span>
);

const DoseChip = ({ dose, won }: { dose: string; won: boolean }) => {
    const Icon = won ? Check : X;
    return (
        <span className="flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[16px] font-semibold"
            style={{ background: won ? C.ok : 'rgba(255,255,255,0.1)', color: won ? DARK_TEXT : '#E5E7EB' }}>
            <Icon size={15} strokeWidth={3} aria-hidden />{dose}
        </span>
    );
};
const DARK_TEXT = '#04080F';

/** Febbraio 1996: a 33 °C nenhuma das três soluções durou mais que o placebo; a 5 °C, a de 7% durou. */
const FebbraioRows = () => (
    <div className="flex flex-col gap-1">
        <span className="text-[16px] leading-tight"><span className="font-semibold text-gray-100">até a fadiga</span> <span className="text-gray-300">· solução de CHO × placebo</span></span>
        {[
            { temp: '33 °C', doses: FEBBRAIO_DOSES, won: false },
            { temp: '5 °C', doses: ['7%'], won: true },
        ].map(row => (
            <div key={row.temp} className="flex items-center gap-1.5">
                <span className="w-[56px] shrink-0 whitespace-nowrap text-[16px] font-semibold text-gray-200">{row.temp}</span>
                {row.doses.map(d => <DoseChip key={d} dose={d} won={row.won} />)}
            </div>
        ))}
        <span className="flex items-center gap-3 text-[16px] leading-tight text-gray-300">
            <span className="flex items-center gap-1"><Check size={15} strokeWidth={3} color={C.ok} aria-hidden />durou mais</span>
            <span className="flex items-center gap-1"><X size={15} strokeWidth={3} aria-hidden />não durou</span>
        </span>
    </div>
);

export const HeatAltitudeStage = ({ step }: { step: number }) => {
    const hot = step >= 1;
    return (
        <div className="grid h-full grid-cols-2 gap-2 p-2">
            <div className="flex min-w-0 flex-col gap-1.5">
                <GroupLabel icon={Thermometer} color={C.risk}>calor</GroupLabel>
                <StudyCard n={1} title="Jentjens 2002" show born={step === 0}
                    meta={<Meta who="9 ciclistas" temp={hot ? '16 e 35 °C' : '16 °C'} />}>
                    <div className="flex flex-col gap-2">
                        <Measure measure="glicogênio queimado" unit="g/min" max={2.4} labelWidth={48} valueWidth={44} deltaWidth={46} rows={[
                            { label: '16 °C', value: HEAT.cool.glycogen, text: br(HEAT.cool.glycogen, 2), color: BEFORE },
                            { label: '35 °C', value: hot ? HEAT.hot.glycogen : 0, text: hot ? br(HEAT.hot.glycogen, 2) : '', color: C.glycogen, delta: hot ? `+${GLY_UP}%` : undefined, deltaColor: C.glycogenSoft },
                        ]} />
                        <Measure measure="glicose bebida oxidada" unit="g/min" max={2.4} labelWidth={48} valueWidth={44} deltaWidth={46} rows={[
                            { label: '16 °C', value: HEAT.cool.exo, text: br(HEAT.cool.exo, 2), color: BEFORE },
                            { label: '35 °C', value: hot ? HEAT.hot.exo : 0, text: hot ? br(HEAT.hot.exo, 2) : '', color: C.glucose, delta: hot ? `−${EXO_DOWN}%` : undefined, deltaColor: C.glucoseSoft },
                        ]} />
                    </div>
                </StudyCard>
                <StudyCard n={2} title="Febbraio 1996" show={step >= 2} born={step === 2}
                    meta={<Meta who="6 por condição" temp={FEBBRAIO_TEMP} />}>
                    <FebbraioRows />
                </StudyCard>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
                <GroupLabel icon={Mountain} color={C.co2}>altitude</GroupLabel>
                <StudyCard n={3} title="Péronnet 2006" show={step >= 3} born={step === 3}
                    meta={<Meta who="5 homens" temp="—" alt="4.300 m" />}>
                    <div className="flex flex-col gap-2">
                        <Measure measure="CHO na energia" unit="%, a 77% do VO₂máx" max={100} labelWidth={64} valueWidth={62} rows={[
                            { label: 'mar', value: ALT.choShare.sea, text: `${br(ALT.choShare.sea, 1)}%`, color: BEFORE },
                            { label: '4.300 m', value: ALT.choShare.alt, text: `${br(ALT.choShare.alt, 1)}%`, color: C.glucose },
                        ]} />
                        <Measure measure="glicose bebida oxidada" unit="g em 40 min" max={24} labelWidth={64} valueWidth={62} rows={[
                            { label: 'mar', value: ALT.exoGrams.sea, text: `${br(ALT.exoGrams.sea, 1)} g`, color: BEFORE },
                            { label: '4.300 m', value: ALT.exoGrams.alt, text: `${br(ALT.exoGrams.alt, 1)} g`, color: C.glucose },
                        ]} />
                    </div>
                </StudyCard>
                <StudyCard n={4} title="Braun 2000" show={step >= 4} born={step === 4}
                    meta={<Meta who="16 mulheres" temp="—" alt="4.300 m" />}>
                    <Measure measure="CHO oxidado" unit="índice, mar = 100" max={100} labelWidth={64} valueWidth={36} deltaWidth={46} rows={[
                        { label: 'mar', value: BRAUN_INDEX.sea, text: '100', color: BEFORE },
                        { label: '4.300 m', value: BRAUN_INDEX.alt, text: '77', color: C.glucose, delta: WOMEN_DROP, deltaColor: C.glucoseSoft },
                    ]} />
                </StudyCard>
            </div>
        </div>
    );
};
