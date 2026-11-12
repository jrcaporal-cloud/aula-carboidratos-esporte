import { C } from '../kit/palette';
import type { LedgerRow } from './shellA';

/**
 * Slide 60 · A agulha que veio da nefrologia. Fonte: dossiê 02 · BIOPSIA-BERGSTROM (Stout 2025, texto completo;
 * Ekblom 2017; Bergström 1975), KROGH1920 e CHRISTENSEN1939 (antes da agulha), GOLLNICK1974 (PAS semiquantitativo),
 * BERGSTROM1967 (faixa 0,6–4,7 g/100 g). A cronologia é memória oral de Roger Harris, via Stout 2025.
 */

export interface NeedleStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const STOUT = 'Stout 2025 (relato de Harris)';

export const NEEDLE_STEPS: readonly NeedleStep[] = [
    {
        tab: '1959 · a nefrologia',
        headline: 'Uma agulha para medir sal',
        text: 'Jonas Bergström era nefrologista. No doutorado no Karolinska, estudava a perda de eletrólitos causada por diuréticos e precisava medi-los dentro do músculo. Adaptou a técnica de Polley & Bickel e, em 1959, chegou à agulha percutânea. A pergunta era renal, não esportiva.',
        sources: [STOUT],
    },
    {
        tab: 'A biópsia',
        headline: 'Pela pele, até o vasto lateral',
        text: 'A agulha atravessa pele e subcutâneo e entra no vasto lateral. A cânula tem uma janela lateral: o músculo entra pela janela e o cilindro interno corta o fragmento. Em 1962 saiu o artigo dos eletrólitos musculares, dosados por ativação de nêutrons nessas amostras.',
        sources: [STOUT, 'Bergström 1962; 1975 (técnica)', 'Ekblom 2017'],
    },
    {
        tab: 'A dosagem',
        headline: 'Hultman tinha a dosagem',
        text: 'No St. Erik\'s Hospital, em Estocolmo, Eric Hultman tinha um método de dosagem de glicose (Nature, 1959). Agulha + dosagem: o glicogênio do fragmento é quebrado até glicose, e a glicose é medida. O combustível dentro do músculo humano virou número, em g/100 g de músculo úmido.',
        sources: [STOUT, 'Bergström 1967'],
    },
    {
        tab: 'A lâmina',
        headline: 'O mesmo fragmento, fibra a fibra',
        text: 'A dosagem dá a média do fragmento. Cortado fino e corado com PAS (ácido periódico de Schiff), ele mostra o glicogênio em cada fibra; a ATPase mostra o tipo da fibra. É a leitura de "Quem Esvazia Primeiro". Ressalva: as datas vêm de memória oral, numa revisão narrativa.',
        sources: [STOUT, 'Gollnick 1974'],
    },
];

/** O que cada ferramenta deixava ver: uma linha por passo, e fica. */
export const NEEDLE_LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'antes', text: 'trocas gasosas e glicemia; músculo invisível', color: C.co2 },
    { at: 1, label: 'agulha', text: 'amostra do músculo antes e depois do exercício', color: C.stone },
    { at: 2, label: 'dosagem', text: 'glicogênio do fragmento, em g/100 g: a média', color: C.glucoseSoft },
    { at: 3, label: 'PAS', text: 'glicogênio fibra a fibra; semiquantitativo', color: C.glycogenSoft },
];

/** Linha do tempo do topo do palco; `at` = passo em que o marco acende. */
export const NEEDLE_MILESTONES = [
    { year: '1959', label: 'a agulha', at: 0 },
    { year: '1962', label: 'eletrólitos', at: 1 },
    { year: '1959', label: 'dosagem', at: 2 },
    { year: '1966', label: 'uma perna', at: 3 },
    { year: '1967', label: 'três dietas', at: 3 },
] as const;
