import { useSlideSteps } from '../../store/useSlideSteps';
import { DesignChip } from './kit/chips';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { Accrue, MolFrame, StepText } from './ato2/moleculaA.ui';
import { LM_W, LeloirMap } from './ato2/leloirMap';

/**
 * Slide 23 · Síntese não é Quebra ao Contrário. Palco: o ciclo do glicogênio em duas pistas opostas
 * (fosforilase × UDP-glicose → glicogênio sintase + ramificadora), que ganha os controles de cada pista e,
 * no fim, os dois Nobel. Painel: texto do passo e um livro de datas e dados que acumula.
 */
interface LeloirStep { tab: string; headline: string; color: string; text: string; chip: string; sources: readonly string[] }

const STEPS: readonly LeloirStep[] = [
    {
        tab: '1939', headline: 'Parecia uma rua de mão dupla', color: C.glucose, chip: 'extrato de músculo · in vitro',
        text: 'Num extrato de músculo, Carl e Gerty Cori viram a fosforilase montar um polissacarídeo a partir de glicose-1-fosfato. Se a enzima que quebra também constrói, a síntese seria a quebra andando para trás.',
        sources: ['Cori 1939'],
    },
    {
        tab: 'Leloir', headline: 'A síntese usa outro doador', color: C.glycogenSoft, chip: 'bioquímica · músculo e fígado',
        text: 'O grupo de Leloir, em Buenos Aires, mostrou a síntese a partir de UDP-glicose, a glicose ativada com UTP. Quem alonga (α-1,4) é a glicogênio sintase; a ramificadora cria os ramos (α-1,6). No corpo, a fosforilase só quebra.',
        sources: ['Leloir 1959 e 1960', 'Roach 2012'],
    },
    {
        tab: 'Dois controles', headline: 'Duas enzimas, dois freios', color: C.ok, chip: 'revisões',
        text: 'O Ca²⁺ da contração ativa a fosforilase quinase via calmodulina, que liga a fosforilase; AMP e Pi ajustam o fluxo. Na outra pista, glicose-6-P ativa a sintase, a fosforilação a desliga e o glicogênio cheio a freia.',
        sources: ['Hearris 2018', 'Howlett 1998', 'Roach 2012', 'Jensen 2011'],
    },
    {
        tab: 'Nobel', headline: 'Um Nobel para cada sentido', color: C.glucoseSoft, chip: 'nobelprize.org',
        text: 'A quebra rendeu o Nobel de Fisiologia ou Medicina de 1947 (Carl e Gerty Cori, metade; a outra metade foi de Houssay). A construção, o de Química de 1970 a Leloir, pelos nucleotídeos de açúcar.',
        sources: ['nobelprize.org'],
    },
];

interface Entry { at: number; tag: string; color: string; text: string }

const BOOK: readonly Entry[] = [
    { at: 0, tag: '1939', color: C.glucoseSoft, text: 'Cori: fosforilase monta polissacarídeo no tubo' },
    { at: 1, tag: '1959–60', color: C.glycogenSoft, text: 'Leloir: glicogênio a partir de UDP-glicose' },
    { at: 2, tag: 'clamp', color: C.ok, text: '70–90% da glicose captada vira glicogênio' },
    { at: 3, tag: '1947', color: C.glucoseSoft, text: 'Nobel de Medicina: Cori (½) e Houssay (½)' },
    { at: 3, tag: '1970', color: C.glycogenSoft, text: 'Nobel de Química: Leloir' },
];

const Book = ({ step }: { step: number }) => (
    <div className="flex flex-col">
        {BOOK.filter(e => e.at <= step).map((e, i) => (
            <Accrue key={e.tag} at={e.at} step={step} delay={0.5 + i * 0.05}
                className="grid grid-cols-[92px_1fr] items-baseline gap-2 border-b-2 border-white/10 py-1">
                <span className="font-display text-[18px] font-bold" style={{ color: e.color }}>{e.tag}</span>
                <span className="text-[16px] leading-snug text-gray-100">{e.text}</span>
            </Accrue>
        ))}
    </div>
);

export default function LeloirSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <MolFrame tabs={STEPS.map(x => x.tab)} step={step} setStep={setStep} layoutId="leloir-tabs" stageWidth={LM_W}
            stage={<LeloirMap step={step} />}
            chips={<DesignChip>{s.chip}</DesignChip>}
            source={sourcesUpTo(STEPS.map(x => x.sources), step)}>
            <StepText step={step} color={s.color} headline={s.headline} text={s.text} />
            <Book step={step} />
        </MolFrame>
    );
}
