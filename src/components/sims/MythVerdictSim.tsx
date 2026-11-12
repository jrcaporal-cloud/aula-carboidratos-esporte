import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DesignChip } from './kit/chips';
import { Panel, Source } from './kit/ui';
import { loadTallies, type Tally } from './ato1/myth.content';
import { SIM_H } from './ato10/units';
import { Board, IntroPanel, ScorePanel, VerdictPanel } from './ato10/VerdictParts';
import { voteOf } from './ato10/verdictVotes';
import { SOURCE, VERDICTS } from './ato10/verdict.content';

/**
 * Slide 189 · Mito ou Verdade? O clímax da aula. À esquerda, o quadro das 8 afirmações do slide «O Que a Turma Já Acha»
 * se preenche: carimbo, número que decide, estudo e o voto da turma. À direita, o veredito da vez com o porquê.
 * Último passo: o placar (7 mitos, 1 depende, 0 verdades) e quantos mitos a turma derrubou na votação do começo.
 * Os votos são lidos do mesmo lugar onde o slide de votação grava (loadTallies, sessionStorage); sem votos, funciona igual.
 */
/** Abertura + 8 vereditos + placar. */
const STEPS = VERDICTS.length + 2;
const SCORE_STEP = VERDICTS.length + 1;

/** Quantos mitos a turma derrubou: a maioria discordou da afirmação. Só conta afirmações com voto. */
const crowdHits = (tallies: readonly Tally[]): { hit: number; of: number } | null => {
    const myths = VERDICTS.map((v, i) => ({ v, t: tallies[i] })).filter(({ v, t }) => v.verdict === 'mito' && t && t.agree + t.disagree > 0);
    return myths.length ? { hit: myths.filter(({ t }) => t.disagree > t.agree).length, of: myths.length } : null;
};

export default function MythVerdictSim() {
    const { step, setStep } = useSlideSteps(STEPS);
    // Votos do slide de votação: lidos uma vez ao abrir; sem votos (ou storage bloqueado) o slide funciona igual.
    const [tallies] = useState(loadTallies);
    const votes = VERDICTS.map((_, i) => voteOf(tallies[i]));
    const votedCount = votes.filter(Boolean).length;
    const index = step - 1;
    const isVerdict = step > 0 && step < SCORE_STEP;
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ height: SIM_H }}>
            <div className="flex min-h-[36px] items-center justify-between gap-4">
                <span className="text-[18px] font-semibold text-gray-200">
                    {step === 0 ? 'Abertura' : isVerdict ? `Veredito ${step} de 8` : 'Placar'}
                </span>
                {isVerdict && <DesignChip>{VERDICTS[index].source}</DesignChip>}
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <div className="w-[600px] shrink-0"><Board step={step} votes={votes} onSelect={setStep} /></div>
                <Panel className="min-w-0 flex-1 px-6 py-5">
                    {step === 0 && <IntroPanel votedCount={votedCount} />}
                    {isVerdict && <VerdictPanel key={step} index={index} vote={votes[index]} />}
                    {step === SCORE_STEP && <ScorePanel crowd={crowdHits(tallies)} />}
                </Panel>
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
