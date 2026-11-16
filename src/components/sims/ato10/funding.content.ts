import { EyeOff, GlassWater, MoonStar, Timer, type LucideIcon } from 'lucide-react';
import { C } from '../kit/palette';
import type { DecideRow } from './DecideShell';

/**
 * Slide 188 · Quem Paga o Estudo (HENEGHAN2012 — dossiê 07, abstract do BMJ Open; SMITH2013 — dossiê 07/03).
 * "US$ 250 mil ao ACSM" (Cohen 2012) NÃO entra: só imprensa secundária. A afiliação do 1º autor de Smith 2013
 * ao Gatorade Sports Science Institute foi conferida no registro do Europe PMC (PMID 22968309) em 12/11/2026.
 */

export interface FundingStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const FUNDING_STEPS: readonly FundingStep[] = [
    {
        tab: 'As alegações',
        headline: 'Às vésperas de Londres 2012',
        text: 'Heneghan 2012 (BMJ Open) leu 1.035 páginas de sites e anúncios e achou 431 alegações de desempenho de 104 produtos esportivos, de várias categorias, não só carboidrato. Em 52,8% dos sites não havia nenhuma referência para sustentar a alegação.',
        sources: ['Heneghan 2012 (BMJ Open)'],
    },
    {
        tab: 'As referências',
        headline: 'Metade das referências nem dava para ler',
        text: 'As alegações citavam 146 referências; 72 eram impossíveis de avaliar. Sobraram 74 estudos, e nenhuma revisão sistemática entre eles. Quase metade do que sustentava a propaganda não podia nem ser checada.',
        sources: ['Heneghan 2012 (BMJ Open)'],
    },
    {
        tab: 'A qualidade',
        headline: 'Quase nada de alta qualidade',
        text: 'Dos estudos avaliados, 84% tinham alto risco de viés. A randomização apareceu em 58,1%; o cegamento estava claro em 27,0% e o sigilo de alocação em 6,8%. Só 3 de 74 (2,7%) eram de alta qualidade. A associação da indústria de bebidas acusou a série de viés.',
        sources: ['Heneghan 2012 (BMJ Open)'],
    },
    {
        tab: 'Como ler',
        headline: 'Financiar não é falsificar',
        text: 'O problema é o desenho que favorece o produto: jejum, tempo até a exaustão, placebo de água. Smith 2013, com 1º autor no Gatorade Sports Science Institute, é duplo-cego e multicêntrico. Julgue pelo método.',
        sources: ['Smith 2013 (dose-resposta)'],
    },
];

export interface FunnelRow {
    at: number;
    n: number;
    label: string;
}

export const FUNNEL: readonly FunnelRow[] = [
    { at: 0, n: 431, label: 'alegações · 104 produtos' },
    { at: 1, n: 146, label: 'referências · 72 sem como avaliar' },
    { at: 1, n: 74, label: 'estudos avaliáveis · 0 revisões sistemáticas' },
    { at: 2, n: 3, label: 'de alta qualidade · 2,7% dos 74' },
];

/** Critérios de qualidade nos estudos avaliados (% dos estudos). */
export const QUALITY = [
    { label: 'randomizados', pct: 58.1, shown: '58,1%' },
    { label: 'cegamento claro', pct: 27.0, shown: '27,0%' },
    { label: 'sigilo de alocação claro', pct: 6.8, shown: '6,8%' },
    { label: 'alto risco de viés', pct: 84, shown: '84%' },
] as const;

export const STUDIES = { total: 74, high: 3 } as const;

export const FUNDING_LEDGER: readonly DecideRow[] = [
    { at: 0, term: 'sites sem nenhuma referência', value: '52,8%', color: C.stone },
    { at: 1, term: 'referências impossíveis de avaliar', value: '72 de 146', color: C.stone },
    { at: 2, term: 'estudos de alta qualidade', value: '3 de 74', color: C.risk },
];

export interface Check {
    icon: LucideIcon;
    ask: string;
}

/** As quatro perguntas de leitura (o desenho que infla o efeito, slides anteriores do Ato X). */
export const CHECKS: readonly Check[] = [
    { icon: EyeOff, ask: 'Atleta e avaliador cegos?' },
    { icon: MoonStar, ask: 'Teste em jejum noturno?' },
    { icon: Timer, ask: 'TTE ou contrarrelógio?' },
    { icon: GlassWater, ask: 'Placebo de água ou de sabor igual?' },
];

export const DESIGNS = ['avaliação sistemática · 1.035 páginas', 'avaliação sistemática · 146 referências', '74 estudos avaliados', 'Smith 2013: duplo-cego · n = 51'] as const;
