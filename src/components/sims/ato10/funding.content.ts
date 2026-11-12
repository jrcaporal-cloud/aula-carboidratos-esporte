import { EyeOff, GlassWater, MoonStar, Timer, type LucideIcon } from 'lucide-react';

/** Slide 188 · Quem Paga o Estudo (HENEGHAN2012 — dossiê 07; SMITH2013 — dossiê 03). "US$ 250 mil ao ACSM" NÃO entra. */

export const LINES = [
    'Às vésperas de Londres 2012, o BMJ checou as alegações de desempenho dos produtos esportivos.',
    'Das referências citadas, metade nem dava para avaliar. Das avaliáveis, quase nada era de alta qualidade.',
    'Financiar não é falsificar. A resposta é ler o método, não descartar o carboidrato.',
] as const;

export interface FunnelRow {
    n: number;
    label: string;
}

export const FUNNEL: readonly FunnelRow[] = [
    { n: 431, label: 'alegações (104 produtos)' },
    { n: 146, label: 'referências citadas' },
    { n: 74, label: 'estudos que dava para avaliar' },
    { n: 3, label: 'de alta qualidade' },
];

export const SIDE = [
    { value: '52,8%', caption: 'dos sites sem nenhuma referência' },
    { value: '2,7%', caption: 'dos estudos avaliáveis com alta qualidade' },
] as const;

export interface Check {
    icon: LucideIcon;
    ask: string;
}

export const CHECKS: readonly Check[] = [
    { icon: EyeOff, ask: 'Atleta e avaliador estavam cegos?' },
    { icon: MoonStar, ask: 'O teste foi em jejum noturno?' },
    { icon: Timer, ask: 'Tempo até a exaustão ou contrarrelógio?' },
    { icon: GlassWater, ask: 'Placebo de água ou com o mesmo sabor?' },
];

export const SMITH = {
    title: 'A curva dose–resposta de Smith 2013',
    text: '1º autor do Gatorade Sports Science Institute, e mesmo assim duplo-cego, 4 centros, 51 atletas. O desenho é que se lê.',
} as const;

export const DESIGNS = ['avaliação sistemática · 1.035 páginas', '84% dos estudos com alto risco de viés', 'checklist de leitura'] as const;

export const SOURCE = 'Heneghan C et al. The evidence underpinning sports performance products. BMJ Open 2012 · Smith JW et al. Med Sci Sports Exerc 2013.';
