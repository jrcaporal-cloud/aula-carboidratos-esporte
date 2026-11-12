import { CHAPTERS, type Chapter } from '../../data/chapters';

/** Atos na ordem da aula: I, II, … (índice 0, 1, …). */
export const ROMANS: readonly string[] = CHAPTERS.map(c => c.roman);

/** "Ato III · Glicogênio" → 2. Fora do padrão ou ato inexistente → -1. */
export const actOfSection = (section: string): number => {
    const match = section.match(/^Ato ([IVX]+)\b/);
    return match ? ROMANS.indexOf(match[1]) : -1;
};

/** Capítulo da seção, se ela pertence a um ato. */
export const chapterOfSection = (section: string): Chapter | undefined => CHAPTERS[actOfSection(section)];

/**
 * Ao avançar de `fromSection` para `toSection`: devolve o capítulo do ato novo quando ele é posterior
 * ao anterior (a cortina toca); voltando, ficando no mesmo ato ou fora de ato, devolve null.
 */
export const curtainForCrossing = (fromSection: string, toSection: string): Chapter | null => {
    const from = actOfSection(fromSection);
    const to = actOfSection(toSection);
    if (to < 0 || to <= from) return null;
    return CHAPTERS[to] ?? null;
};
