import { C } from '../../sims/kit/palette';

/** Cor de cada modelo na linguagem de cor da aula (borda da arte que cresce e indicador de carga). */
const ACCENTS: Readonly<Record<string, string>> = {
    'glicogenio-granulo': C.glycogen,
    enterocito: C.glucose,
    'fibra-glicogenio': C.glycogen,
    'biopsia-agulha': C.glycogen,
    'triade-calcio': C.insulinSoft,
};

export const accentOf = (model: string | null): string => (model && ACCENTS[model]) || C.caveat;
