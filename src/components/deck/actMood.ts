import { CHAPTERS } from '../../data/chapters';
import { C } from '../sims/kit/palette';
import { actOfSection } from './acts';

/**
 * Clima do fundo em cada ato: quantos anéis de glicose e quantas faíscas de "combustível" há na sala,
 * de que cor são os anéis e em que ritmo tudo deriva. O fundo só anima durante a troca de clima
 * (`settleMs`) e volta a congelar: não disputa GPU com os slides.
 */
export interface Mood {
    /** Fração dos anéis de glicose visíveis (0 → 1). */
    rings: number;
    /** Fração das faíscas âmbar visíveis (0 → 1). */
    sparks: number;
    ringColor: string;
    ringGlow: string;
    /** Intensidade da luz quente (âmbar) que vem do canto. */
    warm: number;
    /** Multiplicador da velocidade de deriva. */
    speed: number;
    /** Distância extra da câmera (o fundo "se afasta" no fim). */
    pull: number;
    /** Opacidade do fundo inteiro. */
    opacity: number;
    /** Quanto tempo o fundo fica animado ao entrar neste clima. */
    settleMs: number;
}

/** Brilho (emissivo) da cor: a mesma cor escurecida, para os anéis não estourarem. */
const glowOf = (hex: string, k = 0.35): string => {
    const n = parseInt(hex.slice(1), 16);
    const ch = (shift: number) => Math.round(((n >> shift) & 255) * k).toString(16).padStart(2, '0');
    return `#${ch(16)}${ch(8)}${ch(0)}`;
};

export const BASE_MOOD: Mood = {
    rings: 0.6, sparks: 0.6, ringColor: C.glucose, ringGlow: glowOf(C.glucose),
    warm: 2.2, speed: 1, pull: 0, opacity: 0.28, settleMs: 3200,
};

/**
 * Dramaturgia do fundo, na ordem de CHAPTERS: a sala "tem combustível" no começo e na prova, esvazia nos
 * atos do tanque baixo (IV no fim do ato, VIII inteiro), reabastece no VII e se aquieta no X para a leitura.
 */
const ACT_SHAPE: readonly Partial<Mood>[] = [
    { rings: 0.6, sparks: 0.6 },                // I   A Largada
    { rings: 0.8, sparks: 0.35, speed: 0.8 },   // II  A Molécula: muitos anéis, pouca faísca
    { rings: 0.55, sparks: 0.75, speed: 1.3 },  // III O Motor: o fogo anda mais rápido
    { rings: 0.5, sparks: 0.3 },                // IV  O Tanque: o estoque baixando
    { rings: 0.7, sparks: 0.45, warm: 2.6 },    // V   Antes da Largada: tanque enchendo
    { rings: 0.6, sparks: 0.85, speed: 1.25 },  // VI  Durante a Prova
    { rings: 0.75, sparks: 0.4, speed: 0.9 },   // VII Depois da Chegada: reabastecendo
    { rings: 0.3, sparks: 0.15, warm: 1.4 },    // VIII Treinar com Pouco: sala com pouco combustível
    { rings: 0.6, sparks: 0.5 },                // IX  Cada Esporte
    { rings: 0.45, sparks: 0.25, speed: 0.7, opacity: 0.22, pull: 1.5 }, // X Ler e Decidir: o fundo se afasta
];

/** Um clima por ato, na ordem de CHAPTERS. */
export const ACT_MOODS: readonly Mood[] = CHAPTERS.map((c, i) => ({
    ...BASE_MOOD, ...ACT_SHAPE[i], ringColor: c.color, ringGlow: glowOf(c.color),
}));

/** Climas de slides específicos (pelo id do JSON), acima do clima do ato. */
export const SLIDE_MOODS: ReadonlyMap<number, Mood> = new Map([
    // Capa: o fundo em primeiro plano.
    [0, { ...BASE_MOOD, rings: 0.75, sparks: 0.8, opacity: 0.95 }],
]);

/** Clima do slide: o próprio, se houver; senão o do ato; fora de ato, o neutro. */
export const moodFor = (slideId: number, section: string): Mood =>
    SLIDE_MOODS.get(slideId) ?? ACT_MOODS[actOfSection(section)] ?? BASE_MOOD;
