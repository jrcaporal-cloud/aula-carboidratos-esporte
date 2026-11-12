import { C } from '../kit/palette';

/**
 * Slide 25 · Da Boca ao Sangue. Fonte única dos textos (dossiê 01, seção E).
 * CHI2022 (amilases, enzimas da borda em escova, arquitetura do amido) · WRIGHT2011 (SGLT1 + Na⁺, Na⁺/K⁺-ATPase)
 * · FERRARIS2018 (GLUT5, KHK-C, GLUT2: Km, má absorção glicose-galactose). Estequiometria do SGLT1 NÃO entra (não confirmada).
 */

export interface DigestStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    sources: readonly string[];
}

export const DIGEST_STEPS: readonly DigestStep[] = [
    {
        tab: 'Amilases',
        headline: 'O amido é cortado ainda na luz',
        color: C.glucoseSoft,
        text: 'As α-amilases da saliva e do pâncreas cortam o amido: da amilose (cadeia reta, α-1,4) sai maltose; da amilopectina (ramos α-1,6) sobram dextrinas ramificadas. A arquitetura manda na velocidade: ramos curtos digerem devagar; amilose e cristalinidade resistem.',
        sources: ['Chi 2022 (revisão)'],
    },
    {
        tab: 'Borda em escova',
        headline: 'Só monossacarídeo atravessa',
        color: C.glucoseSoft,
        text: 'Enzimas presas às microvilosidades terminam o serviço: maltase-glicoamilase e sacarase-isomaltase soltam glicose da maltose e das dextrinas; a sacarase parte a sacarose em glicose + frutose. Dissacarídeo não atravessa: a célula só recebe monossacarídeo livre.',
        sources: ['Chi 2022 (revisão)'],
    },
    {
        tab: 'SGLT1 + Na⁺',
        headline: 'A porta que cobra energia',
        color: C.glucose,
        text: 'O SGLT1 leva glicose ou galactose junto com Na⁺, a favor do gradiente. Quem mantém o Na⁺ baixo dentro é a Na⁺/K⁺-ATPase basolateral, que gasta ATP: transporte ativo secundário. Prova clínica: sem SGLT1 (má absorção glicose-galactose), não se absorve glicose nenhuma.',
        sources: ['Wright 2011 (revisão)', 'Ferraris 2018 (revisão)'],
    },
    {
        tab: 'GLUT5 + KHK',
        headline: 'A frutose entra por outra porta',
        color: C.fructoseSoft,
        text: 'A frutose não usa o SGLT1: entra pelo GLUT5, sem Na⁺. Logo na entrada, a cetohexoquinase (KHK-C), muito expressa no intestino delgado proximal, fosforila parte dela a frutose-1-fosfato: o enterócito começa a metabolizar a frutose antes do fígado.',
        sources: ['Ferraris 2018 (revisão)'],
    },
    {
        tab: 'GLUT2 → fígado',
        headline: 'Uma saída só, e o fígado primeiro',
        color: C.glycogenSoft,
        text: 'As três hexoses saem pelo GLUT2 basolateral (para a frutose, Km mais de 5 vezes o do GLUT5) e caem na veia porta: o fígado vê tudo antes do músculo. Duas portas de entrada, uma de saída: daqui nasce o teto do próximo slide.',
        sources: ['Ferraris 2018 (revisão)'],
    },
];

/** Livro-caixa das peças: cada linha entra no passo `at` e fica. */
export const DIGEST_PARTS: readonly { at: number; name: string; does: string; color: string }[] = [
    { at: 0, name: 'α-amilase', does: 'amido → maltose + dextrinas', color: C.stone },
    { at: 1, name: 'maltase-glicoamilase', does: 'maltose, dextrinas → glicose', color: C.stone },
    { at: 1, name: 'sacarase-isomaltase', does: 'sacarose → glicose + frutose', color: C.stone },
    { at: 2, name: 'SGLT1 · apical', does: 'glicose, galactose + Na⁺', color: C.glucose },
    { at: 2, name: 'Na⁺/K⁺-ATPase', does: 'gasta ATP, sustenta o gradiente', color: C.co2 },
    { at: 3, name: 'GLUT5 · apical', does: 'frutose, sem Na⁺', color: C.fructoseSoft },
    { at: 3, name: 'KHK-C · citosol', does: 'frutose → frutose-1-P', color: C.fructoseSoft },
    { at: 4, name: 'GLUT2 · basolateral', does: 'as três → veia porta', color: C.stone },
];

export const DIGEST_CHIPS: readonly (readonly string[])[] = [
    ['revisão · digestão do amido'],
    ['revisão · digestão do amido'],
    ['revisões · transporte intestinal'],
    ['revisões · transporte intestinal'],
    ['revisões · transporte intestinal'],
];
