/** Slide 60 · A agulha que veio da nefrologia. Fonte: dossiê 02 (BIOPSIA-BERGSTROM: Stout 2025, Ekblom 2017). */

export const NEEDLE_LEADS = [
    'Estocolmo, 1959: um nefrologista quer medir sal dentro do músculo, não açúcar.',
    'A agulha atravessa a pele da coxa, entra no vasto lateral e corta um fragmento.',
    'Sai um pedaço de músculo humano vivo: dá para dosar e olhar ao microscópio.',
    'Com a dosagem de Hultman, o combustível dentro do músculo virou número. Na lâmina, o PAS cora o glicogênio.',
] as const;

/** Marcos da linha do tempo; `from` = primeiro passo em que o marco acende. */
export const NEEDLE_MILESTONES = [
    { year: '1959', text: 'a agulha, para estudar eletrólitos com diuréticos', from: 0 },
    { year: '1962', text: 'o artigo dos eletrólitos musculares', from: 1 },
    { year: '+ Hultman', text: 'a dosagem de glicose vira medida de glicogênio', from: 3 },
] as const;

export const NEEDLE_SOURCE = 'Stout 2025 (J Int Soc Sports Nutr); Ekblom 2017; Bergström 1975';
