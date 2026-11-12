/**
 * Slide 61 · Dois cientistas, uma bicicleta. Fonte: dossiê 02 · BERGSTROM1966 (desenho e números via Stout 2025,
 * texto completo; a Nature 1966 não foi lida), conclusão "localizada" no texto original de BERGSTROM1967,
 * confirmação na meta-análise de Solem 2025 (dossiê 04). Só o "+50–60%" é número; as alturas são ilustrativas.
 */

export const LEG_TABS = ['O desenho', 'Exaustão', 'Dia 1', 'Dia 3', 'Local'] as const;

export interface LegPoint {
    label: string;
    /** Glicogênio da perna que pedalou, relativo à parada (= 1). Ilustrativo, menos no dia 3 (meio de 50–60%). */
    worked: number;
    /** Passo em que o par de barras entra. */
    at: number;
}

export const LEG_POINTS: readonly LegPoint[] = [
    { label: 'antes', worked: 1, at: 0 },
    { label: 'exaustão', worked: 0.22, at: 1 },
    { label: 'dia 1', worked: 1.18, at: 2 },
    { label: 'dia 3', worked: 1.55, at: 3 },
];

/** Nível da perna que pedalou, por passo (para a cor da perna na cena). */
export const LEG_LEVEL = [1, 0.22, 1.18, 1.55, 1.55] as const;

export interface LegCard {
    title: string;
    at: number;
    lines: readonly { at: number; text: string }[];
}

export const LEG_CARDS: readonly LegCard[] = [
    {
        title: 'O desenho',
        at: 0,
        lines: [{ at: 0, text: 'St. Erik\'s Hospital, Estocolmo. Lados opostos do mesmo cicloergômetro, uma perna cada, até a exaustão; depois, 3 dias de dieta rica em carboidrato e biópsias das duas pernas. A perna parada é o controle.' }],
    },
    {
        title: 'O resultado',
        at: 1,
        lines: [
            { at: 1, text: 'Exaustão: só a perna que pedalou esvazia.' },
            { at: 2, text: 'Dia 1: a exercitada já passa a parada.' },
            { at: 3, text: 'Dia 3: 50–60% acima, mesma dieta nas duas.' },
        ],
    },
    {
        title: 'A leitura',
        at: 4,
        lines: [{ at: 4, text: 'O aumento da síntese fica no músculo que trabalhou (Bergström 1967); a meta-análise de Solem 2025 confirma. Ressalvas: n = 2, autoexperimento, sem cegamento; a Nature 1966 não foi lida no original.' }],
    },
];

export const ONE_LEG_SOURCES: readonly (readonly string[])[] = [
    ['Bergström & Hultman, Nature 1966', 'Stout 2025 (relato de Harris)'],
    [],
    [],
    [],
    ['Bergström et al., Acta Physiol Scand 1967', 'Solem 2025 (Front Physiol)'],
];
