import { Check, CircleHelp, X } from 'lucide-react';
import { C } from '../kit/palette';
import type { Verdict } from '../kit/Stamp';
import type { Tally } from '../ato1/myth.content';

/** Cor e ícone de cada veredito, e o voto da turma em % (slide 189, Mito ou Verdade?). */
export const MINI: Record<Verdict, { color: string; Icon: typeof Check }> = {
    mito: { color: C.risk, Icon: X },
    verdade: { color: C.ok, Icon: Check },
    depende: { color: C.stone, Icon: CircleHelp },
};

export interface Vote {
    pct: number;
    total: number;
}

export const voteOf = (t: Tally | undefined): Vote | null => {
    const total = t ? t.agree + t.disagree : 0;
    return t && total > 0 ? { pct: Math.round((t.agree / total) * 100), total } : null;
};
