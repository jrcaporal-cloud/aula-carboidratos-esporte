import type { Transition, Variants } from 'framer-motion';
import type { ArtRect } from './measureArt';

/** Abertura e fechamento: ambos ≤ 0,6 s (o fechamento é mais curto para não segurar o professor). */
const OPEN_S = 0.6;
const CLOSE_S = 0.5;
const EASE_OPEN = [0.33, 1, 0.68, 1] as const;
const EASE_CLOSE = [0.32, 0.72, 0, 1] as const;
/** Cantos arredondados do retângulo enquanto ele ainda é "a arte do slide". */
const ART_RADIUS = 18;
/** Escuridão do resto do slide durante a cena (o 3D cobre tudo; isso só aparece na transição). */
const DIM = 0.6;

const FULL = 'inset(0px 0px 0px 0px round 0px)';
const insetOf = (r: ArtRect | null): string =>
    r ? `inset(${r.top}px ${r.right}px ${r.bottom}px ${r.left}px round ${ART_RADIUS}px)` : FULL;
/** Espessura da moldura na cor do modelo. */
const FRAME_PX = 4;
/** Recuos (top/right/bottom/left) da moldura: a arte aberta `grow` px para fora; sem arte, a tela toda. */
const edgesOf = (r: ArtRect | null, grow: number) => ({
    top: (r?.top ?? 0) - grow,
    right: (r?.right ?? 0) - grow,
    bottom: (r?.bottom ?? 0) - grow,
    left: (r?.left ?? 0) - grow,
});

export interface MorphVariants {
    root: Variants;
    dim: Variants;
    door: Variants;
    veil: Variants;
    content: Variants;
    frame: Variants;
}

/** Variantes compartilhadas por nome (hidden → shown → gone); com movimento reduzido, só esmaece. */
export const buildMorphVariants = (reduced: boolean): MorphVariants => {
    const open: Transition = reduced ? { duration: 0.2 } : { duration: OPEN_S, ease: EASE_OPEN };
    const close: Transition = reduced ? { duration: 0.2 } : { duration: CLOSE_S, ease: EASE_CLOSE };
    const instant: Transition = { duration: 0 };

    return {
        // A raiz não se move: só segura a saída até as camadas internas terminarem.
        root: {
            hidden: { opacity: 1 },
            shown: { opacity: 1, transition: instant },
            gone: { opacity: 1, transition: close },
        },
        dim: {
            hidden: { opacity: 0 },
            shown: { opacity: DIM, transition: open },
            gone: { opacity: 0, transition: close },
        },
        door: {
            hidden: (r: ArtRect | null) => (reduced ? { clipPath: FULL, opacity: 0 } : { clipPath: insetOf(r), opacity: 1 }),
            shown: { clipPath: FULL, opacity: 1, transition: open },
            gone: (r: ArtRect | null) => (reduced ? { clipPath: FULL, opacity: 0, transition: close } : { clipPath: insetOf(r), transition: close }),
        },
        // Véu escuro dentro do retângulo: começa translúcido (a arte ainda aparece) e fecha; na volta, abre.
        veil: {
            hidden: { opacity: reduced ? 1 : 0.2 },
            shown: { opacity: 1, transition: reduced ? instant : { duration: OPEN_S * 0.55, ease: 'easeOut' } },
            gone: { opacity: 0, transition: reduced ? instant : { duration: CLOSE_S * 0.7, delay: CLOSE_S * 0.3, ease: 'easeIn' } },
        },
        content: {
            hidden: { scale: reduced ? 1 : 0.94 },
            shown: { scale: 1, transition: open },
            gone: { scale: reduced ? 1 : 0.96, transition: close },
        },
        // Moldura por cima da porta, 4 px para fora da borda: anda junto com ela (recuos em px, um elemento só).
        frame: {
            hidden: (r: ArtRect | null) => ({ ...edgesOf(r, FRAME_PX), opacity: reduced ? 0 : 1 }),
            shown: { ...edgesOf(null, FRAME_PX), opacity: 0, transition: reduced ? instant : { ...open, opacity: { duration: 0.15, delay: OPEN_S } } },
            gone: (r: ArtRect | null) => (reduced
                ? { opacity: 0, transition: instant }
                : { ...edgesOf(r, FRAME_PX), opacity: 1, transition: { ...close, opacity: { duration: 0.1 } } }),
        },
    };
};
